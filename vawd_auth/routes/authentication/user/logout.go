package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("refreshToken", "", -1, "/auth/refresh", ".abhishekraj.xyz", true, true)
	c.SetCookie("accessToken", "", -1, "/", ".abhishekraj.xyz", true, true)
	c.JSON(200, gin.H{
		"message": "Logged out successfully",
	})
}