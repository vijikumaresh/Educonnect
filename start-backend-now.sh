#!/bin/bash

# Quick script to start the Educonnect backend
cd /home/pc3/Desktop/Educonnect/backend

echo "🚀 Starting Educonnect Backend..."
echo "📊 Checking prerequisites..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running!"
    echo "   Please start PostgreSQL first:"
    echo "   sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Check if database exists, create if not
if ! psql -U pc3 -d educonnect_app -c "SELECT 1;" > /dev/null 2>&1; then
    echo "📦 Creating database 'educonnect_app'..."
    psql -U pc3 -d postgres -c "CREATE DATABASE educonnect_app;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Database created"
    else
        echo "⚠️  Database might already exist or there was an error"
    fi
else
    echo "✅ Database 'educonnect_app' exists"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL=postgres://pc3@localhost/educonnect_app
JWT_SECRET=your-secret-key-change-this-in-production
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
RUST_LOG=info
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🚀 Starting backend server on http://127.0.0.1:8080"
echo "   Press Ctrl+C to stop"
echo ""

# Start the backend
DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run

