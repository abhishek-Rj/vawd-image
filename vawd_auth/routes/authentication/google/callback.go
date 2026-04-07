package google

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type jwtTokens struct {
	AccessToken  string
	RefreshToken string
}

func GoogleCallback(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()
	code := c.Query("code")
	token, err := config.GoogleConfig.Exchange(ctx, code)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Code exchange failed",
		})
		return
	}

	client := config.GoogleConfig.Client(ctx, token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(400, gin.H{
			"error": "failed to get user info",
		})
		return
	}
	defer resp.Body.Close()

	var user map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		c.JSON(400, gin.H{
			"error": "Chud gye guru",
		})
	}

	fullName := user["name"].(string)
	parts := strings.Split(fullName, " ")
	firstName := parts[0]
	lastName := ""
	if len(parts) > 1 {
		lastName = parts[1]
	}
	email:= user["email"].(string)
	base := strings.ToLower(strings.ReplaceAll(user["name"].(string), " ", ""))
	suffix := rand.Intn(10000)
	username := fmt.Sprintf("%s_%04d", base, suffix)
	profilePic:= user["picture"].(string)
	

	profile, err := gorm.G[database.Profile](database.DB).Where("email = ?", email).First(ctx)
	if err == nil {
		if profile.AuthProvider == "google" {
			jwtT := &jwtTokens{}
			err = func() error {
				refreshToken, err := tokens.TokenMethods.GenerateRefreshToken(profile.UserID.String(), email, username, profilePic)
				if err != nil {
					return err
				}
				accessToken, err := tokens.TokenMethods.GenerateAccessToken(profile.UserID.String(), email, username, profilePic)
				if err != nil {
					return err
				}
				jwtT.RefreshToken = refreshToken
				jwtT.AccessToken = accessToken
				return nil
			}()
			c.SetCookie("refreshToken", (*jwtT).RefreshToken, 24*60*60*15, "/auth/refresh", "localhost", false, true)
			c.SetCookie("accessToken", (*jwtT).AccessToken, 24*60*60, "/", "localhost", false, true)

			c.Redirect(302, "http://localhost:3000/explore")
			return
		} else {
			c.JSON(400, gin.H{
				"error": "Email already in use",
			})
			return
		}
	}	
	var userProfile database.Profile

	txErr := database.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		user := database.User{}
		if err := tx.Create(&user).Error; err != nil {
			c.JSON(400, gin.H{
				"error": "Failed to create User",
			})
			return err
		}

		userProfile = database.Profile{
			UserID:    user.ID,
			Email:     email,
			FirstName: firstName,
			LastName:  lastName,
			UserName:  username,
			Password:  nil,
			ProfilePic: profilePic,
			AuthProvider: "google",
		}

		if err = tx.Create(&userProfile).Error; err != nil {
			c.JSON(500, gin.H{
				"error": "Failed to create Profile",
			})
			return err
		}

		return nil
	})		
	if txErr != nil {
		c.JSON(400, gin.H{
			"error": "Cannot create user",
		})
		return
	}
	jwtT := &jwtTokens{}
	err = func() error {
		refreshToken, err := tokens.TokenMethods.GenerateRefreshToken(userProfile.UserID.String(), email, username, profilePic)
		if err != nil {
			return err
		}
		accessToken, err := tokens.TokenMethods.GenerateAccessToken(userProfile.UserID.String(), email, username, profilePic)
		if err != nil {
			return err
		}
		jwtT.RefreshToken = refreshToken
		jwtT.AccessToken = accessToken
		return nil
	}()
	c.SetCookie("refreshToken", (*jwtT).RefreshToken, 24*60*60*15, "/auth/refresh", "localhost", false, true)
	c.SetCookie("accessToken", (*jwtT).AccessToken, 24*60*60, "/", "localhost", false, true)

	c.Redirect(302, "http://localhost:3000/explore")
}
