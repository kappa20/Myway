# Docker Rebuild Scripts

Quick scripts to rebuild and push your Docker images to Docker Hub.

## Available Scripts

### Windows (Batch Files)

- **`rebuild-backend.bat`** - Rebuild and push backend image only
- **`rebuild-frontend.bat`** - Rebuild and push frontend image only
- **`rebuild-all.bat`** - Rebuild and push both images

### Linux/Mac (Bash Scripts)

- **`rebuild-backend.sh`** - Rebuild and push backend image only
- **`rebuild-frontend.sh`** - Rebuild and push frontend image only
- **`rebuild-all.sh`** - Rebuild and push both images

## Usage

### Windows

Simply double-click the `.bat` files or run from command prompt:

```cmd
# Rebuild backend only
rebuild-backend.bat

# Rebuild frontend only
rebuild-frontend.bat

# Rebuild both
rebuild-all.bat
```

### Git Bash on Windows

You can also use the `.sh` scripts in Git Bash:

```bash
# Make scripts executable (first time only)
chmod +x rebuild-backend.sh rebuild-frontend.sh rebuild-all.sh

# Rebuild backend only
./rebuild-backend.sh

# Rebuild frontend only
./rebuild-frontend.sh

# Rebuild both
./rebuild-all.sh
```

### Linux/Mac

```bash
# Make scripts executable (first time only)
chmod +x rebuild-backend.sh rebuild-frontend.sh rebuild-all.sh

# Rebuild backend only
./rebuild-backend.sh

# Rebuild frontend only
./rebuild-frontend.sh

# Rebuild both
./rebuild-all.sh
```

## What Each Script Does

### Backend Script (`rebuild-backend`)

1. Builds the backend Docker image from `./backend`
2. Tags it as `kappa20/myway-backend:latest`
3. Pushes to Docker Hub
4. Cleans up old unused images

### Frontend Script (`rebuild-frontend`)

1. Builds the frontend Docker image from `./frontend`
2. Tags it as `kappa20/myway-frontend:latest`
3. Pushes to Docker Hub
4. Cleans up old unused images

### All Script (`rebuild-all`)

1. Builds both backend and frontend images
2. Tags both for Docker Hub
3. Pushes both to Docker Hub
4. Cleans up old unused images
5. Shows next steps to restart containers

## Prerequisites

- Docker must be installed and running
- You must be logged in to Docker Hub: `docker login`
- Internet connection for pushing to Docker Hub

## After Rebuilding

Once images are pushed to Docker Hub, restart your containers:

```bash
# Stop and remove old containers
docker stop myway-frontend myway-backend
docker rm myway-frontend myway-backend

# Pull the new images
docker pull kappa20/myway-backend:latest
docker pull kappa20/myway-frontend:latest

# Restart with Docker Compose
docker-compose up -d

# OR restart with manual commands
docker run -d \
  --name myway-backend \
  --network myway-network \
  -p 5000:5000 \
  -e PORT=5000 \
  -e DB_PATH=./database/myway.db \
  -e UPLOAD_DIR=./uploads \
  -v myway-backend-data:/app/database \
  -v myway-backend-uploads:/app/uploads \
  kappa20/myway-backend:latest

docker run -d \
  --name myway-frontend \
  --network myway-network \
  -p 3000:80 \
  kappa20/myway-frontend:latest
```

## Customization

To use your own Docker Hub username, edit the scripts and change:

```bash
# In .sh files
DOCKER_USERNAME="kappa20"  # Change to your username

# In .bat files
set DOCKER_USERNAME=kappa20  REM Change to your username
```

## Troubleshooting

### Permission Denied (Linux/Mac)

If you get "permission denied" errors:

```bash
chmod +x rebuild-*.sh
```

### Docker Login Required

If push fails with authentication error:

```bash
docker login
# Enter your Docker Hub username and password
```

### Docker Not Running

Make sure Docker Desktop is running before executing scripts.

### Build Fails

Check for errors in the output. Common issues:
- Missing files in frontend/backend directories
- Syntax errors in Dockerfile
- npm install failures (check package.json)

## When to Use These Scripts

- **After fixing bugs** - Rebuild affected service and push
- **After adding features** - Rebuild affected service and push
- **Before deployment** - Rebuild all to ensure latest code is on Docker Hub
- **After updating dependencies** - Rebuild affected service
- **After configuration changes** - Rebuild and push new images

## Quick Reference

| Task | Windows | Linux/Mac |
|------|---------|-----------|
| Rebuild backend | `rebuild-backend.bat` | `./rebuild-backend.sh` |
| Rebuild frontend | `rebuild-frontend.bat` | `./rebuild-frontend.sh` |
| Rebuild both | `rebuild-all.bat` | `./rebuild-all.sh` |

---

**Note**: These scripts use the `latest` tag. For production, consider using version tags (e.g., `v1.0.0`) for better version control.
