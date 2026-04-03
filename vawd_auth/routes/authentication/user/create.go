package user

import (
	"context"

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
//Transaction missing[to revert back to state in case of orphane user]
func CreateUser(c* gin.Context) {
	var req details

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	user := database.User{}
	ctx := context.Background()
	if err := gorm.G[database.User](database.DB).Create(ctx, &user); err != nil {
		c.JSON(400, gin.H{
			"error": "Failed to create User",
		})
		return
	}

	profile := database.Profile{
		UserID: user.ID,
		Email: req.Email,
		FirstName: req.FirstName,
		LastName: req.LastName,
		UserName: req.UserName,	
		Password: req.Password,
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(profile.Password), config.App.BcryptCost)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return 
	}

	profile.Password = string(hashPassword)

	err = gorm.G[database.Profile](database.DB).Create(ctx, &profile);
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Failed to create Profile",
		})
		return
	}

	response := map[string]interface{}{"userId": profile.UserID ,"firstName": profile.FirstName, "lastName": profile.LastName, "email": profile.Email, "userName": profile.UserName}
	c.JSON(201, gin.H{
		"user": response,
	})
}