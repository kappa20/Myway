# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

**Myway** is a two-tier application with a React frontend and Node.js/Express backend, separated into `/frontend` and `/backend` directories.

### Backend Architecture (Node.js + Express + SQLite)

- **Entry Point**: `backend/server.js` - Initializes Express server with CORS, JSON parsing, and graceful shutdown
- **Database Layer**: `backend/database/db.js` - SQLite connection wrapper with promise-based helper methods (runAsync, getAsync, allAsync)
- **Database Schema**: `backend/database/schema.sql` - Defines 3 tables (modules, resources, todos) with foreign key constraints and CASCADE deletes
- **Route Structure**: Three modular router files handle independent resource domains:
  - `backend/routes/modules.js` - CRUD for modules
  - `backend/routes/resources.js` - CRUD for resources + file upload via multer + static file serving
  - `backend/routes/todos.js` - CRUD for todos + toggle endpoint
- **Middleware**: `backend/middleware/upload.js` - Multer configuration for file uploads (10MB limit, specific file types)
- **Error Handling**: Centralized error handler in server.js catches exceptions and returns JSON errors

**Key Design Patterns**:
- Promise-based database operations (avoiding callback hell)
- Separated route files organized by resource type
- Multer for file upload handling with validation
- File uploads stored in `backend/uploads/` directory
- Environment variables for configuration (PORT, DB_PATH, UPLOAD_DIR)

### Frontend Architecture (React + Vite + Context API)

- **Entry Point**: `frontend/src/main.jsx` - Mounts App to DOM
- **App Root**: `frontend/src/App.jsx` - Provides three Context providers (ModuleProvider, TodoProvider, PomodoroProvider) and renders 3-panel layout
- **Layout**: CSS Grid with 3 panels:
  - Left: Module list (350px)
  - Center: Resources + Todos (flexible)
  - Right: Pomodoro timer (350px)
  - Responsive: Collapses to single column on screens <1200px

**State Management via Context API** (no Redux):
- `frontend/src/contexts/ModuleContext.jsx` - Manages modules list, selected module, resources for that module. Loads from API on mount and when module selection changes
- `frontend/src/contexts/TodoContext.jsx` - Manages todos for selected module. Implements client-side filtering (all/active/completed). Loads when module changes
- `frontend/src/contexts/PomodoroContext.jsx` - Pure client-side timer state. Tracks mode (work/short break/long break), time remaining, selected todo, sessions completed. No backend persistence

**Component Organization** (feature-based):
- `frontend/src/components/modules/` - ModuleList, ModuleCard, ModuleForm
- `frontend/src/components/resources/` - ResourceList, ResourceItem, ResourceForm
- `frontend/src/components/todos/` - TodoList, TodoItem, TodoForm
- `frontend/src/components/pomodoro/` - PomodoroTimer, TimerControls
- `frontend/src/components/layout/` - Header

**API Service Layer**: `frontend/src/services/api.js`
- Exports three API objects: `modulesAPI`, `resourcesAPI`, `todosAPI`
- Centralized fetch wrapper with error handling
- Handles both JSON and FormData (for file uploads)
- Uses environment variable `VITE_API_URL` for backend URL

**Styling**: `frontend/src/App.css`
- Single CSS file (MVP approach, no CSS-in-JS or Tailwind)
- Uses CSS variables for spacing (rem-based)
- Minimal animations (transitions only)
- Responsive media queries for mobile

### Data Flow

1. **Initial Load**: App mounts → ModuleProvider fetches all modules → User selects a module
2. **Module Selection**: User clicks module → selectModule() updates ModuleContext → TodoProvider.loadTodos() and ResourceProvider load for that module
3. **CRUD Operations**: Component calls context method (e.g., createTodo) → Context calls API service → API makes fetch request → Response updates context state
4. **File Uploads**: ResourceForm collects file + metadata → resourcesAPI.create() detects type='file' and sends FormData → Backend multer stores file → Returns filename
5. **Timer**: PomodoroContext manages pure client state. No API calls. Auto-switches modes based on work/break completion

## Development Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server (port 5000)
npm start

# Seed database with sample data (creates 3 modules with resources and todos)
npm run seed

# Run with nodemon for auto-restart on file changes (requires installing nodemon globally or as dev dependency)
# npx nodemon server.js
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (port 3000, with API proxy to localhost:5000)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

### Docker
```bash
# From root directory

# Build both images
docker-compose build

# Start both services (frontend on :3000, backend on :5000)
docker-compose up

# Stop services
docker-compose down

# Rebuild and restart (useful for code changes)
docker-compose up --build
```

