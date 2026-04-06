package database

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormModel struct {
	ID			uuid.UUID		`json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"` 
	CreatedAt	time.Time		`json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt	time.Time		`json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt	gorm.DeletedAt	`json:"deletedAt" gorm:"index"`	
}

type User struct {
	GormModel
	Profile		*Profile 		`json:"profile" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:UserID"`
	Images		[]Image			`json:"images" gorm:"constraint:OnDelete:CASCADE;foreignKey:UserID"`
}

type Profile struct {
	GormModel
	UserID		uuid.UUID		`json:"userId" gorm:"uniqueIndex; not null"`	
	User		*User			`json:"-" gorm:"foreignKey:UserID"`
	Email 		string 			`json:"email" gorm:"not null;uniqueIndex:idx_email_	active,where:deleted_at IS NULL"`
	FirstName	string			`json:"firstName" gorm:"not null"`
	LastName	string			`json:"lastName"`	
	UserName	string			`json:"userName" gorm:"uniqueIndex:idx_username_active,where:deleted_at IS NULL;not null"`
	ProfilePic 	string			`json:"profilePic"`
	Password	*string			`json:"-"`
	AuthProvider	string			`json:"auth_provider" gorm:"not null"`
}

type Image struct {
	GormModel
	UserID		uuid.UUID		`json:"userId" gorm:"not null"`
	User		*User			`json:"-" gorm:"foreignKey:UserID"`
	Name		string			`json:"name"`
	Url			string			`json:"url" gorm:"uniqueIndex"`
	Progress	string			`json:"progress"`
}