#!/bin/bash

set -e

echo "🐳 Building and Pushing Educonnect Docker Images"
echo "=================================================="

# Docker Hub username
DOCKER_USERNAME="vijikumaresh"
VERSION="v1"
PROJECT_DIR="/home/pc3/Desktop/Educonnect"

# 1. Build images
echo ""
echo "📦 Step 1: Building images..."

echo ""
echo "  🔨 Building backend..."
cd ${PROJECT_DIR}/backend
docker build -t ${DOCKER_USERNAME}/educonnectapp-backend:${VERSION} -t ${DOCKER_USERNAME}/educonnectapp-backend:latest .

echo ""
echo "  🔨 Building frontend..."
cd ${PROJECT_DIR}/frontend
docker build -t ${DOCKER_USERNAME}/educonnectapp-frontend:${VERSION} -t ${DOCKER_USERNAME}/educonnectapp-frontend:latest .

# 2. List built images
echo ""
echo "✅ Images built successfully!"
echo ""
docker images | grep "${DOCKER_USERNAME}/educonnectapp"

# 3. Login to Docker Hub
echo ""
echo "🔐 Step 2: Login to Docker Hub"
echo "  Please enter your Docker Hub credentials..."
docker login

# 4. Push images
echo ""
echo "📤 Step 3: Pushing images to Docker Hub..."

echo ""
echo "  ⬆️  Pushing backend:${VERSION}..."
docker push ${DOCKER_USERNAME}/educonnectapp-backend:${VERSION}

echo ""
echo "  ⬆️  Pushing backend:latest..."
docker push ${DOCKER_USERNAME}/educonnectapp-backend:latest

echo ""
echo "  ⬆️  Pushing frontend:${VERSION}..."
docker push ${DOCKER_USERNAME}/educonnectapp-frontend:${VERSION}

echo ""
echo "  ⬆️  Pushing frontend:latest..."
docker push ${DOCKER_USERNAME}/educonnectapp-frontend:latest

# 5. Summary
echo ""
echo "✅ Complete!"
echo "=================================================="
echo ""
echo "📦 Images pushed to Docker Hub:"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-backend:${VERSION}"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-backend:latest"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-frontend:${VERSION}"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-frontend:latest"
echo ""
echo "🌐 View on Docker Hub:"
echo "  📍 https://hub.docker.com/r/${DOCKER_USERNAME}/educonnectapp-backend"
echo "  📍 https://hub.docker.com/r/${DOCKER_USERNAME}/educonnectapp-frontend"
echo ""
echo "🚀 Deploy on any server with:"
echo "  docker pull ${DOCKER_USERNAME}/educonnectapp-backend:latest"
echo "  docker pull ${DOCKER_USERNAME}/educonnectapp-frontend:latest"
echo ""
echo "Or use docker-compose:"
echo "  cd ${PROJECT_DIR}"
echo "  docker-compose up -d"
echo ""

