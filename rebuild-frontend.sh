#!/bin/bash

# Script to rebuild and push frontend image to Docker Hub
# Usage: ./rebuild-frontend.sh

set -e  # Exit on error

DOCKER_USERNAME="kappa20"
IMAGE_NAME="myway-frontend"
TAG="latest"

echo "================================="
echo "Rebuilding Frontend Docker Image"
echo "================================="
echo ""

# Navigate to project root (if script is run from anywhere)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Step 1/4: Building Docker image..."
docker build -t ${IMAGE_NAME}:${TAG} ./frontend

echo ""
echo "Step 2/4: Tagging image for Docker Hub..."
docker tag ${IMAGE_NAME}:${TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}

echo ""
echo "Step 3/4: Pushing to Docker Hub..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}

echo ""
echo "Step 4/4: Cleaning up old images..."
docker image prune -f

echo ""
echo "✅ Success! Frontend image pushed to Docker Hub"
echo "   Image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
echo ""
echo "To run the updated image:"
echo "  docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
echo ""
