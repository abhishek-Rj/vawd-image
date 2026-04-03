package tokens

import (
	"fmt"
	"time"

	"github.com/abhishek-Rj/vawd-image/config"
	"github.com/golang-jwt/jwt/v5"
)


type TokenFunctions struct {}

func (f *TokenFunctions) GenerateAccessToken(userId string, email string, username string) (string, error) {
	claims := config.Claims{
		UserID: userId,
		Email: email,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7*time.Hour)),
			IssuedAt: jwt.NewNumericDate(time.Now()),
			Issuer: "vawd_image",
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(config.App.JwtAccessSecret)
	signedToken, err := accessToken.SignedString(secret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func (f *TokenFunctions) VerifyAccessToken(accessToken string) (*config.Claims, error) {
	claims := &config.Claims{}

	token, err := jwt.ParseWithClaims(accessToken, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(config.App.JwtAccessSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}
	return claims, nil
}

func (f *TokenFunctions) GenerateRefreshToken(userId string, email string, username string) (string, error) {
	claims := config.Claims{
		UserID: userId,
		Email: email,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7*24*time.Hour)),
			IssuedAt: jwt.NewNumericDate(time.Now()),
			Issuer: "vawd_image",
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(config.App.JwtRefreshSecret)
	signedToken, err := accessToken.SignedString(secret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}


func (f *TokenFunctions) VerifyRefereshToken(refreshToken string) (*config.Claims, error) {
	claims := &config.Claims{}

	token, err := jwt.ParseWithClaims(refreshToken, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(config.App.JwtRefreshSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}
	return claims, nil
}

var TokenMethods TokenFunctions = TokenFunctions{};