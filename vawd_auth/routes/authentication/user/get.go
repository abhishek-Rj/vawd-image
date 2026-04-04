package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUser(c *gin.Context) {
	userID := c.MustGet("userId").(string)
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)	
	defer cancel()

	profile, err := gorm.G[database.Profile](database.DB).Where("user_id = ?", userID).First(ctx)

	if err != nil {
		c.JSON(400, gin.H{
			"error": "Coundn't fetch user",
		})
		return
	}

	response := map[string]string{
		"username": profile.UserName,
		"email": profile.Email,
		"firstName": profile.FirstName,
		"lastName": profile.LastName,
		"profilePic": profile.ProfilePic,
	}
	c.JSON(200, gin.H{
		"user": response,
	})
}