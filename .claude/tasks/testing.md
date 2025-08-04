# Testing Guide

Comprehensive testing strategies for ensuring code quality and reliability.

## Testing Pyramid

### 1. Unit Tests (70%)
Fast, isolated tests for individual functions and components.

```typescript
// Example: Testing a utility function
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
  
  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });
  
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  
  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(1234.567)).toBe('$1,234.57');
  });
});
```

### 2. Integration Tests (20%)
Test interactions between multiple components or services.

```typescript
// Example: Testing API endpoint with database
import { describe, it, expect, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/posts/route';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';

describe('POST /api/posts', () => {
  beforeEach(async () => {
    // Clean database
    await db.delete(posts);
  });
  
  it('creates a new post', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Post',
        content: 'Test content',
        authorId: 'user-123',
      },
    });
    
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      title: 'Test Post',
      content: 'Test content',
    });
    
    // Verify in database
    const savedPost = await db.select().from(posts);
    expect(savedPost).toHaveLength(1);
  });
});
```

### 3. End-to-End Tests (10%)
Test complete user workflows.

```typescript
// Example: Playwright E2E test
import { test, expect } from '@playwright/test';

test.describe('Blog Post Creation', () => {
  test('user can create and publish a post', async ({ page }) => {
    // Login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to create post
    await page.goto('/dashboard/posts/new');
    
    // Fill form
    await page.fill('input[name="title"]', 'My E2E Test Post');
    await page.fill('textarea[name="content"]', 'This is test content');
    
    // Submit
    await page.click('button:has-text("Publish")');
    
    // Verify redirect and content
    await expect(page).toHaveURL(/\/posts\/.+/);
    await expect(page.locator('h1')).toContainText('My E2E Test Post');
  });
});
```

## React Component Testing

### Testing Library Setup
```typescript
// test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Component Tests
```tsx
// Example: Testing a React component
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCard } from '@/components/PostCard';

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    excerpt: 'Test excerpt',
    author: { name: 'John Doe' },
    createdAt: new Date('2024-01-01'),
  };
  
  it('renders post information', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<PostCard post={mockPost} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    
    expect(handleClick).toHaveBeenCalledWith(mockPost.id);
  });
  
  it('shows loading state', () => {
    render(<PostCard post={mockPost} isLoading />);
    
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
// Testing custom hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('decrements counter', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
});
```

## API Testing

### REST API Tests
```typescript
// Using supertest for Express/Next.js APIs
import request from 'supertest';
import { app } from '@/app';

describe('API /api/users', () => {
  describe('GET /api/users', () => {
    it('returns users list', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer token123')
        .expect(200);
      
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
    
    it('requires authentication', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });
  
  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const newUser = {
        email: 'new@example.com',
        name: 'New User',
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', 'Bearer admin-token')
        .expect(201);
      
      expect(response.body).toMatchObject(newUser);
      expect(response.body).toHaveProperty('id');
    });
    
    it('validates required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'invalid' })
        .set('Authorization', 'Bearer admin-token')
        .expect(400);
      
      expect(response.body).toHaveProperty('errors');
    });
  });
});
```

## Database Testing

### Test Database Setup
```typescript
// test/db-setup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

let container: StartedPostgreSqlContainer;
let db: ReturnType<typeof drizzle>;

export async function setupTestDb() {
  container = await new PostgreSqlContainer()
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_pass')
    .start();
  
  const connectionString = container.getConnectionUri();
  const sql = postgres(connectionString);
  db = drizzle(sql);
  
  // Run migrations
  await migrate(db, { migrationsFolder: './migrations' });
  
  return { db, container };
}

export async function teardownTestDb() {
  await container.stop();
}
```

### Database Test Patterns
```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDb, teardownTestDb } from './db-setup';

describe('User Repository', () => {
  let db;
  
  beforeAll(async () => {
    ({ db } = await setupTestDb());
  });
  
  afterAll(async () => {
    await teardownTestDb();
  });
  
  beforeEach(async () => {
    // Clean tables
    await db.delete(users);
  });
  
  it('creates a user', async () => {
    const user = await createUser(db, {
      email: 'test@example.com',
      name: 'Test User',
    });
    
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

## Mock Strategies

### Mocking External Services
```typescript
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('WeatherService', () => {
  it('fetches weather data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ temperature: 22, condition: 'sunny' }),
    });
    
    const weather = await getWeather('London');
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.weather.com/v1/weather?city=London'
    );
    expect(weather).toEqual({ temperature: 22, condition: 'sunny' });
  });
});

// Mock modules
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));
```

### Mocking Time
```typescript
import { vi } from 'vitest';

describe('Time-dependent tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('expires after 1 hour', () => {
    const token = createToken();
    expect(isTokenValid(token)).toBe(true);
    
    // Advance time by 1 hour
    vi.advanceTimersByTime(60 * 60 * 1000);
    
    expect(isTokenValid(token)).toBe(false);
  });
});
```

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Jest Configuration (Alternative)
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Testing Best Practices

### 1. Test Structure
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

### 2. Test Naming
- Use descriptive test names
- Follow pattern: "should [expected behavior] when [condition]"
- Group related tests with describe blocks

### 3. Test Independence
- Each test should be independent
- Use beforeEach/afterEach for setup/cleanup
- Avoid shared state between tests

### 4. Coverage Goals
- Aim for 80%+ coverage
- Focus on critical paths
- Don't test implementation details
- Test behavior, not internals

### 5. Performance
- Keep unit tests under 100ms
- Use test.concurrent for parallel execution
- Mock expensive operations
- Use test databases for integration tests