package user

import (
	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	username := c.MustGet("username").(string)
	email := c.MustGet("email").(string)
	profilePic := c.MustGet("profilePic").(string)

	userDetail := map[string]string{
		"userId": userId,
		"username": username,
		"email": email,
		"profilePic": profilePic,
	}

	c.JSON(200, gin.H{
		"message": "success",
		"user": userDetail,
	})
}