package images

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type imageDetails struct {
	Name	string 		`json:"name"`
	Url		string		`json:"url"`
}

func ImageUpload(c *gin.Context) {
	var req imageDetails
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Body not found",
		})
		return
	}

	userId := c.MustGet("userId")	
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	id, err := uuid.Parse(userId.(string))
	if err != nil {
		c.JSON(400, gin.H{
			"error": "uuid not found",
		})
		return
	}

	image := database.Image{
		UserID: id,
		Name: req.Name,
		Url: req.Url,
	}

	err = gorm.G[database.Image](database.DB).Create(ctx, &image); 
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Image not uploaded",
		})
		return
	}

	c.JSON(200, gin.H{
		"image":image,
	})
}