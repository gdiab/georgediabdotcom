# AI-Powered Blog Platform - Technical Specification

## Architecture Overview
Serverless-first architecture on Vercel with Next.js 14 App Router, leveraging static generation for public pages and server actions for admin functionality.

## Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | Next.js 14 App Router | SSG for public pages, server actions for admin APIs |
| Styling | Tailwind + shadcn/ui | Fast theming, accessible components |
| Authentication | NextAuth (GitHub/Google) | Single-admin, easy OAuth setup |
| Database | Postgres on Vercel + Drizzle ORM | Edge-compatible, cost-effective for small sites |
| File Storage | Vercel Blob | Generated images and OG banners |
| Caching | Vercel KV (Redis) | Fast lookups for drafts and topic lists |
| Background Jobs | Vercel Cron → Serverless Functions | Daily content generation pipeline |
| AI Services | OpenAI GPT-4o, DALL·E 3 | Content and image generation |
| SEO | next-seo + automated sitemaps | Structured data, OG tags |
| Analytics | Vercel Analytics or Plausible | Privacy-first tracking |

## Data Model

```sql
-- Core Tables
topics(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  feed_url TEXT,
  manual_prompt TEXT,
  active BOOLEAN DEFAULT true
);

posts(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  body_md TEXT,
  summary TEXT,
  status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, PUBLISHED
  seo_json JSONB,
  hero_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

sources(
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  url TEXT,
  title VARCHAR(255)
);

users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(20) DEFAULT 'admin'
);
```

## Content Generation Pipeline

### 1. Topic Fetch
- **Input**: RSS feeds, Google News queries, manual prompts from `topics` table
- **Process**: Cron handler fetches 5-10 candidate URLs, filters duplicates using embeddings
- **Output**: Filtered URL list for content generation

### 2. Draft Writer
```javascript
system_prompt = "Write an 800-1200 word article for engineering-leadership blog..."
user_prompt = {url_summary | manual_topic}
```
- GPT-4o streams markdown content
- Secondary call extracts keywords for SEO metadata
- **Output**: Structured article with headline, TLDR, body, links

### 3. Image Creator
- DALL·E 3 generates images based on post outline:
  - Hero image: 1200×630px
  - Thumbnail: 512×512px
- **Storage**: Vercel Blob with CDN distribution

### 4. Persistence
- Store draft in Postgres with `status=DRAFT`
- Save image paths and metadata
- Link sources and SEO data

## API Design

### Public Routes
- `GET /` - Homepage with recent posts
- `GET /posts/[slug]` - Individual post page (SSG)
- `GET /about` - Static about page
- `GET /api/rss` - RSS feed
- `GET /sitemap.xml` - Auto-generated sitemap

### Admin Routes (Auth Required)
- `GET /dashboard` - Draft management interface
- `POST /api/posts/[id]/publish` - Publish draft
- `PUT /api/posts/[id]` - Update draft
- `POST /api/generate` - Manual content generation trigger
- `GET /api/posts/drafts` - List drafts

## Security Implementation

### Authentication & Authorization
- NextAuth with GitHub/Google OAuth
- Role-based access: `role=admin` required for all `/api/*` and `/dashboard/*`
- Session-based authentication with secure cookies

### Data Protection
- Environment variables for sensitive keys (OpenAI, database)
- CSP headers restricting image sources to Blob domain
- Input validation and sanitization on all endpoints

### Performance & Reliability
- Drizzle prepared queries with connection pooling
- Static pages served from Vercel Edge CDN
- Rate limiting on content generation endpoints

## Build & Deployment

### Development Roadmap (9 days)
| Phase | Scope | Effort |
|-------|-------|--------|
| 0 | Repo setup, Vercel project, CI/CD, linting | 0.5 day |
| 1 | Public pages (Home, Post) with SSG/ISR | 1 day |
| 2 | Auth + Admin shell | 1 day |
| 3 | Postgres schema, Drizzle migrations, CRUD | 0.5 day |
| 4 | Vercel Cron + Content generation functions | 1 day |
| 5 | Admin UI: draft list + TipTap editor + publish | 2 days |
| 6 | Image generation, Blob upload, OG rendering | 1 day |
| 7 | SEO integration, sitemaps, RSS, performance | 0.5 day |
| 8 | Security hardening, rate limits, env secrets | 0.5 day |
| 9 | UI polish, testing, documentation | 1 day |

### Performance Targets
- **Lighthouse Scores**: LCP < 1.4s, CLS < 0.1
- **Bundle Size**: < 100KB first load JS
- **Build Time**: < 2 minutes
- **Static Generation**: All public pages pre-rendered

## Configuration Files

### Environment Variables
```bash
# .env.example
OPENAI_API_KEY=sk-...
DATABASE_URL=postgres://...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### Vercel Configuration
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/generate-content",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## Testing Strategy
- **Unit Tests**: Vitest for content generation functions
- **Integration Tests**: API route testing with test database
- **E2E Tests**: Playwright for publish workflow
- **Performance**: Lighthouse CI in deployment pipeline

## Monitoring & Observability
- Vercel Analytics for performance metrics
- Error tracking via Vercel Functions logs
- Content generation success/failure rates
- Database query performance monitoring

## Handoff Deliverables
- Project README with setup instructions
- Environment variable documentation
- Database migration scripts
- API testing collection (.http files)
- AI prompt templates in `/prompts` directory
- Comprehensive test suite
- Deployment configuration

