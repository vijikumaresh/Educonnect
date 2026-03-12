#!/bin/bash

# Quick Docker Hub Push Script
# This script will build and push images to Docker Hub

DOCKER_USERNAME="vijikumaresh05"  # Docker Hub username

echo "🐳 Docker Hub Push Script"
echo "=========================="
echo "Username: $DOCKER_USERNAME"
echo ""

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "Please enter your Docker Hub credentials:"
echo "Username: svijikumaresh05@gmail.com (or vijikumaresh05)"
echo "Password: [will be prompted]"
echo ""
docker login -u "svijikumaresh05@gmail.com" || {
    echo ""
    echo "⚠️  Login with email failed, trying with username..."
    docker login -u "$DOCKER_USERNAME" || {
        echo "❌ Login failed. Please check your credentials"
        echo ""
        echo "Try manually: docker login"
        exit 1
    }
}

echo ""
echo "✅ Logged in successfully"
echo ""

# Build Backend
echo "🏗️  Building Backend Image..."
cd /home/pc3/Desktop/Educonnect/backend || exit 1
docker build -t ${DOCKER_USERNAME}/educonnect-backend:latest . || {
    echo "❌ Backend build failed"
    exit 1
}
echo "✅ Backend built successfully"
echo ""

# Build Frontend
echo "🏗️  Building Frontend Image..."
cd /home/pc3/Desktop/Educonnect/frontend || exit 1
docker build \
    --build-arg VITE_API_URL=https://registerstudentsapi.kattral.ai/api \
    -t ${DOCKER_USERNAME}/educonnect-frontend:latest \
    . || {
    echo "❌ Frontend build failed"
    exit 1
}
echo "✅ Frontend built successfully"
echo ""

# Push Backend
echo "📤 Pushing Backend to Docker Hub..."
docker push ${DOCKER_USERNAME}/educonnect-backend:latest || {
    echo "❌ Backend push failed"
    exit 1
}
echo "✅ Backend pushed successfully"
echo ""

# Push Frontend
echo "📤 Pushing Frontend to Docker Hub..."
docker push ${DOCKER_USERNAME}/educonnect-frontend:latest || {
    echo "❌ Frontend push failed"
    exit 1
}
echo "✅ Frontend pushed successfully"
echo ""

echo "🎉 SUCCESS! All images pushed to Docker Hub"
echo ""
echo "Images:"
echo "  - ${DOCKER_USERNAME}/educonnect-backend:latest"
echo "  - ${DOCKER_USERNAME}/educonnect-frontend:latest"
echo ""
echo "View at: https://hub.docker.com/u/${DOCKER_USERNAME}"

