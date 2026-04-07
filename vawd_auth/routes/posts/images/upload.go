package images

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func ImageUpload(c *gin.Context) {
	userID := c.MustGet("userId").(string)
	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(400, gin.H{"error": "Image not found"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(400, gin.H{"error": "Cannot open image"})
		return
	}
	defer file.Close()

	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		c.JSON(400, gin.H{"error": "Cannot read image"})
		return
	}

	contentType := http.DetectContentType(buffer)

	if contentType != "image/jpeg" &&
		contentType != "image/png" &&
		contentType != "image/webp" {
		c.JSON(400, gin.H{"error": "Invalid image type"})
		return
	}

	_, err = file.Seek(0, 0)
	if err != nil {
		c.JSON(500, gin.H{"error": "Cannot reset file"})
		return
	}

	key := fmt.Sprintf("uploads/%d_%s", time.Now().UnixNano(), fileHeader.Filename)

	_, err = config.S3Client.PutObject(c.Request.Context(), &s3.PutObjectInput{
		Bucket:      aws.String(config.App.S3Bucket),
		Key:         aws.String(key),
		Body:        file,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Image not uploaded"})
		return
	}

	imageUrl := fmt.Sprintf(
		"https://s3.%s.amazonaws.com/%s/%s",
		config.App.S3Region,
		config.App.S3Bucket,
		key,
	)

	id, err := uuid.Parse(userID)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "Cannot parse user ID",
		})
		return
	}

	image := database.Image{
		UserID: id,
		Url: imageUrl,
		Name: fileHeader.Filename,
		Progress: "pending",
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()	
	err = gorm.G[database.Image](database.DB).Create(ctx, &image)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "Cannot create image",
		})
		return
	}
		
	c.JSON(200, gin.H{
		"message":  "Image uploaded successfully",
		"imageUrl": imageUrl,
	})
}