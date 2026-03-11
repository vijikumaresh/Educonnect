#!/bin/bash

# Migrate data from old educonnect database to new educonnect_app database

echo "🔄 Migrating data from 'educonnect' to 'educonnect_app'..."
echo ""

# Export data from old database
echo "📦 Exporting data from old database..."
pg_dump -U pc3 -h localhost -d educonnect \
  --data-only \
  --inserts \
  -t users -t folders -t students \
  > /tmp/educonnect_backup.sql

if [ $? -eq 0 ]; then
  echo "✅ Data exported successfully"
else
  echo "❌ Failed to export data"
  exit 1
fi

echo ""
echo "📥 Importing data to new database..."

# Import to new database
psql -U pc3 -h localhost -d educonnect_app < /tmp/educonnect_backup.sql

if [ $? -eq 0 ]; then
  echo "✅ Data imported successfully"
else
  echo "❌ Failed to import data"
  exit 1
fi

echo ""
echo "🔍 Verifying migration..."
echo ""

# Verify data
psql -U pc3 -h localhost -d educonnect_app -c "
SELECT 'Users: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Folders: ' || COUNT(*) FROM folders
UNION ALL
SELECT 'Students: ' || COUNT(*) FROM students;
"

echo ""
echo "✅ Migration complete!"
echo ""
echo "Now restart your backend and refresh the browser!"






