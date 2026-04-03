package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type details struct {
	FirstName	string 	`json:"firstname" binding:"required"`
	LastName	string	`json:"lastname"`
	UserName	string	`json:"username" binding:"required"`
	Email		string 	`json:"email" binding:"required,email"`
	Password	string	`json:"password" binding:"required,min=6"`
}

func CreateUser(c* gin.Context) {
	var req details

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()
	
	var response map[string]interface{}
	
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
		
		response = map[string]interface{}{"userId": profile.UserID ,"firstName": profile.FirstName, "lastName": profile.LastName, "email": profile.Email, "userName": profile.UserName}
		return nil
	})

	if txErr != nil {
		c.JSON(400, gin.H{
			"error": "Failed to create user",
			"detail": txErr,
		})
	}

	c.JSON(201, gin.H{
		"user": response,
	})
}