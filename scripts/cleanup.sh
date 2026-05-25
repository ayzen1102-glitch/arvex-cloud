#!/bin/bash

# ARVEX CLOUD CLEANUP SCRIPT
# Remove old backups and logs

set -e

echo "🧹 ARVEX CLOUD CLEANUP SCRIPT"
echo "====================================="

DAYS_TO_KEEP=30

echo "🗑️ Removing backups older than $DAYS_TO_KEEP days..."
find backups -type d -mtime +$DAYS_TO_KEEP -exec rm -rf {} \; 2>/dev/null || true
echo "✅ Old backups removed"

echo "📋 Removing logs older than $DAYS_TO_KEEP days..."
find logs -type f -mtime +$DAYS_TO_KEEP -delete 2>/dev/null || true
echo "✅ Old logs removed"

echo "🐳 Removing Docker dangling images..."
docker image prune -f --filter "dangling=true" || true
echo "✅ Docker cleanup complete"

echo ""
echo "✅ Cleanup Complete!"
echo ""
