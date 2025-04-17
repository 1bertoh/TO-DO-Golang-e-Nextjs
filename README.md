# 📝 TODO App Monorepo

This repository contains a full-stack TODO application with a Golang backend and NextJS frontend.

## 🗂️ Project Structure

```
.
├── back/       # Golang backend application
└── front/      # NextJS frontend application
```

## 🔍 Overview

This project implements a TODO application with the following components:

- **Backend**: Golang REST API running on port 8080
- **Database**: PostgreSQL managed via Docker
- **Frontend**: NextJS application running on port 3000

## 🚀 Backend

The backend is built with Golang and provides a REST API for managing TODO items. It uses PostgreSQL as the database and is containerized using Docker.

### ✨ Features

- RESTful API endpoints for managing TODO items
- User authentication with JWT
- PostgreSQL database integration
- Docker containerization for easy setup and deployment
- CORS configured for frontend integration

### 🛠️ Setup and Running

The backend includes a Docker setup that creates two containers:
- Golang application container
- PostgreSQL database container

To start the backend:

```bash
cd back
docker-compose up
```

The API will be available at `http://localhost:8080`

## 💻 Frontend

The frontend is built with NextJS and provides a user interface for interacting with the TODO application.

### ✨ Features

- Modern React-based UI with NextJS
- State management for TODO items
- User authentication
- Responsive design

### 🛠️ Setup and Running

To start the frontend:

```bash
cd front
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 👩‍💻 Development

### 📋 Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher)
- Go (v1.19 or higher)

### 🏗️ Local Development

1. Start the backend:
   ```bash
   cd back
   docker-compose up
   ```

2. Start the frontend:
   ```bash
   cd front
   npm install
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## 🔌 API Endpoints

The backend provides the following API endpoints:

### 🔐 Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive JWT token

### 📋 Tasks (Protected Routes)
- `GET /api/tasks` - List all TODO tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### 👤 User (Protected Routes)
- `GET /api/profile` - Get user profile information

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
