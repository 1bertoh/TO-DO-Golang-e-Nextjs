// main.go
package main

import (
	"log"
	"todo-api/configs"
	"todo-api/controllers"
	"todo-api/database"
	"todo-api/middleware"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"time"
)


func main() {
	config, err := configs.LoadConfig(".")
	if err != nil {
		log.Fatal("Erro ao carregar config:", err)
	}

	db := database.ConnectDB()

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// CORS antes de tudo
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	

	authController := controllers.NewAuthController(db, config.JWTSecret)
	taskController := controllers.NewTaskController(db)
	userController := controllers.NewUserController(db)

	// Rotas públicas
	public := r.Group("/api")
	public.POST("/register", authController.Register)
	public.POST("/login", authController.Login)

	// Rotas protegidas
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware(config.JWTSecret))
	protected.GET("/tasks", taskController.GetAllTasks)
	protected.POST("/tasks", taskController.CreateTask)
	protected.GET("/tasks/:id", taskController.GetTask)
	protected.PUT("/tasks/:id", taskController.UpdateTask)
	protected.DELETE("/tasks/:id", taskController.DeleteTask)
	protected.GET("/profile", userController.GetUserProfile)

	r.Run(":" + config.ServerPort)
}