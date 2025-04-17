// controllers/task_controller.go
package controllers

import (
	"net/http"
	"strconv"
	"todo-api/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskController struct {
	DB *gorm.DB
}

type TaskInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

func NewTaskController(db *gorm.DB) *TaskController {
	return &TaskController{DB: db}
}

func (tc *TaskController) GetAllTasks(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	var tasks []models.Task

	if result := tc.DB.Where("user_id = ?", userID).Find(&tasks); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar tarefas"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tasks})
}

func (tc *TaskController) CreateTask(c *gin.Context) {
	var input TaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(uint)

	task := models.Task{
		Title:       input.Title,
		Description: input.Description,
		Completed:   input.Completed,
		UserID:      userID,
	}

	if result := tc.DB.Create(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar tarefa"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": task})
}

func (tc *TaskController) GetTask(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var task models.Task
	if result := tc.DB.Where("id = ? AND user_id = ?", id, userID).First(&task); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": task})
}

func (tc *TaskController) UpdateTask(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var task models.Task
	if result := tc.DB.Where("id = ? AND user_id = ?", id, userID).First(&task); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	var input TaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
        "Title":       input.Title,
        "Description": input.Description,
        "Completed":   input.Completed, // Isso vai funcionar mesmo quando for false
    }

    tc.DB.Model(&task).Updates(updates)

    c.JSON(http.StatusOK, gin.H{"data": task})
}

func (tc *TaskController) DeleteTask(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var task models.Task
	if result := tc.DB.Where("id = ? AND user_id = ?", id, userID).First(&task); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	tc.DB.Delete(&task)

	c.JSON(http.StatusOK, gin.H{"data": "Tarefa removida com sucesso"})
}