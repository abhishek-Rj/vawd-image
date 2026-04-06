package authentication

import (
	"github.com/abhishek-Rj/vawd-image/middleware"
	"github.com/abhishek-Rj/vawd-image/routes/authentication/user"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(auth *gin.RouterGroup) {
	auth.POST("/create", user.CreateUser)	
	auth.POST("/login", user.LoginUser)
	auth.POST("/refresh", user.Refresh)
	auth.POST("/auth/google")

	protected := auth.Group("/")
	protected.Use(middleware.VerifyToken)

	protected.GET("/user", user.GetUser)
	protected.GET("/images", user.GetUserImage)
	protected.PUT("/update", user.UpdateUser)
	protected.DELETE("/delete", user.DeleteUser)
	protected.GET("/me", user.Me)
}