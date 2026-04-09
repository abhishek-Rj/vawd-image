package images

import (
	"context"
	"net/http"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type updateImageStatus struct {
	ImageID string `json:"image_id" binding:"required"`
	Status string `json:"status" binding:"required"`
}

func UpdateImageStatus(c *gin.Context) {
	var req updateImageStatus
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Body not retrieved",
		})
		return
	}

	imageID, err := uuid.Parse(req.ImageID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Cannot parse image ID",
		})
		return
	}

	result := map[string]interface{}{
		"progress": req.Status,
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()
	_, err = gorm.G[map[string]interface{}](database.DB).Table("images").Where("id = ?", imageID).Updates(ctx, result)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Cannot update image status",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg": "Image status updated successfully",
	})
}