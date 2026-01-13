#!/bin/bash

# Script to rebuild and push both backend and frontend images to Docker Hub
# Usage: ./rebuild-all.sh

set -e  # Exit on error

DOCKER_USERNAME="kappa20"

echo "========================================"
echo "Rebuilding All Docker Images for Myway"
echo "========================================"
echo ""

# Navigate to project root (if script is run from anywhere)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Backend
echo "▶ Building Backend..."
echo "--------------------"
docker build -t myway-backend:latest ./backend
docker tag myway-backend:latest ${DOCKER_USERNAME}/myway-backend:latest
echo "✓ Backend built"
echo ""

# Frontend
echo "▶ Building Frontend..."
echo "---------------------"
docker build -t myway-frontend:latest ./frontend
docker tag myway-frontend:latest ${DOCKER_USERNAME}/myway-frontend:latest
echo "✓ Frontend built"
echo ""

# Push both
echo "▶ Pushing to Docker Hub..."
echo "--------------------------"
docker push ${DOCKER_USERNAME}/myway-backend:latest
echo "✓ Backend pushed"
docker push ${DOCKER_USERNAME}/myway-frontend:latest
echo "✓ Frontend pushed"
echo ""

# Cleanup
echo "▶ Cleaning up..."
docker image prune -f
echo ""

echo "========================================="
echo "✅ All images rebuilt and pushed!"
echo "========================================="
echo ""
echo "Images on Docker Hub:"
echo "  • ${DOCKER_USERNAME}/myway-backend:latest"
echo "  • ${DOCKER_USERNAME}/myway-frontend:latest"
echo ""
echo "Next steps:"
echo "  1. Stop running containers: docker stop myway-frontend myway-backend"
echo "  2. Remove old containers: docker rm myway-frontend myway-backend"
echo "  3. Pull new images: docker pull ${DOCKER_USERNAME}/myway-backend:latest"
echo "                      docker pull ${DOCKER_USERNAME}/myway-frontend:latest"
echo "  4. Restart with: docker-compose up -d"
echo ""
