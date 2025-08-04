#!/bin/bash

# Local Development Setup Script
# This script sets up the local development environment

set -e

echo "🚀 Setting up local development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is installed but not running."
    echo ""
    echo "Please start Docker Desktop:"
    echo "  • On macOS: Open Docker from Applications or use: open -a Docker"
    echo "  • On Linux: Run: sudo systemctl start docker"
    echo "  • On Windows: Start Docker Desktop from Start Menu"
    echo ""
    echo "After Docker is running, run this script again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your actual credentials!"
fi

# Start PostgreSQL with Docker Compose
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

echo "✅ PostgreSQL is ready!"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:push

# Seed the database (optional)
echo "🌱 Seeding database..."
npm run db:seed

echo "✨ Local development environment is ready!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To view the database, you can use:"
echo "  npm run db:studio"
echo ""
echo "Database is accessible at:"
echo "  postgresql://postgres:localpassword@localhost:5432/georgediab_dev"