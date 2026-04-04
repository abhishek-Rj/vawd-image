package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type imageDetails struct {
	Name	string	`json:"name" binding:"required"`
	Url		string	`json:"url" binding:"required"`
}

func GetUserImage(c *gin.Context) {
	userId := c.MustGet("userId")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	images, err := gorm.G[database.Image](database.DB).Where("user_id = ?", userId).Find(ctx)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Coudn't fetch images",
		})
		return
	}

	var response []imageDetails
	for _, img := range images {
		response = append(response, imageDetails{
			Name: img.Name,
			Url: img.Url,
		})
	}
	c.JSON(200, gin.H{
		"images": response,
	})
}