#!/bin/bash

echo "🔍 Docker Hub Verification and Push Script"
echo "=========================================="
echo ""

# Step 1: Check Docker login
echo "Step 1: Checking Docker Hub login..."
if docker info 2>/dev/null | grep -q "Username"; then
    LOGGED_USER=$(docker info 2>/dev/null | grep "Username:" | awk '{print $2}')
    echo "✅ Logged in as: $LOGGED_USER"
else
    echo "❌ Not logged in to Docker Hub"
    echo ""
    echo "Please login first:"
    echo "  docker login"
    echo "  Username: svijikumaresh05@gmail.com (or your Docker Hub username)"
    echo "  Password: vijayalakshmi"
    exit 1
fi

echo ""
echo "Step 2: Verifying username..."
echo "Current script uses: vijikumaresh05"
echo "Logged in as: $LOGGED_USER"
echo ""

if [ "$LOGGED_USER" != "vijikumaresh05" ]; then
    echo "⚠️  Username mismatch detected!"
    echo "Script uses: vijikumaresh05"
    echo "You're logged in as: $LOGGED_USER"
    echo ""
    read -p "Use logged-in username ($LOGGED_USER) instead? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        DOCKER_USERNAME="$LOGGED_USER"
    else
        DOCKER_USERNAME="vijikumaresh05"
        echo "Using: $DOCKER_USERNAME"
    fi
else
    DOCKER_USERNAME="vijikumaresh05"
    echo "✅ Username matches: $DOCKER_USERNAME"
fi

echo ""
echo "Step 3: Testing Docker Hub access..."
echo "Attempting to pull a test image to verify permissions..."
if docker pull hello-world:latest >/dev/null 2>&1; then
    echo "✅ Docker Hub access verified"
    docker rmi hello-world:latest >/dev/null 2>&1
else
    echo "⚠️  Could not verify Docker Hub access"
fi

echo ""
echo "Step 4: Building and pushing images..."
echo "Using username: $DOCKER_USERNAME"
echo ""

# Build Backend
echo "🏗️  Building Backend..."
cd /home/pc3/Desktop/Educonnect/backend || exit 1
docker build -t ${DOCKER_USERNAME}/educonnect-backend:latest . || {
    echo "❌ Backend build failed"
    exit 1
}
echo "✅ Backend built"

# Build Frontend
echo ""
echo "🏗️  Building Frontend..."
cd /home/pc3/Desktop/Educonnect/frontend || exit 1
docker build \
    --build-arg VITE_API_URL=https://registerstudentsapi.kattral.ai/api \
    -t ${DOCKER_USERNAME}/educonnect-frontend:latest \
    . || {
    echo "❌ Frontend build failed"
    exit 1
}
echo "✅ Frontend built"

# Push Backend
echo ""
echo "📤 Pushing Backend..."
if docker push ${DOCKER_USERNAME}/educonnect-backend:latest; then
    echo "✅ Backend pushed successfully"
else
    echo "❌ Backend push failed"
    echo ""
    echo "Possible solutions:"
    echo "1. Create repository on Docker Hub: https://hub.docker.com/repository/create"
    echo "   Repository name: educonnect-backend"
    echo "   Visibility: Public or Private"
    echo ""
    echo "2. Verify username is correct: $DOCKER_USERNAME"
    echo ""
    echo "3. Try logging in again: docker login"
    exit 1
fi

# Push Frontend
echo ""
echo "📤 Pushing Frontend..."
if docker push ${DOCKER_USERNAME}/educonnect-frontend:latest; then
    echo "✅ Frontend pushed successfully"
else
    echo "❌ Frontend push failed"
    echo ""
    echo "Possible solutions:"
    echo "1. Create repository on Docker Hub: https://hub.docker.com/repository/create"
    echo "   Repository name: educonnect-frontend"
    echo "   Visibility: Public or Private"
    echo ""
    echo "2. Verify username is correct: $DOCKER_USERNAME"
    exit 1
fi

echo ""
echo "🎉 SUCCESS! All images pushed to Docker Hub"
echo ""
echo "Images:"
echo "  - ${DOCKER_USERNAME}/educonnect-backend:latest"
echo "  - ${DOCKER_USERNAME}/educonnect-frontend:latest"
echo ""
echo "View at: https://hub.docker.com/u/${DOCKER_USERNAME}"

