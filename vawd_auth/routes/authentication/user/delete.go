package user

import (
	"context"
	"time"

	"github.com/abhishek-Rj/vawd-image/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeleteUser(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	ctx, cancel := context.WithTimeout(c.Request.Context(), 7*time.Second)
	defer cancel()
	
	_, err := gorm.G[database.User](database.DB).Where("user_id = ?", userId).Delete(ctx)

	if err != nil {
		c.JSON(400, gin.H{
			"error": "Coudn't delete the user",
		})
		return
	}

	c.JSON(200, gin.H{
		"msg": "User deleted",
	})
}