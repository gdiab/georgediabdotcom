# Alternative Local Setup Options

If you're having issues with Docker, here are alternative ways to set up the project locally.

## Option 1: Use Existing PostgreSQL Installation

If you already have PostgreSQL installed locally:

1. **Create the database:**
   ```bash
   createdb georgediab_dev
   ```

2. **Update your .env.local:**
   ```env
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/georgediab_dev"
   ```

3. **Run the setup:**
   ```bash
   # Install dependencies
   npm install
   
   # Push database schema
   npm run db:push
   
   # Seed sample data (optional)
   npm run db:seed
   
   # Start development server
   npm run dev
   ```

## Option 2: Use PostgreSQL.app (macOS)

1. Download and install [Postgres.app](https://postgresapp.com/)
2. Start the PostgreSQL server
3. Create the database using the GUI or command line
4. Follow the same steps as Option 1

## Option 3: Use Homebrew (macOS)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb georgediab_dev

# Continue with setup from Option 1
```

## Option 4: Use Vercel Postgres (Online)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Link to your Vercel project:**
   ```bash
   vercel link
   ```

3. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```

4. **Use Vercel's development database:**
   - This requires an internet connection
   - Data persists in Vercel's cloud
   - Good for testing production-like environment

## Option 5: Use Supabase Local Development

1. Install [Supabase CLI](https://supabase.com/docs/guides/cli)
2. Initialize Supabase:
   ```bash
   supabase init
   supabase start
   ```
3. Update DATABASE_URL with the local Supabase connection string

## Troubleshooting Common Issues

### Port 5432 Already in Use
```bash
# Find what's using the port
lsof -i :5432

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Permission Denied Errors
- Ensure your PostgreSQL user has CREATE DATABASE permissions
- Check file permissions on the project directory

### Connection Refused
- Verify PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL format
- Ensure localhost is not being resolved to IPv6 (use 127.0.0.1 instead)

## Next Steps

Once you have PostgreSQL running (via any method above):

1. Copy `.env.local.example` to `.env.local`
2. Update the DATABASE_URL
3. Add your Google OAuth credentials
4. Run `npm install`
5. Run `npm run db:push`
6. Run `npm run dev`

The application will be available at http://localhost:3000