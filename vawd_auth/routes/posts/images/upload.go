package images

import (
	"fmt"
	"os"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

func ImageUpload(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Image not found",
		})
		return
	}
	err = c.SaveUploadedFile(file, "./uploads/"+file.Filename)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Image not uploaded",
		})
		return
	}

	image, err := os.Open("./uploads/"+file.Filename)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Image not opened",
		})
		return
	}
	
	_, err = config.S3Client.PutObject(c.Request.Context(), &s3.PutObjectInput{
		Bucket: aws.String(config.App.S3Bucket),
		Key:    aws.String(file.Filename),
		Body:   image,
	})
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Image not uploaded",
		})
		return
	}
	
	imageUrl := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", config.App.S3Bucket, config.App.S3Region, file.Filename)

	os.Remove("./uploads/"+file.Filename)
	
	c.JSON(200, gin.H{
		"message": "Image uploaded successfully",
		"imageUrl": imageUrl,
	})
}