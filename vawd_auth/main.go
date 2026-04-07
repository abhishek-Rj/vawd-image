package main

import (
	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/abhishek-Rj/vawd-image/routes/authentication"
	images "github.com/abhishek-Rj/vawd-image/routes/posts"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	database.ConnectionToDB()
	config.InitGoogleConfig()
	config.LoadAwsConfig()
	server := gin.Default()

	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "PUT", "POST", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-type", "Authorization"},
		AllowCredentials: true,
	}))

	server.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"msg": "whatever works, works!!",
		})
	})

	auth := server.Group("/auth")
	authentication.AuthRoutes(auth)

	post := server.Group("/posts")
	images.ImageRoutes(post)

	server.Run(":" + config.App.AppPort)
}
