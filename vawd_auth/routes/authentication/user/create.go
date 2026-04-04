package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type signupDetails struct {
	FirstName	string 	`json:"firstname" binding:"required"`
	LastName	string	`json:"lastname"`
	UserName	string	`json:"username" binding:"required"`
	Email		string 	`json:"email" binding:"required,email"`
	Password	string	`json:"password" binding:"required,min=6"`
}

func CreateUser(c* gin.Context) {
	var req signupDetails

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	user, err := gorm.G[database.Profile](database.DB).Where("user_name = ? OR email = ?", req.UserName, req.Email).First(ctx);

	if err != nil {
		c.JSON(401, gin.H{
			"error": "User with " + user.Email + " already exits",
		})
		return
	}
	
	var response map[string]string
	
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), config.App.BcryptCost)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	txErr := database.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		user := database.User{}
		if err := tx.Create(&user).Error; err != nil {
			c.JSON(400, gin.H{
				"error": "Failed to create User",
			})
			return err
		}

		profile := database.Profile{
			UserID: user.ID,
			Email: req.Email,
			FirstName: req.FirstName,
			LastName: req.LastName,
			UserName: req.UserName,	
			Password: req.Password,
		}
		
		profile.Password = string(hashPassword)
		
		if err = tx.Create(&profile).Error; err != nil {
			c.JSON(500, gin.H{
				"error": "Failed to create Profile",
			})
			return err
		}
		
		response = map[string]string{"userId": profile.UserID.String(), "email": profile.Email, "username": profile.UserName}
		return nil
	})

	if txErr != nil {
		c.JSON(400, gin.H{
			"error": "Failed to create user",
			"detail": txErr,
		})
	}

	accessToken, err := tokens.TokenMethods.GenerateAccessToken(response["userId"], response["email"], response["username"])
	if err != nil {
		c.JSON(400, gin.H{
			"error": "at",
		})
	}

	refreshToken, err := tokens.TokenMethods.GenerateRefreshToken(response["userId"], response["email"], response["username"])
	if err != nil {
		c.JSON(400, gin.H{
			"error": "at",
		})
	}

	c.SetCookie("refreshToken", refreshToken, 60*60*24*7, "/auth/refresh", "localhost", false, true)

	c.JSON(201, gin.H{
		"accessToken": accessToken,
		"user": response,
	})
}