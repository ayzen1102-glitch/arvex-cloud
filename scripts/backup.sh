#!/bin/bash

# ARVEX CLOUD BACKUP SCRIPT
# Automated backup of database and uploads

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="arvex_backup_$TIMESTAMP"

echo "💾 ARVEX CLOUD BACKUP SCRIPT"
echo "====================================="
echo "📁 Backup directory: $BACKUP_DIR"
echo "📦 Backup name: $BACKUP_NAME"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "🗄️ Backing up PostgreSQL database..."
mkdir -p $BACKUP_DIR/$BACKUP_NAME
docker-compose exec -T postgres pg_dump -U arvex arvex_cloud | gzip > $BACKUP_DIR/$BACKUP_NAME/database.sql.gz
echo "✅ Database backed up"

# Backup uploads
echo "📁 Backing up uploads..."
if [ -d "uploads" ]; then
    tar -czf $BACKUP_DIR/$BACKUP_NAME/uploads.tar.gz uploads/
    echo "✅ Uploads backed up"
fi

# Backup configuration
echo "⚙️ Backing up configuration..."
cp .env $BACKUP_DIR/$BACKUP_NAME/.env.backup
echo "✅ Configuration backed up"

# Create backup info
echo "📝 Creating backup info..."
cat > $BACKUP_DIR/$BACKUP_NAME/backup.info << EOF
BACKUP_DATE: $(date)
BACKUP_NAME: $BACKUP_NAME
DATABASE: PostgreSQL (arvex_cloud)
CONTENT: Database, uploads, configuration
EOF

echo ""
echo "✅ Backup Complete!"
echo "📦 Backup location: $BACKUP_DIR/$BACKUP_NAME"
echo "💾 Files:"
ls -lh $BACKUP_DIR/$BACKUP_NAME/
echo ""
echo "🔒 To restore:"
echo "   gunzip < backup/database.sql.gz | docker-compose exec -T postgres psql -U arvex arvex_cloud"
echo ""
