#!/bin/bash

# 🐳 Docker Hub Push Script for Educonnect
# This script builds and pushes both frontend and backend images to Docker Hub

# ============================================================================
# CONFIGURATION - CHANGE THIS TO YOUR DOCKER HUB USERNAME
# ============================================================================
DOCKER_USERNAME="vijikumaresh"  # Your Docker Hub username

# ============================================================================
# Colors for output
# ============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# Functions
# ============================================================================
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
}

check_docker_running() {
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi
}

# ============================================================================
# Main Script
# ============================================================================

print_header "🐳 EDUCONNECT DOCKER HUB PUSH SCRIPT"

# Validate Docker Hub username
if [ "$DOCKER_USERNAME" = "YOUR_USERNAME" ] || [ -z "$DOCKER_USERNAME" ]; then
    print_error "Please edit this script and set DOCKER_USERNAME to your Docker Hub username"
    print_info "Open push-to-dockerhub.sh and change line 9"
    exit 1
fi

print_info "Docker Hub Username: $DOCKER_USERNAME"
print_info "Frontend Image: ${DOCKER_USERNAME}/educonnect-frontend:latest"
print_info "Backend Image: ${DOCKER_USERNAME}/educonnect-backend:latest"
echo ""

# Check Docker
print_info "Checking Docker installation..."
check_docker
check_docker_running
print_success "Docker is ready"
echo ""

# Login to Docker Hub
print_header "🔐 STEP 1/5: Docker Hub Login"
if docker login; then
    print_success "Successfully logged in to Docker Hub"
else
    print_error "Failed to login to Docker Hub"
    exit 1
fi
echo ""

# Build Backend
print_header "🏗️  STEP 2/5: Building Backend Image"
cd /home/pc3/Desktop/Educonnect/backend || exit 1
print_info "Building ${DOCKER_USERNAME}/educonnect-backend:latest..."

if docker build -t ${DOCKER_USERNAME}/educonnect-backend:latest .; then
    print_success "Backend image built successfully"
else
    print_error "Failed to build backend image"
    exit 1
fi
echo ""

# Build Frontend
print_header "🏗️  STEP 3/5: Building Frontend Image"
cd /home/pc3/Desktop/Educonnect/frontend || exit 1
print_info "Building ${DOCKER_USERNAME}/educonnect-frontend:latest..."

if docker build \
    --build-arg VITE_API_URL=https://registerstudents.kattral.ai/api \
    -t ${DOCKER_USERNAME}/educonnect-frontend:latest \
    .; then
    print_success "Frontend image built successfully"
else
    print_error "Failed to build frontend image"
    exit 1
fi
echo ""

# Push Backend
print_header "📤 STEP 4/5: Pushing Backend to Docker Hub"
print_info "Pushing ${DOCKER_USERNAME}/educonnect-backend:latest..."

if docker push ${DOCKER_USERNAME}/educonnect-backend:latest; then
    print_success "Backend pushed successfully"
else
    print_error "Failed to push backend image"
    exit 1
fi
echo ""

# Push Frontend
print_header "📤 STEP 5/5: Pushing Frontend to Docker Hub"
print_info "Pushing ${DOCKER_USERNAME}/educonnect-frontend:latest..."

if docker push ${DOCKER_USERNAME}/educonnect-frontend:latest; then
    print_success "Frontend pushed successfully"
else
    print_error "Failed to push frontend image"
    exit 1
fi
echo ""

# Summary
print_header "🎉 ALL DONE! IMAGES PUBLISHED TO DOCKER HUB"
echo ""
print_success "Backend Image:  ${DOCKER_USERNAME}/educonnect-backend:latest"
print_success "Frontend Image: ${DOCKER_USERNAME}/educonnect-frontend:latest"
echo ""
print_info "View your images at: https://hub.docker.com/u/${DOCKER_USERNAME}"
echo ""
print_info "To pull these images:"
echo "  docker pull ${DOCKER_USERNAME}/educonnect-backend:latest"
echo "  docker pull ${DOCKER_USERNAME}/educonnect-frontend:latest"
echo ""
print_header "✨ SUCCESS"

