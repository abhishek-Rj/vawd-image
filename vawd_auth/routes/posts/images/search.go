package images

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/gin-gonic/gin"
)

type searchImageDetails struct {
	Prompt string `json:"prompt" binding:"required"`
}

func ImageSearch(c *gin.Context) {
	var req searchImageDetails
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Body not retrieved",
		})
		return
	}

	jsonData, err := json.Marshal(req)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot marshal request",
		})
		return
	}

	resp, err := http.Post(config.App.PythonServerUrl, "application/json", strings.NewReader(string(jsonData)))	
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Server cannot process request",
		})
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot read response",
		})
		return
	}

	type searchResponse struct {
		Result []map[string]interface{} `json:"result"`
	}

	var result searchResponse
	if err := json.Unmarshal(data, &result); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot unmarshal response",
		})
		return
	}

	c.JSON(http.StatusOK, result)
}