// configs/config.go
package configs

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	ServerPort string
	JWTSecret  string
}

func LoadConfig(path string) (config Config, err error) {
	// Carregar variáveis do .env se estiver em desenvolvimento
	godotenv.Load()
//postgresql://postgres:INLRMZgSvfynmZLEgWqwJkQTeRJIkfTK@postgres.railway.internal:5432/railway
	return Config{
		DBHost:     getEnv("DB_HOST", "postgres.railway.internal"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "INLRMZgSvfynmZLEgWqwJkQTeRJIkfTK"),
		DBName:     getEnv("DB_NAME", "tododb"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
		JWTSecret:  getEnv("JWT_SECRET", "your_jwt_secret_key"),
	}, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
