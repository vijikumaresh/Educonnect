#!/bin/bash

# Educonnect Docker Quick Start Script
# This script helps you quickly deploy the Educonnect application using Docker

set -e

echo "🐳 Educonnect Docker Deployment"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Use 'docker compose' (v2) or 'docker-compose' (v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo "✅ Docker is installed"
echo "✅ Docker Compose is installed"
echo ""

# Function to display menu
show_menu() {
    echo "Please select an option:"
    echo "1) 🚀 Start all services"
    echo "2) 🔨 Build and start all services"
    echo "3) 🛑 Stop all services"
    echo "4) 🗑️  Stop and remove all containers"
    echo "5) 📊 View logs"
    echo "6) 📈 View service status"
    echo "7) 🔄 Restart services"
    echo "8) 🗄️  Access database shell"
    echo "9) ❌ Exit"
    echo ""
}

# Start services
start_services() {
    echo "🚀 Starting services..."
    $DOCKER_COMPOSE up -d
    echo ""
    echo "✅ Services started!"
    show_status
}

# Build and start
build_and_start() {
    echo "🔨 Building and starting services..."
    $DOCKER_COMPOSE up -d --build
    echo ""
    echo "✅ Services built and started!"
    show_status
}

# Stop services
stop_services() {
    echo "🛑 Stopping services..."
    $DOCKER_COMPOSE stop
    echo "✅ Services stopped!"
}

# Remove containers
remove_containers() {
    echo "🗑️  Stopping and removing containers..."
    read -p "⚠️  Do you want to remove volumes (database data)? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        $DOCKER_COMPOSE down -v
        echo "✅ Containers and volumes removed!"
    else
        $DOCKER_COMPOSE down
        echo "✅ Containers removed (data preserved)!"
    fi
}

# View logs
view_logs() {
    echo "📊 Viewing logs (Ctrl+C to exit)..."
    $DOCKER_COMPOSE logs -f
}

# Show status
show_status() {
    echo "📈 Service Status:"
    echo ""
    $DOCKER_COMPOSE ps
    echo ""
    echo "🌐 Access points:"
    echo "   Frontend:  http://localhost"
    echo "   Backend:   http://localhost:8080"
    echo "   Database:  localhost:5432"
    echo ""
    echo "🔑 Default credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
}

# Restart services
restart_services() {
    echo "🔄 Restarting services..."
    $DOCKER_COMPOSE restart
    echo "✅ Services restarted!"
}

# Database shell
db_shell() {
    echo "🗄️  Opening database shell..."
    echo "   Type '\q' to exit"
    echo ""
    $DOCKER_COMPOSE exec postgres psql -U postgres -d educonnect_app
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-9]: " choice
    echo ""
    
    case $choice in
        1)
            start_services
            ;;
        2)
            build_and_start
            ;;
        3)
            stop_services
            ;;
        4)
            remove_containers
            ;;
        5)
            view_logs
            ;;
        6)
            show_status
            ;;
        7)
            restart_services
            ;;
        8)
            db_shell
            ;;
        9)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
done

