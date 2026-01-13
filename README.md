# Myway - Student Module Management App

A React + Node.js application to help students manage their modules, resources, todos, and study sessions using the Pomodoro technique.

## Features

- **Module Management**: Create and organize your study modules with custom colors
- **Resource Management**: Add URLs, notes, and file attachments to your modules
- **Todo Lists**: Create and track tasks for each module with priorities
- **Pomodoro Timer**: Built-in timer to help you focus on your tasks
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React with Vite, Context API for state management
- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Deployment**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Local Development

#### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000`

To seed the database with sample data:
```bash
npm run seed
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Docker Deployment

Build and run both frontend and backend using Docker Compose:

```bash
docker-compose build
docker-compose up
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

To stop the containers:
```bash
docker-compose down
```

To rebuild and restart:
```bash
docker-compose up --build
```

### Publishing to Docker Hub

1. Tag your images:
```bash
docker tag myway-frontend your-username/myway-frontend:latest
docker tag myway-backend your-username/myway-backend:latest
```

2. Push to Docker Hub:
```bash
docker push your-username/myway-frontend:latest
docker push your-username/myway-backend:latest
```

## API Endpoints

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get single module with resources and todos
- `POST /api/modules` - Create new module
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### Resources
- `GET /api/modules/:moduleId/resources` - Get all resources for a module
- `POST /api/modules/:moduleId/resources` - Create new resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `GET /api/uploads/:filename` - Download uploaded file

### Todos
- `GET /api/modules/:moduleId/todos` - Get all todos for a module
- `POST /api/modules/:moduleId/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete todo

## Project Structure

```
Myway/
├── backend/
│   ├── database/          # Database setup and schema
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── uploads/           # File uploads directory
│   ├── server.js          # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── App.css        # Styles
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_PATH=./database/myway.db
UPLOAD_DIR=./uploads
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Contributing

This is a student project. Feel free to fork and modify for your own use.

## License

ISC
