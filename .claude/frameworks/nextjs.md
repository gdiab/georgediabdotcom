# Next.js Framework Guide

Comprehensive patterns and best practices for Next.js 14+ App Router.

## App Router Architecture

### File Structure
```
app/
├── (auth)/              # Route groups
│   ├── login/
│   └── register/
├── api/                 # API routes
│   └── posts/
│       └── route.ts
├── dashboard/
│   ├── layout.tsx       # Nested layouts
│   ├── page.tsx         # Page component
│   └── loading.tsx      # Loading UI
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── not-found.tsx        # 404 page
└── error.tsx           # Error boundary
```

### Server Components vs Client Components
```tsx
// Server Component (default)
// ✅ Can fetch data directly
// ✅ Can access backend resources
// ✅ Reduces client bundle size
// ❌ No browser APIs or event handlers

async function ServerComponent() {
  const data = await db.query('SELECT * FROM posts');
  return <PostList posts={data} />;
}

// Client Component
// ✅ Can use hooks, state, effects
// ✅ Can handle user interactions
// ❌ Larger bundle size
// ❌ No direct database access

'use client';

function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Data Fetching Patterns

#### Static Data (SSG)
```tsx
// Cached by default
async function Page() {
  const posts = await fetch('https://api.example.com/posts');
  return <PostList posts={posts} />;
}

// Force static
export const dynamic = 'force-static';
```

#### Dynamic Data (SSR)
```tsx
// Opt out of caching
async function Page() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'no-store'
  });
  return <PostList posts={posts} />;
}

// Or use dynamic functions
import { cookies, headers } from 'next/headers';

async function Page() {
  const cookieStore = cookies();
  const headersList = headers();
  // Now this page is dynamic
}
```

#### Incremental Static Regeneration (ISR)
```tsx
async function Page() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  return <PostList posts={posts} />;
}

// Or page-level
export const revalidate = 3600;
```

### Route Handlers (API Routes)
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  const posts = await db.select().from(postsTable);
  
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const result = await db.insert(postsTable).values(body);
  
  return NextResponse.json(result, { status: 201 });
}

// Dynamic route segments
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db.select().from(postsTable).where(eq(postsTable.id, params.id));
  
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(post);
}
```

### Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Layouts and Templates
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// Parallel routes
// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
  metrics,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  metrics: React.ReactNode;
}) {
  return (
    <>
      {children}
      {analytics}
      {metrics}
    </>
  );
}
```

### Loading and Error States
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Server Actions
```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  await db.insert(postsTable).values({ title, content });
  
  revalidatePath('/posts');
  redirect('/posts');
}

// Using in a form
export default function CreatePost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### Caching Strategies
```typescript
// Cache segments
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id: string) => {
    return await db.select().from(users).where(eq(users.id, id));
  },
  ['user-details'],
  {
    revalidate: 3600,
    tags: ['user'],
  }
);

// On-demand revalidation
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateUser(id: string, data: any) {
  await db.update(users).set(data).where(eq(users.id, id));
  
  // Revalidate specific paths
  revalidatePath('/users/[id]', 'page');
  
  // Or revalidate by tag
  revalidateTag('user');
}
```

### Metadata and SEO
```tsx
// Static metadata
export const metadata = {
  title: 'My Blog',
  description: 'A blog about web development',
  openGraph: {
    title: 'My Blog',
    description: 'A blog about web development',
    images: ['/og-image.png'],
  },
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

// Generate static params
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

### Image Optimization
```tsx
import Image from 'next/image';

// Local images
import heroImage from './hero.png';

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur" // Automatic for local images
  priority // Load immediately for LCP
/>

// Remote images
<Image
  src="https://example.com/image.jpg"
  alt="Remote"
  width={1200}
  height={600}
  placeholder="blur"
  blurDataURL={shimmer} // Custom blur placeholder
/>

// Responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  fill
  style={{ objectFit: 'cover' }}
/>
```

### Performance Best Practices
1. **Minimize Client Components**: Only use 'use client' when necessary
2. **Optimize Imports**: Use dynamic imports for heavy components
3. **Streaming**: Use Suspense boundaries for progressive rendering
4. **Prefetching**: Next.js automatically prefetches links in viewport
5. **Font Optimization**: Use next/font for optimal font loading
6. **Script Optimization**: Use next/script for third-party scripts

### Common Patterns
```tsx
// Authentication wrapper
export default function ProtectedRoute({ children }) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <>{children}</>;
}

// Infinite scroll with server components
async function PostList({ cursor }: { cursor?: string }) {
  const posts = await getPosts({ cursor, limit: 10 });
  
  return (
    <>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      {posts.length === 10 && (
        <LoadMore cursor={posts[posts.length - 1].id} />
      )}
    </>
  );
}
```