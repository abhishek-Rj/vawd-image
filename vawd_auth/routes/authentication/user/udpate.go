package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type updateDetails struct {
	UserName	*string	`json:"user_name"`
	FirstName	*string	`json:"first_name"`
	LastName	*string `json:"last_name"`
	ProfilePic	*string	`json:"profile_pic"`
}

func UpdateUser(c *gin.Context) {
	var req updateDetails
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"err": "Coundn't retreive user request",
		})
		return
	}

	userId := c.MustGet("userId")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	userDetails := map[string]any{}
	if req.FirstName != nil {
		userDetails["first_name"] = *(req.FirstName)
	}
	if req.LastName != nil {
		userDetails["last_name"] = *req.LastName
	}
	if req.ProfilePic != nil {
		userDetails["profile_pic"] = *req.ProfilePic
	}
	if req.UserName != nil {
		userDetails["user_name"] = *req.UserName
	}
	
	_, err := gorm.G[map[string]interface{}](database.DB).Table("profiles").Where("user_id = ?", userId).Updates(ctx, userDetails)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Updation falied!",
		})
		return
	}

	c.JSON(200, gin.H{
		"msg": "Updation Successfull",
	})
}