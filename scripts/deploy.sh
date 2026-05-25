#!/bin/bash

# ARVEX CLOUD DEPLOYMENT SCRIPT
# Production deployment automation

set -e

echo "🚀 ARVEX CLOUD DEPLOYMENT SCRIPT"
echo "====================================="

BRANCH=${1:-main}
ENVIRONMENT=${2:-production}

echo "📦 Deploying from branch: $BRANCH"
echo "🌍 Environment: $ENVIRONMENT"

# Pull latest code
echo "📥 Pulling latest code..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.yml build

# Stop old services
echo "⏹️ Stopping old services..."
docker-compose down || true

# Start new services
echo "▶️ Starting services..."
docker-compose up -d

# Wait for services
echo "⏳ Waiting for services..."
sleep 15

# Run migrations
echo "🗄️ Running migrations..."
docker-compose exec -T backend npm run migration:run

# Run health checks
echo "🏥 Running health checks..."
echo "Checking backend..."
curl -f http://localhost:3000/api/health || echo "⚠️ Backend health check failed"

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 Status:"
docker-compose ps
echo ""
echo "📋 Logs:"
echo "   Backend: docker-compose logs -f backend"
echo "   Frontend: docker-compose logs -f frontend"
echo "   Database: docker-compose logs -f postgres"
echo ""
