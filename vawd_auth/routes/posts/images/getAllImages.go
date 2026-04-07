package images

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllImages(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	images, err := gorm.G[database.Image](database.DB).Find(ctx)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Failed to get images",
		})
		return
	}

	c.JSON(200, gin.H{
		"images": images,
	})
}