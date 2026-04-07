package user

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
	"gorm.io/gorm"
)

func UploadProfilePic(c *gin.Context) {
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

	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()

	profile, err := gorm.G[database.Profile](database.DB).Where("user_id = ?", userID).First(ctx)
	if err != nil {
		c.JSON(400, gin.H{"error": "Profile not found"})
		return
	}

	key := fmt.Sprintf("profilepic/%s_%d", profile.UserName, time.Now().UnixNano())

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

	_, err = gorm.G[map[string]interface{}](database.DB).Table("profiles").Where("user_id = ?", userID).Updates(ctx, map[string]interface{}{
		"profile_pic": imageUrl,
	})
	if err != nil {
		c.JSON(400, gin.H{"error": "Failed to update profile pic in DB"})
		return
	}

	c.JSON(200, gin.H{
		"message":    "Profile picture updated successfully",
		"profilePic": imageUrl,
	})
}
