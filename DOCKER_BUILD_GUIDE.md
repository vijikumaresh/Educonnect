# 🐳 Docker Build & Push Guide

## Quick Commands

### Build All Images with Docker Compose
```bash
cd /home/pc3/Desktop/Educonnect
docker-compose build
```

### Or Build Individual Images

#### Backend Image
```bash
cd /home/pc3/Desktop/Educonnect/backend
docker build -t vijikumaresh/educonnectapp-backend:v1 .
```

#### Frontend Image
```bash
cd /home/pc3/Desktop/Educonnect/frontend
docker build -t vijikumaresh/educonnectapp-frontend:v1 .
```

---

## Option 1: Build and Push Individual Images

### 1. Build Backend
```bash
cd /home/pc3/Desktop/Educonnect/backend
docker build -t vijikumaresh/educonnectapp-backend:v1 .
docker build -t vijikumaresh/educonnectapp-backend:latest .
```

### 2. Build Frontend
```bash
cd /home/pc3/Desktop/Educonnect/frontend
docker build -t vijikumaresh/educonnectapp-frontend:v1 .
docker build -t vijikumaresh/educonnectapp-frontend:latest .
```

### 3. Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username: vijikumaresh
# Enter your password: (your Docker Hub password)
```

### 4. Push Backend
```bash
docker push vijikumaresh/educonnectapp-backend:v1
docker push vijikumaresh/educonnectapp-backend:latest
```

### 5. Push Frontend
```bash
docker push vijikumaresh/educonnectapp-frontend:v1
docker push vijikumaresh/educonnectapp-frontend:latest
```

---

## Option 2: Use Docker Compose (Recommended)

### Build All Services
```bash
cd /home/pc3/Desktop/Educonnect
docker-compose build
```

### Tag Images for Push
```bash
# Tag backend
docker tag educonnect-backend vijikumaresh/educonnectapp-backend:v1
docker tag educonnect-backend vijikumaresh/educonnectapp-backend:latest

# Tag frontend
docker tag educonnect-frontend vijikumaresh/educonnectapp-frontend:v1
docker tag educonnect-frontend vijikumaresh/educonnectapp-frontend:latest
```

### Push to Docker Hub
```bash
docker push vijikumaresh/educonnectapp-backend:v1
docker push vijikumaresh/educonnectapp-backend:latest
docker push vijikumaresh/educonnectapp-frontend:v1
docker push vijikumaresh/educonnectapp-frontend:latest
```

---

## Complete Workflow Script

Save this as `build-and-push.sh`:

```bash
#!/bin/bash

set -e

echo "🐳 Building and Pushing Educonnect Docker Images"
echo "=================================================="

# Docker Hub username
DOCKER_USERNAME="vijikumaresh"
VERSION="v1"

# 1. Build images
echo ""
echo "📦 Step 1: Building images..."
cd /home/pc3/Desktop/Educonnect

echo "  Building backend..."
docker build -t ${DOCKER_USERNAME}/educonnectapp-backend:${VERSION} -t ${DOCKER_USERNAME}/educonnectapp-backend:latest ./backend

echo "  Building frontend..."
docker build -t ${DOCKER_USERNAME}/educonnectapp-frontend:${VERSION} -t ${DOCKER_USERNAME}/educonnectapp-frontend:latest ./frontend

# 2. Login to Docker Hub
echo ""
echo "🔐 Step 2: Login to Docker Hub"
echo "  Please enter your Docker Hub credentials..."
docker login

# 3. Push images
echo ""
echo "📤 Step 3: Pushing images to Docker Hub..."

echo "  Pushing backend:${VERSION}..."
docker push ${DOCKER_USERNAME}/educonnectapp-backend:${VERSION}

echo "  Pushing backend:latest..."
docker push ${DOCKER_USERNAME}/educonnectapp-backend:latest

echo "  Pushing frontend:${VERSION}..."
docker push ${DOCKER_USERNAME}/educonnectapp-frontend:${VERSION}

echo "  Pushing frontend:latest..."
docker push ${DOCKER_USERNAME}/educonnectapp-frontend:latest

# 4. Summary
echo ""
echo "✅ Complete!"
echo "=================================================="
echo ""
echo "Images pushed:"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-backend:${VERSION}"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-backend:latest"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-frontend:${VERSION}"
echo "  🔹 ${DOCKER_USERNAME}/educonnectapp-frontend:latest"
echo ""
echo "View on Docker Hub:"
echo "  https://hub.docker.com/r/${DOCKER_USERNAME}/educonnectapp-backend"
echo "  https://hub.docker.com/r/${DOCKER_USERNAME}/educonnectapp-frontend"
```

---

## Update docker-compose.yml for Docker Hub Images

If you want to use your Docker Hub images in docker-compose:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    # ... (same as before)

  backend:
    image: vijikumaresh/educonnectapp-backend:latest
    # Remove the 'build' section
    restart: unless-stopped
    # ... (rest of config)

  frontend:
    image: vijikumaresh/educonnectapp-frontend:latest
    # Remove the 'build' section
    restart: unless-stopped
    # ... (rest of config)
```

---

## Troubleshooting

### Error: "Cannot connect to Docker daemon"
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# Logout and login again
```

### Error: "denied: requested access to the resource is denied"
```bash
# Make sure you're logged in
docker login

# Verify your username
docker info | grep Username
```

### Error: "Dockerfile not found"
```bash
# Make sure you're in the correct directory
cd /home/pc3/Desktop/Educonnect/backend  # for backend
# OR
cd /home/pc3/Desktop/Educonnect/frontend  # for frontend
```

### Build takes too long
```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker build -t your-image .
```

---

## Verify Images

### List local images
```bash
docker images | grep educonnect
```

### Check image size
```bash
docker images vijikumaresh/educonnectapp-backend
docker images vijikumaresh/educonnectapp-frontend
```

### Test image locally
```bash
# Test backend
docker run --rm -p 8080:8080 vijikumaresh/educonnectapp-backend:v1

# Test frontend
docker run --rm -p 80:80 vijikumaresh/educonnectapp-frontend:v1
```

---

## Expected Image Sizes

- **Backend**: ~200-300 MB (Rust binary + minimal runtime)
- **Frontend**: ~30-50 MB (Nginx + static files)
- **PostgreSQL**: ~80 MB (alpine)

---

## Deployment on Remote Server

Once images are pushed to Docker Hub:

```bash
# On remote server
docker pull vijikumaresh/educonnectapp-backend:v1
docker pull vijikumaresh/educonnectapp-frontend:v1

# Or use docker-compose
docker-compose pull
docker-compose up -d
```

