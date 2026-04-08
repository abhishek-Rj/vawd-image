package images

import (
	"github.com/abhishek-Rj/vawd-image/middleware"
	"github.com/abhishek-Rj/vawd-image/routes/posts/images"
	"github.com/gin-gonic/gin"
)


func ImageRoutes(post *gin.RouterGroup) {
	proctected := post.Group("/")
	proctected.Use(middleware.VerifyToken)

	proctected.POST("/upload", images.ImageUpload)
	proctected.DELETE("/delete", images.DeleteImages)
	proctected.GET("/all", images.GetAllImages)
	proctected.POST("/search", images.ImageSearch)
}