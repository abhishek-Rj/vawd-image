package middleware

import (
	"strings"

	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
)

func VerifyToken(c *gin.Context) {
	authToken := c.GetHeader("Authorization")	
	if authToken == "" {
		c.JSON(401, gin.H{
			"error": "Authorization header missing",
		})
		return
	}

	tokenParts := strings.Split(authToken, " ")
	if len(tokenParts) != 2 || tokenParts[0] == "Bearer" {
		c.JSON(401, gin.H{
			"error": "Invalide Token format",
		})
		return
	}

	accessToken := tokenParts[1]
	userDetails, err := tokens.TokenMethods.VerifyAccessToken(accessToken)
	if err != nil {
		c.JSON(401, gin.H{
			"error": err,
		})
		return 
	}

	userId := userDetails.UserID
	c.Set("userID", userId)
	c.Next()
}