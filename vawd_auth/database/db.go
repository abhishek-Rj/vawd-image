package database

import (
	"log"

	"github.com/abhishek-Rj/vawd-image/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectionToDB() {
	dsn := "host=" + config.App.DBHost + " " + "user=" + config.App.DBUser + " " + "password=" + config.App.DBPassword + " " + "dbname=" + config.App.DBName + " " + "port=" + config.App.DBPort + " " + "sslmode=" + config.App.DBSSLMode
	
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Database connection failed")
	}

	log.Println("Database Connection Successful")
}