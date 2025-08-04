-- Initialize database for local development
-- This script runs automatically when Docker Compose starts

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant all privileges to the postgres user
GRANT ALL PRIVILEGES ON DATABASE georgediab_dev TO postgres;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
SET search_path TO public;

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Database georgediab_dev initialized successfully';
END $$;