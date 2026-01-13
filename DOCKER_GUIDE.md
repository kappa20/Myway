# Docker Guide: Building, Pushing, and Running Myway

This guide covers everything you need to build Docker images for the Myway application, push them to Docker Hub, and run them locally using both simple Docker commands and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building Images Locally](#building-images-locally)
3. [Pushing Images to Docker Hub](#pushing-images-to-docker-hub)
4. [Running with Simple Docker Commands](#running-with-simple-docker-commands)
5. [Running with Docker Compose](#running-with-docker-compose)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have:

- **Docker** installed ([download here](https://www.docker.com/products/docker-desktop))
- **Docker Hub account** ([create one here](https://hub.docker.com/))
- Logged in to Docker Hub: `docker login`

### Verify Docker Installation

```bash
docker --version
docker login
```

After `docker login`, you'll be prompted for your Docker Hub username and password.

---

## Building Images Locally

### Quick Method: Use Rebuild Scripts (Recommended)

The easiest way to rebuild and push images is using the provided scripts:

**Windows:**
```cmd
# Rebuild and push both images
rebuild-all.bat

# Or rebuild individually
rebuild-backend.bat
rebuild-frontend.bat
```

**Git Bash/Linux/Mac:**
```bash
# Rebuild and push both images
./rebuild-all.sh

# Or rebuild individually
./rebuild-backend.sh
./rebuild-frontend.sh
```

These scripts automatically:
1. Build the Docker images
2. Tag them for Docker Hub
3. Push to Docker Hub
4. Clean up old images

See [REBUILD_SCRIPTS.md](REBUILD_SCRIPTS.md) for detailed documentation.

### Manual Method: Build Step by Step

If you prefer to build manually:

#### Step 1: Build Backend Image

Navigate to your project root and build the backend image:

```bash
# From the root directory (c:\Users\hulk-\Desktop\personal\etude\Master\S7\method_agile\Myway)
docker build -t myway-backend:latest ./backend
```

**What this does:**
- `-t myway-backend:latest` - Tags the image with name and version
- `./backend` - Builds from the backend Dockerfile

#### Step 2: Build Frontend Image

```bash
docker build -t myway-frontend:latest ./frontend
```

**What this does:**
- Builds the React frontend with Node 18 (build stage)
- Serves built files with Nginx (production stage)
- Multi-stage build optimizes image size

#### Step 3: Verify Images Were Built

```bash
docker images
```

You should see output like:

```
REPOSITORY          TAG       IMAGE ID      CREATED        SIZE
myway-backend       latest    abc123...     2 minutes ago   150MB
myway-frontend      latest    def456...     1 minute ago    40MB
```

---

## Pushing Images to Docker Hub

### Step 1: Tag Images with Docker Hub Repository

Replace `kappa20` with your actual Docker Hub username:

```bash
# Tag backend image
docker tag myway-backend:latest kappa20/myway-backend:latest

# Tag frontend image
docker tag myway-frontend:latest kappa20/myway-frontend:latest
```

**What this does:**
- Creates a new tag pointing to your local image
- Format: `dockerhubusername/repository:tag`
- You can have multiple tags pointing to the same image

### Step 2: Push Images to Docker Hub

```bash
# Push backend
docker push kappa20/myway-backend:latest

# Push frontend
docker push kappa20/myway-frontend:latest
```

**What this does:**
- Uploads your images to Docker Hub
- Takes a few minutes depending on image size and internet speed
- Once pushed, anyone with your Docker Hub username can pull these images

### Step 3: Verify on Docker Hub

1. Go to [hub.docker.com](https://hub.docker.com)
2. Log in with your credentials
3. You should see your new repositories in your profile

---

## Running with Simple Docker Commands

### Method 1: Run Containers Separately (No Networking)

This is simpler but requires manual management.

#### Start Backend

```bash
docker run -d \
  --name myway-backend \
  -p 5000:5000 \
  -e PORT=5000 \
  -e DB_PATH=./database/myway.db \
  -e UPLOAD_DIR=./uploads \
  -v myway-backend-data:/app/database \
  -v myway-backend-uploads:/app/uploads \
  kappa20/myway-backend:latest
```

**Flags explained:**
- `-d` - Run in detached mode (background)
- `--name myway-backend` - Container name
- `-p 5000:5000` - Map port 5000 (host:container)
- `-e KEY=VALUE` - Set environment variables
- `-v volume-name:/app/path` - Create and mount named volumes
- `kappa20/myway-backend:latest` - Image to run

#### Start Frontend

```bash
docker run -d \
  --name myway-frontend \
  -p 3000:80 \
  kappa20/myway-frontend:latest
```

**Note:** Frontend runs on port 3000, backend on 5000, but they can't communicate via localhost because they're in separate containers without a network.

### Method 2: Run Containers on a Shared Network (Recommended)

This allows containers to communicate by name.

#### Create a Docker Network

```bash
docker network create myway-network
```

#### Start Backend on Network

```bash
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
```

#### Start Frontend on Network

```bash
docker run -d \
  --name myway-frontend \
  --network myway-network \
  -p 3000:80 \
  kappa20/myway-frontend:latest
```

**Why this is better:**
- Containers can reach each other by name (e.g., `http://myway-backend:5000`)
- No need for localhost references
- Closer to production setups

### Viewing Container Logs

```bash
# View backend logs
docker logs myway-backend

# View frontend logs
docker logs myway-frontend

# Follow logs in real-time
docker logs -f myway-backend
```

### Stopping Containers

```bash
# Stop individual containers
docker stop myway-backend
docker stop myway-frontend

# Stop and remove containers
docker rm myway-backend
docker rm myway-frontend

# Stop all containers with these names
docker stop $(docker ps -q --filter "name=myway")
```

### Cleaning Up

```bash
# Remove stopped containers
docker container prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune
```

---

## Running with Docker Compose

Docker Compose simplifies managing multiple containers with a single configuration file.

### Option 1: Use Local Images (Your Current Setup)

This is what you have now in `docker-compose.yml`:

```bash
cd c:\Users\hulk-\Desktop\personal\etude\Master\S7\method_agile\Myway

# Build and start
docker-compose up --build

# Start without rebuilding
docker-compose up

# Stop
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Option 2: Use Images from Docker Hub (Recommended for Production)

Create a new file `docker-compose.dockerhub.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: kappa20/myway-backend:latest
    container_name: myway-backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DB_PATH=./database/myway.db
      - UPLOAD_DIR=./uploads
    volumes:
      - backend-data:/app/database
      - backend-uploads:/app/uploads
    restart: unless-stopped

  frontend:
    image: kappa20/myway-frontend:latest
    container_name: myway-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend-data:
  backend-uploads:
```

**Usage:**

```bash
# Pull and start images from Docker Hub
docker-compose -f docker-compose.dockerhub.yml up

# Stop
docker-compose -f docker-compose.dockerhub.yml down

# View logs
docker-compose -f docker-compose.dockerhub.yml logs -f
```

---

## Complete Workflow Example

Here's a complete step-by-step workflow from start to finish:

### 1. Build Images Locally

```bash
cd c:\Users\hulk-\Desktop\personal\etude\Master\S7\method_agile\Myway

# Build both images
docker build -t myway-backend:latest ./backend
docker build -t myway-frontend:latest ./frontend
```

### 2. Test Locally with Docker Compose

```bash
# Test with local images
docker-compose up --build

# Verify at http://localhost:3000
# Stop with Ctrl+C
docker-compose down
```

### 3. Tag for Docker Hub

```bash
docker tag myway-backend:latest kappa20/myway-backend:latest
docker tag myway-frontend:latest kappa20/myway-frontend:latest
```

### 4. Push to Docker Hub

```bash
docker push kappa20/myway-backend:latest
docker push kappa20/myway-frontend:latest
```

### 5. Run from Docker Hub (Simulate Production)

```bash
# Create the docker-compose.dockerhub.yml file above

# Start services from Docker Hub images
docker-compose -f docker-compose.dockerhub.yml up

# Verify at http://localhost:3000
```

---

## Troubleshooting

### 404 Not Found or Demo Mode Not Working

**Symptom:** Accessing `http://localhost:3000/?demo=true` returns 404 from nginx

**Root Causes:**
1. **Missing nginx configuration** - Nginx doesn't know how to handle React Router routes
2. **Wrong API URL in build** - Frontend built with `localhost:5000` instead of proper Docker network routing

**Solution:**

The images need to be rebuilt with the correct configuration:

1. **Nginx configuration exists**: Check that `frontend/nginx.conf` exists with the following:
   - `try_files $uri $uri/ /index.html;` for React Router support
   - `/api/` location block proxying to `http://myway-backend:5000`

2. **Frontend Dockerfile uses nginx config**: Line should read:
   ```dockerfile
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   ```

3. **Production environment variable**: Create `frontend/.env.production`:
   ```
   VITE_API_URL=/api
   ```
   This makes API calls relative (nginx will proxy them to backend)

4. **Rebuild and push new images**:
   ```bash
   # Rebuild frontend with fixes
   docker build -t myway-frontend:latest ./frontend
   docker tag myway-frontend:latest kappa20/myway-frontend:latest
   docker push kappa20/myway-frontend:latest

   # Stop old containers
   docker stop myway-frontend myway-backend
   docker rm myway-frontend myway-backend

   # Restart with new images
   docker run -d --name myway-backend --network myway-network -p 5000:5000 \
     -e PORT=5000 -e DB_PATH=./database/myway.db -e UPLOAD_DIR=./uploads \
     -v myway-backend-data:/app/database -v myway-backend-uploads:/app/uploads \
     kappa20/myway-backend:latest

   docker run -d --name myway-frontend --network myway-network -p 3000:80 \
     kappa20/myway-frontend:latest
   ```

5. **Test**: Visit `http://localhost:3000/?demo=true` - should now load with demo data

### Frontend Can't Connect to Backend

**Symptom:** Frontend shows error connecting to API

**Solution:** Check frontend environment variable in Dockerfile or docker-compose.yml

The frontend needs to know the backend URL. Update the Nginx configuration or frontend build to use the correct backend address.

**For the current setup:**
- In `docker-compose.yml`, frontend depends on backend service name: `myway-backend`
- Frontend should be configured to call `http://myway-backend:5000` (service name, not localhost)
- Nginx should proxy `/api/` requests to backend container

### Ports Already in Use

**Symptom:** `Error response from daemon: driver failed programming external connectivity`

**Solution:**

```bash
# Find what's using port 5000 (Windows)
netstat -ano | findstr :5000

# Find what's using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml or docker run command
```

### Image Not Found on Docker Hub

**Symptom:** `Status: Downloaded newer image for kappa20/myway-backend:latest` fails

**Solutions:**
1. Verify you're logged in: `docker login`
2. Verify image exists on Docker Hub
3. Check username spelling
4. Make sure you pushed it: `docker push kappa20/myway-backend:latest`

### Database Persists Incorrectly

**Symptom:** Data is lost when containers stop

**Solution:** Ensure volumes are properly mounted

```bash
# Check volume status
docker volume ls

# Inspect a volume
docker volume inspect myway-backend-data

# Verify in docker-compose.yml:
volumes:
  backend-data:
  backend-uploads:
```

### Building Fails with "npm install" Error

**Symptom:** Docker build fails during npm install

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Rebuild without cache
docker build --no-cache -t myway-backend:latest ./backend

# Check package*.json exists
ls backend/package*.json
```

### Container Exits Immediately

**Symptom:** `docker ps` doesn't show the container

**Solutions:**

```bash
# Check logs of exited container
docker logs myway-backend

# Check if the container crashed
docker ps -a | grep myway

# Common issues:
# - Port already in use
# - Missing environment variables
# - Database connection error
```

---

## Quick Reference

### Most Common Commands

```bash
# Build
docker build -t myway-backend:latest ./backend

# Tag
docker tag myway-backend:latest kappa20/myway-backend:latest

# Push
docker push kappa20/myway-backend:latest

# Run
docker run -d -p 5000:5000 kappa20/myway-backend:latest

# Compose
docker-compose up
docker-compose down
docker-compose logs -f

# Clean up
docker system prune -a
```

### Environment Variables Reference

**Backend (backend/Dockerfile):**
- `PORT` - Server port (default: 5000)
- `DB_PATH` - Database file path (default: ./database/myway.db)
- `UPLOAD_DIR` - Upload directory path (default: ./uploads)

**Frontend:**
- `VITE_API_URL` - Backend API URL (set during build if needed)

---

## Next Steps

1. **Create Docker Hub Account** if you haven't already
2. **Build** your images: `docker build -t myway-backend:latest ./backend`
3. **Test** locally with docker-compose: `docker-compose up`
4. **Tag** for Docker Hub: `docker tag myway-backend:latest kappa20/myway-backend:latest`
5. **Push** to Docker Hub: `docker push kappa20/myway-backend:latest`
6. **Verify** images appear on Docker Hub website
7. **Test** from Docker Hub: `docker-compose -f docker-compose.dockerhub.yml up`

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices for Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
