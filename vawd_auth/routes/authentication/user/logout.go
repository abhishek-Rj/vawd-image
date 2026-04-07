package user

import (
	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	c.SetCookie("refreshToken", "", -1, "/auth/refresh", "localhost", false, true)
	c.SetCookie("accessToken", "", -1, "/", "localhost", false, true)
	c.JSON(200, gin.H{
		"message": "Logged out successfully",
	})
}