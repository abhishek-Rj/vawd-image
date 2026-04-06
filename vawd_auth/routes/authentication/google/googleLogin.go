package google

import (
	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/gin-gonic/gin"
)

func GoogleLogin(c *gin.Context) {
	url := config.GoogleConfig.AuthCodeURL("random-state")
	c.Redirect(302, url )
}