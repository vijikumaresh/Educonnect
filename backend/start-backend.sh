#!/bin/bash

# Start Educonnect Backend
cd /home/pc3/Desktop/Educonnect/backend

echo "🚀 Starting Educonnect Backend..."
echo "📊 Using PostgreSQL database (educonnect_app)"

# Start with PostgreSQL
DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run

