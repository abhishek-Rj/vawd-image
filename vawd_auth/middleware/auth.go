package middleware

import (
	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
)

func VerifyToken(c *gin.Context) {
	accessToken, err := c.Cookie("accessToken");
	if err != nil {
		c.JSON(400, gin.H{
			"error": "cannot get access token",
		})
		return
	}	

	userDetails, err := tokens.TokenMethods.VerifyAccessToken(accessToken)
	if err != nil {
		c.JSON(401, gin.H{
			"error": err,
		})
		return 
	}

	userId := userDetails.UserID
	username := userDetails.Username
	email := userDetails.Email
	profilePic := userDetails.ProfilePic

	c.Set("userId", userId)
	c.Set("username", username)
	c.Set("email", email)
	c.Set("profilePic", profilePic)
	c.Next()
}