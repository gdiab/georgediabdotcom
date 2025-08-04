# Drizzle ORM Guide

Best practices and patterns for Drizzle ORM with PostgreSQL and TypeScript.

## Schema Definition

### Basic Schema Setup
```typescript
// src/lib/db/schema.ts
import { pgTable, text, integer, timestamp, boolean, uuid, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  hashedPassword: text('hashed_password').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
  };
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content').notNull(),
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  metadata: jsonb('metadata').$type<PostMetadata>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    slugIdx: uniqueIndex('posts_slug_idx').on(table.slug),
    authorIdx: index('posts_author_idx').on(table.authorId),
    publishedIdx: index('posts_published_idx').on(table.published, table.createdAt),
  };
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

interface PostMetadata {
  keywords?: string[];
  description?: string;
  readTime?: number;
}
```

## Database Connection

### Connection Setup
```typescript
// src/lib/db/connection.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For migrations
export const migrationClient = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

// For queries
const queryClient = postgres(process.env.DATABASE_URL!, {
  max: process.env.NODE_ENV === 'production' ? 10 : 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

// Type-safe database client
export type Database = typeof db;
```

### Connection with Vercel Postgres
```typescript
// For Vercel Postgres
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const db = drizzle(sql, { schema });
```

## Query Patterns

### Basic Queries
```typescript
// Select queries
const allUsers = await db.select().from(users);

const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.emailVerified, true));

// With specific columns
const userEmails = await db
  .select({
    id: users.id,
    email: users.email,
  })
  .from(users);

// Insert
const newUser = await db
  .insert(users)
  .values({
    email: 'user@example.com',
    name: 'John Doe',
    hashedPassword: 'hashed',
  })
  .returning();

// Update
await db
  .update(users)
  .set({
    emailVerified: true,
    updatedAt: new Date(),
  })
  .where(eq(users.id, userId));

// Delete
await db
  .delete(posts)
  .where(eq(posts.id, postId));
```

### Advanced Queries
```typescript
import { eq, and, or, like, gte, sql, desc, asc } from 'drizzle-orm';

// Complex where clauses
const filteredPosts = await db
  .select()
  .from(posts)
  .where(
    and(
      eq(posts.published, true),
      or(
        like(posts.title, '%TypeScript%'),
        like(posts.content, '%TypeScript%')
      )
    )
  );

// Joins with relations
const postsWithAuthors = await db.query.posts.findMany({
  where: eq(posts.published, true),
  with: {
    author: {
      columns: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
  orderBy: [desc(posts.createdAt)],
  limit: 10,
});

// Left joins
const usersWithPostCount = await db
  .select({
    user: users,
    postCount: sql<number>`count(${posts.id})::int`,
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .groupBy(users.id);

// Subqueries
const authorsWithRecentPosts = await db
  .select()
  .from(users)
  .where(
    exists(
      db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.authorId, users.id),
            gte(posts.createdAt, sql`now() - interval '7 days'`)
          )
        )
    )
  );
```

### Transactions
```typescript
// Basic transaction
const result = await db.transaction(async (tx) => {
  const user = await tx
    .insert(users)
    .values(userData)
    .returning();

  await tx
    .insert(posts)
    .values({
      ...postData,
      authorId: user[0].id,
    });

  return user[0];
});

// With rollback
try {
  await db.transaction(async (tx) => {
    await tx.insert(users).values(userData);
    
    // Rollback on condition
    if (someCondition) {
      tx.rollback();
    }
    
    await tx.insert(posts).values(postData);
  });
} catch (error) {
  // Handle transaction failure
}

// Isolation levels
await db.transaction(async (tx) => {
  // Your queries
}, {
  isolationLevel: 'read committed',
  accessMode: 'read write',
  deferrable: true,
});
```

## Migrations

### Creating Migrations
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;

// Generate migration
// npm run drizzle-kit generate:pg

// Apply migrations
// npm run drizzle-kit push:pg
```

### Migration Runner
```typescript
// src/lib/db/migrate.ts
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, migrationClient } from './connection';

export async function runMigrations() {
  console.log('Running migrations...');
  
  await migrate(db, {
    migrationsFolder: './src/lib/db/migrations',
  });
  
  await migrationClient.end();
  
  console.log('Migrations completed');
}

// Run with: tsx src/lib/db/migrate.ts
```

## Best Practices

### Type Safety
```typescript
// Use Zod for runtime validation
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

export const selectUserSchema = createSelectSchema(users);

// Validate before insert
const validatedUser = insertUserSchema.parse(userData);
await db.insert(users).values(validatedUser);
```

### Query Builders
```typescript
// Reusable query builders
export const postsQuery = {
  published: () => db
    .select()
    .from(posts)
    .where(eq(posts.published, true)),
    
  byAuthor: (authorId: string) => db
    .select()
    .from(posts)
    .where(eq(posts.authorId, authorId)),
    
  withAuthor: () => db
    .select({
      post: posts,
      author: users,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id)),
};

// Usage
const publishedPosts = await postsQuery.published();
const userPosts = await postsQuery.byAuthor(userId);
```

### Performance Optimization
```typescript
// Prepared statements
const getUserById = db
  .select()
  .from(users)
  .where(eq(users.id, sql.placeholder('id')))
  .prepare('getUserById');

// Use prepared statement
const user = await getUserById.execute({ id: userId });

// Batch operations
const userIds = ['id1', 'id2', 'id3'];
const batchedUsers = await db
  .select()
  .from(users)
  .where(inArray(users.id, userIds));

// Connection pooling (already handled by postgres.js)
// Just ensure proper connection limits in production
```

### Error Handling
```typescript
import { PostgresError } from 'postgres';

try {
  await db.insert(users).values(userData);
} catch (error) {
  if (error instanceof PostgresError) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Email already exists');
    }
    if (error.code === '23503') { // Foreign key violation
      throw new Error('Referenced record not found');
    }
  }
  throw error;
}
```

## Common Patterns

### Soft Deletes
```typescript
// Add to schema
export const posts = pgTable('posts', {
  // ... other fields
  deletedAt: timestamp('deleted_at'),
});

// Soft delete function
export async function softDelete(id: string) {
  return db
    .update(posts)
    .set({ deletedAt: new Date() })
    .where(eq(posts.id, id));
}

// Query only non-deleted
export async function getActivePosts() {
  return db
    .select()
    .from(posts)
    .where(isNull(posts.deletedAt));
}
```

### Pagination
```typescript
export async function getPaginatedPosts(
  page: number = 1,
  pageSize: number = 10
) {
  const offset = (page - 1) * pageSize;
  
  const [posts, totalCount] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset(offset),
    
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.published, true))
      .then(res => res[0].count),
  ]);
  
  return {
    posts,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}
```