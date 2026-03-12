#!/bin/bash

echo "🔧 Rebuilding Frontend Container"
echo "================================"
echo ""

# Step 1: Stop and remove existing container
echo "Step 1: Stopping existing frontend container..."
docker ps -a --filter "ancestor=vijikumaresh05/educonnect-frontend:latest" --format "{{.ID}}" | xargs -r docker stop
docker ps -a --filter "ancestor=vijikumaresh05/educonnect-frontend:latest" --format "{{.ID}}" | xargs -r docker rm
echo "✅ Old containers stopped and removed"
echo ""

# Step 2: Remove old image (optional, forces fresh build)
echo "Step 2: Removing old image to force fresh build..."
docker rmi vijikumaresh05/educonnect-frontend:latest 2>/dev/null || echo "Image not found or already removed"
echo ""

# Step 3: Rebuild without cache
echo "Step 3: Rebuilding frontend image (no cache)..."
cd /home/pc3/Desktop/Educonnect/frontend || exit 1
docker build --no-cache \
    --build-arg VITE_API_URL=https://registerstudentsapi.kattral.ai/api \
    -t vijikumaresh05/educonnect-frontend:latest \
    . || {
    echo "❌ Build failed"
    exit 1
}
echo "✅ Frontend image rebuilt successfully"
echo ""

# Step 4: Verify preview server command in image
echo "Step 4: Verifying Vite preview command..."
docker run --rm --entrypoint sh vijikumaresh05/educonnect-frontend:latest -c "npm run preview -- --help" 2>&1 | head -10
echo ""

echo "🎉 Frontend image rebuilt successfully!"
echo ""
echo "To run the container:"
echo "  docker run -d -p 6375:6375 --name educonnect-frontend vijikumaresh05/educonnect-frontend:latest"
echo ""
echo "Or if using docker-compose, restart:"
echo "  docker-compose up -d frontend"

