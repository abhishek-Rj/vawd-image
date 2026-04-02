package main

import (
	"log"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/abhishek-Rj/vawd-image/database"
)

func main() {
	config.Load()
	database.ConnectionToDB()

	if err := database.DB.AutoMigrate(
		&database.User{}, 
		&database.Profile{}, 
		&database.Image{},
	); err != nil {
		log.Fatal("Error migrating Table", err)
	}
}