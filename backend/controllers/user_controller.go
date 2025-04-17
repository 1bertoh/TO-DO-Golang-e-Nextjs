package controllers

import (
	"net/http"
	"todo-api/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

type UpdateProfileInput struct {
	Username string `json:"username"`
	Email    string `json:"email" binding:"omitempty,email"`
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{DB: db}
}

// GetUserProfile obtém as informações do usuário logado
func (uc *UserController) GetUserProfile(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var user models.User
	if err := uc.DB.Select("id, username, email, created_at, updated_at").First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// UpdateUserProfile atualiza as informações do usuário
func (uc *UserController) UpdateUserProfile(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar se o email já está em uso
	if input.Email != "" {
		var existingUser models.User
		if err := uc.DB.Where("email = ? AND id != ?", input.Email, userID).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email já está em uso"})
			return
		}
	}

	updates := make(map[string]interface{})
	if input.Username != "" {
		updates["username"] = input.Username
	}
	if input.Email != "" {
		updates["email"] = input.Email
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nenhum dado fornecido para atualização"})
		return
	}

	if err := uc.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		return
	}

	// Retorna os dados atualizados
	var user models.User
	uc.DB.Select("id, username, email, created_at, updated_at").First(&user, userID)
	c.JSON(http.StatusOK, gin.H{"data": user})
}