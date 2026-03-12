#!/bin/bash

echo "🔍 Checking Docker Hub Login Status"
echo "===================================="
echo ""

# Check if logged in
if docker info 2>/dev/null | grep -q "Username"; then
    echo "✅ Docker is logged in"
    echo ""
    echo "Current login info:"
    docker info 2>/dev/null | grep -E "(Username|Registry)" || echo "Could not retrieve username"
else
    echo "❌ Not logged in to Docker Hub"
    echo ""
    echo "Please login with: docker login"
fi

echo ""
echo "Checking Docker Hub config:"
if [ -f ~/.docker/config.json ]; then
    echo "Config file exists at: ~/.docker/config.json"
    echo ""
    echo "Auth info (if present):"
    cat ~/.docker/config.json | grep -A 5 "auths" | head -10 || echo "No auth info found"
else
    echo "❌ No Docker config file found"
fi

echo ""
echo "To verify your Docker Hub username:"
echo "1. Visit: https://hub.docker.com"
echo "2. Check your profile - the username is in the URL"
echo "3. Make sure the script uses the EXACT username"


