package authentication

import (
	"github.com/abhishek-Rj/vawd-image/middleware"
	"github.com/abhishek-Rj/vawd-image/routes/authentication/user"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(auth *gin.RouterGroup) {
	auth.POST("/create", user.CreateUser)	
	auth.POST("/login", user.LoginUser)
	auth.Use(middleware.VerifyToken)
	auth.GET("/user", user.GetUser)
}