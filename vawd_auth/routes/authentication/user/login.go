package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type loginDetails struct {
	UserName string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password" binding:"required"`
}

type jwtTokens struct {
	AccessToken  string
	RefreshToken string
}

func LoginUser(c *gin.Context) {
	var req loginDetails

	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	if req.Email == "" && req.UserName == "" {
		c.JSON(400, gin.H{
			"error": "Either username or email is required",
		})
		return
	}

	var user database.Profile
	if req.Email == "" {
		var err error
		user, err = gorm.G[database.Profile](database.DB).Where("user_name = ?", req.UserName).First(ctx)
		if err != nil {
			c.JSON(400, gin.H{
				"error": "Invalid Credentials",
			})
			return
		}
	} else {
		var err error
		user, err = gorm.G[database.Profile](database.DB).Where("email = ?", req.Email).First(ctx)
		if err != nil {
			c.JSON(400, gin.H{
				"error": "Invalid Credentials",
			})
			return
		}
	}

	if user.Password == nil {
		c.JSON(400, gin.H{
			"error": "User logged in with google",
		})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(*user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Password Mismatch",
		})
		return
	}

	jwtT := &jwtTokens{}
	err = func() error {
		refreshToken, err := tokens.TokenMethods.GenerateRefreshToken(user.UserID.String(), user.Email, user.UserName, user.ProfilePic)
		if err != nil {
			return err
		}
		accessToken, err := tokens.TokenMethods.GenerateAccessToken(user.UserID.String(), user.Email, user.UserName, user.ProfilePic)
		if err != nil {
			return err
		}
		jwtT.RefreshToken = refreshToken
		jwtT.AccessToken = accessToken
		return nil
	}()
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Error creating tokens",
		})
		return
	}
	response := map[string]string{"userId": user.UserID.String(), "email": user.Email, "username": user.UserName}

	c.SetCookie("refreshToken", (*jwtT).RefreshToken, 24*60*60*15, "/auth/refresh", "localhost", false, true)

	c.SetCookie("accessToken", (*jwtT).AccessToken, 24*60*60, "/", "localhost", false, true)

	c.JSON(200, gin.H{
		"user": response,
	})
}
