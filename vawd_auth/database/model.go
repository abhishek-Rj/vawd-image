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
	Profile		Profile 		`json:"profile" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Images		[]Image			`json:"images"`
}

type Profile struct {
	GormModel
	UserID		uuid.UUID		`json:"userId" gorm:"uniqueIndex; not null"`	
	Email 		string 			`json:"email" gorm:"not null;uniqueIndex"`
	FirstName	string			`json:"firstName" gorm:"not null"`
	LastName	string			`json:"lastName"`	
	UserName	string			`json:"userName" gorm:"uniqueIndex;not null"`
	ProfilePic 	string			`json:"profilePic"`
}

type Image struct {
	GormModel
	UserID		uuid.UUID		`json:"userId" gorm:"not null"`
	Name		string			`json:"name"`
	Url			string			`json:"url" gorm:"uniqueIndex"`
}