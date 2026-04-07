package user

import (
	"github.com/abhishek-Rj/vawd-image/tokens"
	"github.com/gin-gonic/gin"
)

func Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Refresh Token not found",
		})
	}

	userDetails, err := tokens.TokenMethods.VerifyRefereshToken(refreshToken)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "cannot verify refresh token",
		})
		return
	}

	accessToken, err := tokens.TokenMethods.GenerateAccessToken(userDetails.UserID, userDetails.Email, userDetails.Username, userDetails.ProfilePic)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "cannot generate access token",
		})
		return
	}

	c.SetCookie("accessToken", accessToken, 24*60*60, "/", "localhost", false, true)

	c.JSON(200, gin.H{
		"user": userDetails,
	})
}
