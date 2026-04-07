package middleware

import (
	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
)

func VerifyToken(c *gin.Context) {
	accessToken, err := c.Cookie("accessToken");
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "cannot get access token",
		})
		return
	}	

	userDetails, err := tokens.TokenMethods.VerifyAccessToken(accessToken)
	if err != nil {
		c.AbortWithStatusJSON(401, gin.H{
			"error": err,
		})
		return 
	}

	userId := userDetails.UserID
	c.Set("userId", userId)
	c.Next()
}