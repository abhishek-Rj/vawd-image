package config

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleConfig *oauth2.Config

func InitGoogleConfig() {
	GoogleConfig = &oauth2.Config{
		ClientID:     App.GoogleClientID,
		ClientSecret: App.GoogleClientSecret,
		RedirectURL:  "https://vawd-auth.abhishekraj.xyz/auth/google/callback",
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     google.Endpoint,
	}
}