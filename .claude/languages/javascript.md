# JavaScript/TypeScript Guidelines

## Detection Markers
- Files: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- Package managers: `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
- Config files: `tsconfig.json`, `.eslintrc*`, `.prettierrc*`, `biome.json`

## Linter and Code Style Compliance

**CRITICAL**: Always detect and strictly follow ALL project linters and formatters:
- Read all ESLint/Prettier/Biome configs
- Check for TypeScript compiler options
- Apply project-specific rules strictly
- Run linters before considering code complete

## Framework-Specific Patterns

### React
- Prefer functional components with hooks
- Use `React.memo` for expensive renders
- Implement error boundaries for fault tolerance
- Test with React Testing Library
- Follow project's state management choice (Context, Redux, Zustand)

### Next.js
- Use App Router patterns for Next.js 13+
- Implement proper data fetching (SSR, SSG, ISR)
- Optimize with next/image and next/font
- Configure middleware for auth/redirects
- Use Server Components where appropriate

### Node.js Backend
- Use native ES modules when possible
- Implement proper error handling middleware
- Structure with controllers/services/repositories
- Use dependency injection for testability
- Follow async/await patterns consistently

## Testing Frameworks
- **Jest/Vitest**: Unit and integration tests
- **React Testing Library**: Component testing
- **Cypress/Playwright**: E2E testing
- **Coverage**: Aim for meaningful coverage, not 100%

## Build Tools & Module Systems
- **Webpack**: Complex configurations, optimization
- **Vite**: Fast HMR, ESBuild for dev
- **Next.js**: Built-in optimizations
- **TypeScript**: Strict mode when available

## TypeScript Best Practices

### Type Safety
```typescript
// Use strict mode in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}

// Prefer interfaces over types for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions, intersections, and utilities
type Status = 'pending' | 'active' | 'inactive';
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

// Avoid any, use unknown for truly unknown types
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  if (typeof data === 'number') {
    return data * 2;
  }
  throw new Error('Unsupported data type');
}
```

### Generic Patterns
```typescript
// Flexible, reusable components
function useState<T>(initial: T): [T, (value: T) => void] {
  let state = initial;
  const setState = (value: T) => { state = value; };
  return [state, setState];
}

// Constrained generics
interface HasId {
  id: string | number;
}

function findById<T extends HasId>(items: T[], id: T['id']): T | undefined {
  return items.find(item => item.id === id);
}

// Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Advanced Types
```typescript
// Discriminated unions
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error('Division by zero') };
  }
  return { success: true, data: a / b };
}

// Template literal types
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIEndpoint = `/api/${string}`;

// Conditional types
type IsArray<T> = T extends any[] ? true : false;
type Flatten<T> = T extends Array<infer U> ? U : T;
```

### Error Handling
```typescript
// Custom error classes
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Type-safe error handling
function tryCatch<T, E = Error>(
  fn: () => T
): Result<T, E> {
  try {
    return { success: true, data: fn() };
  } catch (error) {
    return { success: false, error: error as E };
  }
}

// Async error handling
async function safeAsync<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### Utility Types
```typescript
// Common utility types to use
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type NonNullableKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// Branded types for extra safety
type UserId = string & { __brand: 'UserId' };
type PostId = string & { __brand: 'PostId' };

function getUserById(id: UserId) { /* ... */ }
// getUserById('123'); // Error!
getUserById('123' as UserId); // OK
```

## Code Quality Standards
- Always use TypeScript strict mode
- Prefer explicit types over inference for public APIs
- Use ESLint with TypeScript plugin
- Handle all possible cases in discriminated unions
- Avoid type assertions except when necessary
- Use const assertions for literal types
- Implement proper error boundaries
- Handle async errors with try/catch
- Use environment variables with type safety
- Follow immutability patterns where appropriate