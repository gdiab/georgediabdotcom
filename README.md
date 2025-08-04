# AI-Powered Blog Platform

> 🚧 **Under Development** - Phase 7.5 In Progress (Design System Implementation)

An intelligent blog platform that leverages AI to automate content creation, enhance writing, and provide a modern blogging experience.

## 🎯 Project Vision

This platform combines the power of AI with modern web technologies to create a next-generation blogging experience that can:
- Generate high-quality blog content automatically
- Assist writers with AI-powered editing and suggestions
- Create compelling images using DALL·E 3
- Optimize content for SEO automatically
- Provide a beautiful, responsive reading experience

## 🛠️ Technology Stack

### Frontend & Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

### Backend & Database
- **PostgreSQL** as primary database
- **Drizzle ORM** for database operations
- **NextAuth.js** for authentication
- **Vercel** for hosting and serverless functions

### AI & Content
- **OpenAI GPT-4** for content generation
- **DALL·E 3** for image generation
- **TipTap** rich text editor
- **Vercel Blob** for media storage

## 🚀 Current Development Status

**Phase 1: Project Initialization** (COMPLETE ✅)
- [x] Project documentation created
- [x] Next.js 14 setup with App Router
- [x] TypeScript and Tailwind CSS configuration
- [x] Development tooling setup (ESLint, build scripts)
- [x] Responsive homepage with modern design
- [x] Production build optimization verified

**Phase 2: Infrastructure Setup** (COMPLETE ✅)
- [x] Vercel deployment configuration
- [x] Environment variables setup (.env.example, .env.local)
- [x] PostgreSQL database connection with Drizzle ORM
- [x] Database schema design and migrations
- [x] CI/CD pipeline with GitHub Actions
- [x] Production-ready build process

**Phase 3: Database Foundation** (COMPLETE ✅)
- [x] Database seed data with sample blog content
- [x] Comprehensive query utilities and helpers
- [x] Database backup and restore procedures
- [x] Performance monitoring and health checks
- [x] Database management scripts and tools

**Phase 4: Authentication System** (COMPLETE ✅)
- [x] NextAuth.js with Google OAuth integration
- [x] Single-admin access restricted to george.diablo@gmail.com
- [x] Protected routes via middleware for admin areas
- [x] Database integration with user authentication
- [x] Error handling and session management

**Phase 5: Public Blog Interface** (COMPLETE ✅)
- [x] Responsive homepage with hero section and recent posts
- [x] Blog listing page with pagination and search functionality
- [x] Article pages with Static Site Generation (SSG)
- [x] Site navigation header and footer components
- [x] Performance optimization and comprehensive SEO meta tags
- [x] About page with personal information and social links
- [x] Custom typography and responsive design system
- [x] Sitemap.xml and robots.txt for search engine optimization

**Phase 6: Admin Dashboard** (COMPLETE ✅)
- [x] Admin dashboard with protected routes
- [x] Blog post CRUD operations
- [x] TipTap rich text editor with code highlighting
- [x] Post metadata management (SEO, tags, featured)
- [x] Dynamic slug generation from titles
- [x] Responsive admin interface with Tailwind CSS

**Phase 7: Local Development Setup** (COMPLETE ✅)
- [x] Docker Compose for local PostgreSQL
- [x] Vercel CLI configuration
- [x] Environment variables documentation
- [x] Database setup scripts with safety checks
- [x] Development-specific npm scripts
- [x] Comprehensive local setup instructions

**Phase 7.5: Design System Implementation** (IN PROGRESS 🎨)
- [ ] Dark mode with monochrome palette
- [ ] Left-aligned layout with fixed sidebar
- [ ] Yanone Kaffeesatz font integration
- [ ] Minimal, high-contrast design system
- [ ] Responsive sidebar navigation
- [ ] Apply theme to admin dashboard

**Technical Stack Implemented:**
- ✅ Next.js 14.2.31 with App Router and typed routes
- ✅ TypeScript 5.8.3 with strict type checking
- ✅ Tailwind CSS 4.1.11 with modern PostCSS configuration
- ✅ ESLint 8.57.1 with Next.js best practices
- ✅ Drizzle ORM 0.35.0 with PostgreSQL database
- ✅ NextAuth.js 4.24.10 for authentication
- ✅ TipTap 3.0.9 rich text editor with syntax highlighting
- ✅ Vercel deployment configuration with security headers
- ✅ GitHub Actions CI/CD pipeline
- ✅ Docker Compose for local development
- ✅ Proper project structure following Next.js conventions

