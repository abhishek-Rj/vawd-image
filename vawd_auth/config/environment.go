package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	AppPort				string	`envconfig:"APP_PORT" required:"true"`
	DBPort				string	`envconfig:"DB_PORT" required:"true"`
	DBName				string 	`envconfig:"DB_NAME" required:"true"`
	DBPassword			string	`envconfig:"DB_PASSWORD" required:"true"`
	DBUser				string 	`envconfig:"DB_USER" required:"true"`
	DBHost				string	`envconfig:"DB_HOST" required:"true"`
	BcryptCost 			int		`envconfig:"BCRYPT_COST" required:"true"`
	JwtAccessSecret		string	`envconfig:"JWT_ACCESS_SECRET" required:"true"`
	JwtRefreshSecret 	string	`envconfig:"JWT_REFRESH_SECRET" required:"true"` 
	GoogleClientID 		string	`envconfig:"GOOGLE_CLIENT_ID" required:"true"`
	GoogleClientSecret 	string	`envconfig:"GOOGLE_CLIENT_SECRET" required:"true"`
}

var App Config

func Load() {
	godotenv.Load()

	err := envconfig.Process("", &App)
	if err != nil {
		log.Fatal("failed to load config:", err)
	}
}