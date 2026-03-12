#!/bin/bash

# Fixed Docker Hub Push Script
# This script verifies login and uses correct username

echo "🐳 Docker Hub Push - Fixed Version"
echo "==================================="
echo ""

# Step 1: Verify Login
echo "🔍 Step 1: Verifying Docker Hub Login..."
if ! docker info 2>/dev/null | grep -q "Username"; then
    echo "❌ Not logged in. Please login first:"
    echo ""
    echo "Run: docker login"
    echo "Username: svijikumaresh05@gmail.com (or your Docker Hub username)"
    echo "Password: vijayalakshmi"
    echo ""
    read -p "Press Enter after logging in, or Ctrl+C to cancel..."
fi

# Get the actual logged-in username
LOGGED_IN_USER=$(docker info 2>/dev/null | grep "Username:" | awk '{print $2}' || echo "")

if [ -z "$LOGGED_IN_USER" ]; then
    echo "⚠️  Could not detect logged-in username"
    echo "Please enter your Docker Hub username:"
    read -p "Username: " DOCKER_USERNAME
else
    DOCKER_USERNAME="$LOGGED_IN_USER"
    echo "✅ Detected username: $DOCKER_USERNAME"
fi

echo ""
echo "Using Docker Hub username: $DOCKER_USERNAME"
echo "Images will be tagged as:"
echo "  - ${DOCKER_USERNAME}/educonnect-backend:latest"
echo "  - ${DOCKER_USERNAME}/educonnect-frontend:latest"
echo ""

read -p "Is this correct? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please edit the script and set DOCKER_USERNAME manually"
    exit 1
fi

# Build Backend
echo ""
echo "🏗️  Step 2: Building Backend Image..."
cd /home/pc3/Desktop/Educonnect/backend || exit 1
docker build -t ${DOCKER_USERNAME}/educonnect-backend:latest . || {
    echo "❌ Backend build failed"
    exit 1
}
echo "✅ Backend built successfully"

# Build Frontend
echo ""
echo "🏗️  Step 3: Building Frontend Image..."
cd /home/pc3/Desktop/Educonnect/frontend || exit 1
docker build \
    --build-arg VITE_API_URL=https://registerstudentsapi.kattral.ai \
    -t ${DOCKER_USERNAME}/educonnect-frontend:latest \
    . || {
    echo "❌ Frontend build failed"
    exit 1
}
echo "✅ Frontend built successfully"

# Push Backend
echo ""
echo "📤 Step 4: Pushing Backend to Docker Hub..."
docker push ${DOCKER_USERNAME}/educonnect-backend:latest || {
    echo "❌ Backend push failed"
    echo ""
    echo "Possible issues:"
    echo "1. Username mismatch - verify your Docker Hub username"
    echo "2. Repository doesn't exist - create it on Docker Hub first"
    echo "3. Not logged in - run: docker login"
    exit 1
}
echo "✅ Backend pushed successfully"

# Push Frontend
echo ""
echo "📤 Step 5: Pushing Frontend to Docker Hub..."
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