## Key Implementation Details

### Database Schema

**modules table**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL)
- `description` (TEXT)
- `color` (TEXT DEFAULT '#3B82F6')
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

**resources table**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `module_id` (INTEGER NOT NULL, FOREIGN KEY)
- `title` (TEXT NOT NULL)
- `type` (TEXT CHECK IN ('url', 'note', 'file'))
- `content` (TEXT NOT NULL) - URL, note text, or original filename
- `file_path` (TEXT) - Stores generated filename for file type
- `created_at` (DATETIME)
- Cascade delete on module deletion

**todos table**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `module_id` (INTEGER NOT NULL, FOREIGN KEY)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `completed` (BOOLEAN DEFAULT 0)
- `priority` (TEXT CHECK IN ('low', 'medium', 'high'), DEFAULT 'medium')
- `created_at` (DATETIME)
- Cascade delete on module deletion

### Pomodoro Timer Implementation

- **Durations**: 25min (work), 5min (short break), 15min (long break)
- **Session Tracking**: Counts completed work sessions. After 4 work sessions, next break is long break (15min) instead of short break (5min)
- **State Machine**: Mode cycling: WORK → SHORT_BREAK → WORK → ... → WORK (4th) → LONG_BREAK → WORK
- **Persistence**: Session state is in-memory only. Resets on page refresh
- **Browser Notifications**: Requests permission on first timer start, shows notification when timer completes
- **Auto-Switch**: When timer hits 0, automatically advances to next mode and starts countdown

### File Upload Handling

- **Location**: Files stored in `backend/uploads/` (gitignored)
- **Naming**: Generated filename = timestamp + random + original extension
- **Size Limit**: 10MB per file
- **Allowed Types**: pdf, doc, docx, txt, jpg, jpeg, png, gif, zip, rar
- **Backend Route**: `POST /api/modules/:moduleId/resources` with multipart/form-data
- **Retrieval**: `GET /api/uploads/:filename` serves file directly
- **Cleanup**: When resource deleted, actual file also deleted from disk

## Common Modifications

### Adding a New Feature (e.g., module tags)

1. **Database**: Update `backend/database/schema.sql` - add new column/table
2. **Seed Script**: Update `backend/database/seed.js` if new structure
3. **Routes**: Modify relevant file in `backend/routes/` to handle new data
4. **API Service**: Add methods to `frontend/src/services/api.js` if new endpoints
5. **Context**: Update relevant context in `frontend/src/contexts/` to manage new state
6. **Components**: Create/update components in `frontend/src/components/` to display/edit new feature
7. **Styles**: Add styles to `frontend/src/App.css`

### Debugging API Issues

- Backend logs go to terminal running `npm start` in backend directory
- Check `http://localhost:5000/api/health` to verify backend is running
- Frontend dev server has API proxy configured in `frontend/vite.config.js` (routes `/api/*` to `http://localhost:5000`)
- Browser DevTools Network tab shows actual fetch requests

### Updating Environment Variables

- Backend: Edit `backend/.env` (PORT, DB_PATH, UPLOAD_DIR)
- Frontend: Edit `frontend/.env` (VITE_API_URL)
- Changes require restarting development servers

## Testing Workflows

### Manual End-to-End Testing

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000`
4. Create a module → Select it → Add resources (URL, note, file) → Add todos → Start Pomodoro timer
5. Verify all CRUD operations work and data persists
6. Check file upload and download functionality
7. Verify responsive design on mobile (browser dev tools)

### Docker Testing

1. `docker-compose build`
2. `docker-compose up`
3. Open `http://localhost:3000` (frontend container)
4. Verify frontend loads and can reach backend API
5. Create/edit/delete data and verify it persists
6. Stop containers: `docker-compose down`
7. Restart: `docker-compose up` and verify data persisted in volumes

## Important Notes

- **No Authentication**: This is an MVP without user authentication. All data is shared
- **SQLite Only**: Not designed for production multi-user scenarios. Use PostgreSQL for production
- **File Uploads**: Users can upload up to 10MB files. In production, consider cloud storage (S3, GCS)
- **Context vs Redux**: Uses Context API for simplicity (MVP scope). If app grows significantly, consider Redux/Zustand
- **CSS Approach**: Minimal plain CSS for MVP. No Tailwind or Styled Components
- **CORS**: Enabled for all origins in development. Restrict in production via CORS config
- **Error Handling**: Basic error messages returned as JSON. Consider adding request validation middleware for production
