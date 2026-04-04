package images

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type deleteImageDetails struct {
	Id		string		`json:"id" binding:"required"`
}

func DeleteImages(c *gin.Context) {
	var req deleteImageDetails
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Body not retrieved",
		})
	}

	userId := c.MustGet("userId")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()
	
	_, err := gorm.G[database.Image](database.DB).Where("user_id = ? AND id = ?", userId, req.Id).Delete(ctx)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Image not deleted",
		})
		return 
	}

	c.JSON(200, gin.H{
		"msg": "Image Deleted",
	})
}