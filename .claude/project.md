# Project-Specific Configuration

This file contains overrides and specific rules for the georgediab.com blog project.

## Project Overview
- **Type**: Personal blog/portfolio site
- **Stack**: Next.js 14 (App Router), TypeScript, Drizzle ORM, PostgreSQL
- **Deployment**: Vercel
- **Database**: Vercel Postgres (production), Local PostgreSQL (development)

## Project Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities and configurations
│   ├── auth.ts      # NextAuth configuration
│   ├── db/          # Database schema and queries
│   │   ├── schema.ts
│   │   ├── queries.ts
│   │   └── migrations/
│   └── utils.ts     # Utility functions
└── types/           # TypeScript type definitions
```

## Coding Standards

### File Naming
- React components: PascalCase (e.g., `PostCard.tsx`)
- Pages: lowercase with hyphens (e.g., `blog-post.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Database files: lowercase with hyphens (e.g., `db-connection.ts`)

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Local components
4. Local utilities
5. Types
6. Styles

Example:
```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { PostCard } from '@/components/PostCard';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';
```

## Database Conventions

### Schema Rules
- Use UUID for all primary keys
- Always include `createdAt` and `updatedAt` timestamps
- Use snake_case for column names
- Add appropriate indexes for foreign keys and commonly queried fields

### Query Patterns
- Always use parameterized queries
- Return consistent response shapes
- Handle errors at the query level
- Use transactions for multi-table operations

## API Conventions

### Route Naming
- RESTful conventions for API routes
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent error responses

### Response Format
```typescript
// Success response
{
  success: true,
  data: { ... }
}

// Error response
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human readable message'
  }
}
```

## Component Guidelines

### Server vs Client Components
- Default to Server Components
- Use Client Components only when needed (interactivity, hooks)
- Clearly mark boundaries with 'use client'

### Component Structure
```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Component definition
// 4. Helper functions (if any)
// 5. Exports

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  // Component logic
}
```

## Testing Requirements

### Test Coverage Goals
- Components: 80% coverage
- API routes: 90% coverage
- Utilities: 100% coverage
- Database queries: 85% coverage

### Test File Naming
- Component tests: `ComponentName.test.tsx`
- API tests: `route.test.ts`
- Utility tests: `utilityName.test.ts`

## Performance Requirements

### Core Web Vitals Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.8s

### Bundle Size Limits
- Main bundle: < 100KB (gzipped)
- Per-page bundles: < 50KB (gzipped)
- Total JavaScript: < 300KB (gzipped)

## Security Requirements

### Authentication
- Use NextAuth.js for authentication
- Implement CSRF protection
- Session timeout: 24 hours
- Secure cookie settings in production

### Data Protection
- Sanitize all user inputs
- Use prepared statements for all queries
- Implement rate limiting on API routes
- Hash passwords with bcrypt (minimum 12 rounds)

## Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# External Services (if needed)
VERCEL_URL=
```

### Environment-Specific Settings
- Development: Verbose logging, detailed errors
- Production: Minimal logging, generic error messages

## Git Workflow

### Branch Naming
- Features: `feature/description`
- Fixes: `fix/description`
- Refactors: `refactor/description`

### Commit Messages
Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## Deployment Checklist

Before deploying to production:
1. Run all tests
2. Check TypeScript compilation
3. Verify database migrations
4. Update environment variables
5. Test in preview deployment
6. Check bundle sizes
7. Verify SEO meta tags

## Monitoring

### Key Metrics to Track
- Page load times
- API response times
- Database query performance
- Error rates
- User engagement metrics

### Alerts
- API errors > 1% of requests
- Database connection failures
- Page load time > 3 seconds
- Memory usage > 80%

## Notes

This configuration is specific to the georgediab.com project and overrides any conflicting general guidelines. Always prioritize these rules when working on this project.