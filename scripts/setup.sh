#!/bin/bash

# ARVEX CLOUD SETUP SCRIPT
# Complete system setup and initialization

set -e

echo "🚀 ARVEX CLOUD SETUP SCRIPT"
echo "====================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads logs certs

# Copy environment file if not exists
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file from .env.example"
    cp .env.example .env
    echo "⚠️ IMPORTANT: Edit .env with your settings!"
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose build

# Start services
echo "▶️ Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T backend npm run migration:run || true

# Seed database
echo "🌱 Seeding database..."
docker-compose exec -T postgres psql -U arvex -d arvex_cloud -f /docker-entrypoint-initdb.d/02-seeds.sql || true

echo ""
echo "✅ ARVEX CLOUD Setup Complete!"
echo ""
echo "📍 Access Points:"
echo "   Frontend:  http://localhost:3001"
echo "   Backend:   http://localhost:3000"
echo "   API Docs:  http://localhost:3000/api"
echo "   Admin:     http://localhost:3001/admin"
echo ""
echo "👤 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "⚠️ SECURITY: Change these credentials immediately!"
echo ""
