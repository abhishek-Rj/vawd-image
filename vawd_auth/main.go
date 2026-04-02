package main

import (
	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	database.ConnectionToDB()
	server := gin.Default()

	server.GET("/", func (c* gin.Context){ 
		c.JSON(200, gin.H{
			"msg": "whatever works, works!!",
		})
	})

	server.Run(":"+ config.App.AppPort)
}