See [docs/PLAN.md](./docs/PLAN.md) for the complete development roadmap.

## 📚 Documentation

- [Product Requirements Document](./docs/PRD.md) - Feature specifications and requirements
- [Technical Specification](./docs/TECH-SPEC.md) - Architecture and implementation details  
- [Development Plan](./docs/PLAN.md) - Phase-by-phase development roadmap

## 🔧 Development

This project is currently in early development. Check back soon for setup instructions and contribution guidelines.

## 📄 License

This project is private and proprietary.

## 🛠️ Setup & Development

### Quick Start (Local Development)

1. **Prerequisites**
   - Node.js 18+ and npm
   - Docker Desktop installed and running
   - Google OAuth credentials (for authentication)

2. **Automated Setup**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd georgediabdotcom

   # Run the automated setup script
   npm run setup:local
   ```

   This script will:
   - Create `.env.local` from the example file
   - Start PostgreSQL in Docker
   - Install dependencies
   - Run database migrations
   - Seed sample data

3. **Manual Setup**
   ```bash
   # Copy environment variables
   cp .env.local.example .env.local
   
   # Edit .env.local with your credentials
   # - Add your Google OAuth credentials
   # - Generate NEXTAUTH_SECRET: openssl rand -base64 32
   
   # Start PostgreSQL
   npm run docker:up
   
   # Install dependencies
   npm install
   
   # Push database schema
   npm run db:push
   
   # Seed sample data (optional)
   npm run db:seed
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/dashboard (requires authentication)
   - Database Studio: `npm run db:studio`

### Environment Variables

Create `.env.local` with the following variables:

```env
# Database (local Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:localpassword@localhost:5432/georgediab_dev"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Database Management

**Docker Commands:**
- Start PostgreSQL: `npm run docker:up`
- Stop PostgreSQL: `npm run docker:down`
- View logs: `npm run docker:logs`

**Schema & Migrations:**
- Generate migrations: `npm run db:generate`
- Run migrations: `npm run db:migrate`
- Push schema (dev): `npm run db:push`
- Open Drizzle Studio: `npm run db:studio`
- Full setup: `node scripts/db-setup.js setup`

**Data Management:**
- Seed sample data: `npm run db:seed`
- Clear all data: `npm run db:clear`
- Test connection: `npm run db:test`
- Reset local database: `npm run db:reset:local` (⚠️ local only)

**Monitoring & Health:**
- Check health: `npm run db:health`
- View metrics: `npm run db:metrics`
- Watch real-time: `npm run db:watch`

**Backup & Restore:**
- Create backup: `npm run db:backup`
- List backups: `npm run db:list-backups`
- Restore backup: `npm run db:restore <backup-file>`

### Development Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run setup:local` - Complete local setup
- `npm run vercel:env:pull` - Pull environment variables from Vercel

---

### Troubleshooting

**Docker Not Running:**
```bash
# macOS: Start Docker Desktop
open -a Docker

# Wait for Docker to start, then run setup again
npm run setup:local
```

**Alternative Setup Without Docker:**
See [docs/LOCAL_SETUP_ALTERNATIVES.md](./docs/LOCAL_SETUP_ALTERNATIVES.md) for options including:
- Using existing PostgreSQL installation
- PostgreSQL.app (macOS)
- Homebrew PostgreSQL
- Vercel Postgres (cloud)

**Docker Issues:**
- Ensure Docker Desktop is running before starting PostgreSQL
- If port 5432 is in use, stop other PostgreSQL instances
- Use `docker-compose logs postgres` to check container logs

**Database Connection:**
- Verify DATABASE_URL in `.env.local` matches Docker configuration
- Default connection: `postgresql://postgres:localpassword@localhost:5432/georgediab_dev`
- Test connection: `npm run db:test`

**Authentication:**
- Google OAuth requires valid client ID and secret
- Callback URL must be added in Google Console: `http://localhost:3000/api/auth/callback/google`
- Only george.diablo@gmail.com has admin access

---

**Last Updated:** 2025-08-02 | **Current Phase:** Phase 7 - Local Development Setup 🚧