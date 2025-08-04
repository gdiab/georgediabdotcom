#!/bin/bash

# Reset Local Database Script
# This script completely resets the local database

set -e

# Safety check: Ensure we're not in production
if [ "$NODE_ENV" = "production" ] || [ "$VERCEL_ENV" = "production" ]; then
    echo "❌ ERROR: Cannot reset database in production environment!"
    exit 1
fi

# Safety check: Ensure DATABASE_URL is local
if [[ ! "$DATABASE_URL" =~ localhost|127\.0\.0\.1|host\.docker\.internal ]]; then
    echo "❌ ERROR: DATABASE_URL doesn't appear to be local!"
    echo "   Current DATABASE_URL: ${DATABASE_URL}"
    echo "   This script can only reset local databases."
    exit 1
fi

# Safety check: Ensure we're using the local docker-compose database
if ! docker-compose ps | grep -q "georgediab-postgres"; then
    echo "❌ ERROR: Local PostgreSQL container not found!"
    echo "   This script only works with the local Docker Compose setup."
    exit 1
fi

echo "⚠️  This will completely reset your LOCAL database!"
echo "   All data will be lost."
echo "   Database: postgresql://postgres:localpassword@localhost:5432/georgediab_dev"
read -p "Are you sure? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo "🔄 Resetting local database..."

# Stop containers
echo "🛑 Stopping containers..."
docker-compose down

# Remove volume
echo "🗑️  Removing database volume..."
docker volume rm georgediab_postgres_data 2>/dev/null || true

# Start fresh
echo "🚀 Starting fresh database..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

# Run migrations
echo "🔄 Running database migrations..."
npm run db:push

# Seed the database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Database reset complete!"