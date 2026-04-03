package config

import (
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID 		string 	`json:"userId"`
	Email 		string 	`json:"email"`
	Username 	string	`json:"username"`
	jwt.RegisteredClaims
}