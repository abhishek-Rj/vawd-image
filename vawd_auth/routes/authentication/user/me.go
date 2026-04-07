package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Me(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	userProfile, err := gorm.G[database.Profile](database.DB).Where("user_id = ?", userId).First(ctx)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "Failed to get user details",
		})
		return
	}
	response := map[string]interface{}{
		"userId": userProfile.UserID,
		"username": userProfile.UserName,
		"email": userProfile.Email,
		"profilePic": userProfile.ProfilePic,
	}

	c.JSON(200, gin.H{
		"user": response,
	})
}