package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserImage(c *gin.Context) {
	userId := c.MustGet("userId")

	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)

	images, err := gorm.G[database.Image](database.DB).Where("user_id = ?", userId).Find(ctx)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Coudn't fetch images",
		})
	}
	response := map[string]interface{}{
		"images": images,
	}
}