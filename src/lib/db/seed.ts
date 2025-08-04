import { db } from './index';
import { users, posts, categories, tags, postCategories, postTags } from './schema';

/**
 * Sample seed data for the AI Blog Platform
 */

const sampleUsers = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    email: 'author@example.com', 
    name: 'Content Author',
    role: 'author' as const,
  },
  {
    email: 'viewer@example.com',
    name: 'Blog Reader',
    role: 'viewer' as const,
  },
];

const sampleCategories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest trends and insights in technology',
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Artificial Intelligence and Machine Learning developments',
  },
  {
    name: 'Web Development',
    slug: 'web-development', 
    description: 'Modern web development practices and frameworks',
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design principles and best practices',
  },
  {
    name: 'Productivity',
    slug: 'productivity',
    description: 'Tips and tools for improving productivity',
  },
];

const sampleTags = [
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'React', slug: 'react' },
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'AI', slug: 'ai' },
  { name: 'Machine Learning', slug: 'machine-learning' },
  { name: 'GPT', slug: 'gpt' },
  { name: 'OpenAI', slug: 'openai' },
  { name: 'Database', slug: 'database' },
  { name: 'PostgreSQL', slug: 'postgresql' },
  { name: 'Drizzle', slug: 'drizzle' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Tailwind CSS', slug: 'tailwind-css' },
  { name: 'API', slug: 'api' },
  { name: 'Performance', slug: 'performance' },
];

const samplePosts = [
  {
    title: 'Building Modern Web Applications with Next.js 14',
    slug: 'building-modern-web-apps-nextjs-14',
    content: `# Building Modern Web Applications with Next.js 14

Next.js 14 represents a significant leap forward in React-based web development, offering developers unprecedented performance optimizations and developer experience improvements.

## App Router: The Future of Routing

The new App Router introduces a more intuitive and powerful routing system that leverages React Server Components by default. This architectural shift enables:

- **Server-first rendering** for improved performance
- **Streaming and Suspense** for better user experience
- **Nested layouts** for complex application structures

## Performance Improvements

Next.js 14 brings substantial performance improvements:

- **Turbopack (alpha)** - Up to 700x faster than Webpack for local development
- **Server Actions** - Simplified server-side mutations
- **Partial Prerendering** - Combining static and dynamic content seamlessly

## Developer Experience

The developer experience continues to improve with:

- Enhanced TypeScript support with typed routes
- Improved error messages and debugging
- Better dev tools integration

## Conclusion

Next.js 14 solidifies its position as the go-to framework for production React applications, offering both cutting-edge features and rock-solid stability.`,
    excerpt: 'Explore the powerful features and improvements in Next.js 14, from the App Router to performance optimizations that make it the ideal choice for modern web development.',
    status: 'published' as const,
    aiGenerated: false,
    seoTitle: 'Next.js 14 Guide: Building Modern Web Applications',
    seoDescription: 'Learn how to build modern web applications with Next.js 14. Discover App Router, performance improvements, and developer experience enhancements.',
    viewCount: 0,
    publishedAt: new Date('2025-01-15'),
  },
  {
    title: 'The Future of AI-Powered Content Creation',
    slug: 'future-ai-powered-content-creation',
    content: `# The Future of AI-Powered Content Creation

Artificial Intelligence is revolutionizing how we create, edit, and distribute content across all digital platforms. From automated blog writing to personalized user experiences, AI is reshaping the content landscape.

## Current State of AI Content Tools

Today's AI content tools have evolved far beyond simple text generation:

### Text Generation
- **GPT-4 and beyond** - Natural language that rivals human writing
- **Specialized models** - Fine-tuned for specific industries and use cases
- **Multi-modal capabilities** - Combining text, images, and code

### Visual Content Creation
- **DALL·E 3** - High-quality image generation from text prompts
- **Midjourney** - Artistic and creative visual content
- **Video synthesis** - AI-generated video content and editing

## Impact on Content Strategy

AI is fundamentally changing content strategy:

1. **Personalization at scale** - Dynamic content for each user
2. **Real-time optimization** - Content that adapts based on performance
3. **Multilingual expansion** - Instant translation and localization
4. **SEO automation** - AI-optimized content for search engines

## Challenges and Considerations

While AI offers tremendous opportunities, it also presents challenges:

- **Quality control** - Ensuring AI-generated content meets standards
- **Brand voice consistency** - Maintaining authentic communication
- **Ethical considerations** - Transparency and disclosure requirements
- **Human oversight** - The continued need for human creativity and judgment

## The Road Ahead

The future of AI-powered content creation will likely include:

- **Collaborative AI** - Tools that work alongside human creators
- **Real-time content adaptation** - Dynamic content that responds to user behavior
- **Advanced personalization** - Content tailored to individual preferences and context
- **Integrated workflows** - Seamless AI integration across all content tools

## Conclusion

AI-powered content creation is not about replacing human creativity but augmenting it. The most successful content strategies will combine AI efficiency with human insight, creativity, and strategic thinking.`,
    excerpt: 'Discover how AI is transforming content creation, from automated writing to personalized experiences, and what the future holds for content creators.',
    status: 'published' as const,
    aiGenerated: true,
    seoTitle: 'AI Content Creation: Future Trends and Technologies',
    seoDescription: 'Explore the future of AI-powered content creation, including current tools, impact on strategy, and emerging trends in automated content.',
    viewCount: 0,
    publishedAt: new Date('2025-01-20'),
  },
  {
    title: 'Database Design Best Practices for Modern Applications',
    slug: 'database-design-best-practices-modern-apps',
    content: `# Database Design Best Practices for Modern Applications

Effective database design is the foundation of any successful application. With modern tools like Drizzle ORM and PostgreSQL, developers have powerful options for creating scalable, maintainable database architectures.

## Schema Design Principles

### 1. Normalization vs Denormalization

**Normalization benefits:**
- Eliminates data redundancy
- Ensures data consistency
- Reduces storage requirements

**When to denormalize:**
- Read-heavy applications
- Performance-critical queries
- Data warehouse scenarios

### 2. Choosing the Right Data Types

PostgreSQL offers rich data types:

\`\`\`sql
-- Use appropriate types for better performance
uuid PRIMARY KEY DEFAULT gen_random_uuid()
timestamp DEFAULT now()
jsonb for semi-structured data
text with constraints for enums
\`\`\`

## Modern ORM Patterns with Drizzle

Drizzle ORM provides type-safe database operations:

\`\`\`typescript
// Type-safe schema definition
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'author', 'viewer'] })
});

// Type-safe queries
const allUsers = await db.select().from(users);
\`\`\`

## Performance Optimization Strategies

### Indexing Strategy
- **B-tree indexes** for equality and range queries
- **GIN indexes** for JSONB and full-text search
- **Partial indexes** for filtered queries
- **Covering indexes** to avoid heap lookups

### Query Optimization
- Use EXPLAIN ANALYZE for query planning
- Optimize N+1 queries with proper joins
- Implement connection pooling
- Consider read replicas for scaling

## Relationship Patterns

### One-to-Many Relationships
\`\`\`typescript
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
\`\`\`

### Many-to-Many Relationships
\`\`\`typescript
// Junction table pattern
export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').references(() => posts.id),
  tagId: uuid('tag_id').references(() => tags.id),
});
\`\`\`

## Migration and Versioning

Best practices for database evolution:

1. **Always use migrations** for schema changes
2. **Test migrations** on production-like data
3. **Backward compatibility** during deployments
4. **Rollback strategies** for failed migrations

## Conclusion

Modern database design combines traditional principles with new tools and patterns. By leveraging type-safe ORMs like Drizzle and powerful databases like PostgreSQL, developers can create robust, scalable data architectures.`,
    excerpt: 'Learn essential database design principles for modern applications, including schema design, ORM patterns, and performance optimization strategies.',
    status: 'published' as const,
    aiGenerated: false,
    seoTitle: 'Database Design Best Practices: Modern Application Development',
    seoDescription: 'Master database design for modern apps with PostgreSQL and Drizzle ORM. Learn schema design, relationships, and performance optimization.',
    viewCount: 0,
    publishedAt: new Date('2025-01-25'),
  },
  {
    title: 'Getting Started with TypeScript in 2025',
    slug: 'getting-started-typescript-2025',
    content: `# Getting Started with TypeScript in 2025

TypeScript continues to evolve as the preferred choice for JavaScript development in 2025. With improved tooling, better performance, and enhanced developer experience, there's never been a better time to adopt TypeScript.

## Why TypeScript in 2025?

### Enhanced Type System
- **Template literal types** for better string manipulation
- **Conditional types** for advanced type logic
- **Utility types** for common transformations
- **const assertions** for immutable data structures

### Improved Developer Experience
- **Faster compilation** with incremental builds
- **Better error messages** with precise locations
- **Enhanced IntelliSense** across editors
- **Automatic imports** and refactoring tools

## Setting Up a Modern TypeScript Project

### Project Initialization
\`\`\`bash
npm create typescript-app my-project
cd my-project
npm install
\`\`\`

### Essential Configuration (tsconfig.json)
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true
  }
}
\`\`\`

## Core TypeScript Concepts

### Type Annotations and Inference
\`\`\`typescript
// Explicit type annotation
const message: string = "Hello, TypeScript!";

// Type inference (preferred when obvious)
const count = 42; // inferred as number
\`\`\`

### Interface vs Type Aliases
\`\`\`typescript
// Interface (preferred for object shapes)
interface User {
  id: string;
  name: string;
  email: string;
}

// Type alias (for unions, primitives, computed types)
type Status = 'pending' | 'completed' | 'failed';
type UserWithStatus = User & { status: Status };
\`\`\`

### Generic Types
\`\`\`typescript
// Generic function
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
\`\`\`

## Advanced Patterns

### Mapped Types
\`\`\`typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Custom mapped type
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};
\`\`\`

### Conditional Types
\`\`\`typescript
// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type StringArray = string[];
type ElementType = ArrayElement<StringArray>; // string
\`\`\`

## Integration with Modern Tools

### With React
\`\`\`typescript
interface Props {
  title: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ title, onClick }) => (
  <button onClick={onClick}>{title}</button>
);
\`\`\`

### With Node.js and Express
\`\`\`typescript
import express, { Request, Response } from 'express';

const app = express();

app.get('/users/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  // Type-safe parameter access
  res.json({ user: id });
});
\`\`\`

## Best Practices for 2025

1. **Enable strict mode** - Catch more errors at compile time
2. **Use type assertions sparingly** - Prefer type guards
3. **Leverage utility types** - Don't reinvent common patterns
4. **Document with JSDoc** - Enhance IDE experience
5. **Regular updates** - Stay current with TypeScript releases

## Conclusion

TypeScript in 2025 offers a mature, powerful type system that enhances JavaScript development. By following modern practices and leveraging the latest features, developers can build more reliable, maintainable applications.`,
    excerpt: 'Master TypeScript in 2025 with modern setup, advanced patterns, and best practices for building type-safe applications.',
    status: 'draft' as const,
    aiGenerated: false,
    seoTitle: 'TypeScript Tutorial 2025: Complete Guide for Developers',
    seoDescription: 'Learn TypeScript in 2025 with this comprehensive guide covering setup, core concepts, advanced patterns, and modern development practices.',
    viewCount: 0,
    publishedAt: null,
  },
];

/**
 * Seed the database with sample data
 */
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert users first
    console.log('Creating users...');
    const insertedUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`✅ Created ${insertedUsers.length} users`);

    // Insert categories
    console.log('Creating categories...');
    const insertedCategories = await db.insert(categories).values(sampleCategories).returning();
    console.log(`✅ Created ${insertedCategories.length} categories`);

    // Insert tags
    console.log('Creating tags...');
    const insertedTags = await db.insert(tags).values(sampleTags).returning();
    console.log(`✅ Created ${insertedTags.length} tags`);

    // Insert posts with author relationship
    console.log('Creating posts...');
    const adminUser = insertedUsers.find(u => u.role === 'admin');
    const authorUser = insertedUsers.find(u => u.role === 'author');
    
    if (!adminUser || !authorUser) {
      throw new Error('Admin or Author user not found');
    }

    const postsWithAuthors = samplePosts.map((post, index) => ({
      ...post,
      authorId: index % 2 === 0 ? adminUser.id : authorUser.id,
    }));

    const insertedPosts = await db.insert(posts).values(postsWithAuthors).returning();
    console.log(`✅ Created ${insertedPosts.length} posts`);

    // Create post-category relationships
    console.log('Creating post-category relationships...');
    const postCategoryRelations: any[] = [];
    
    // Assign categories to posts
    insertedPosts.forEach((post, index) => {
      const categoryIndex = index % insertedCategories.length;
      postCategoryRelations.push({
        postId: post.id,
        categoryId: insertedCategories[categoryIndex].id,
      });
    });

    await db.insert(postCategories).values(postCategoryRelations);
    console.log(`✅ Created ${postCategoryRelations.length} post-category relationships`);

    // Create post-tag relationships
    console.log('Creating post-tag relationships...');
    const postTagRelations: any[] = [];

    // Assign 2-4 tags per post
    insertedPosts.forEach((post, postIndex) => {
      const numTags = 2 + (postIndex % 3); // 2, 3, or 4 tags per post
      const startTagIndex = (postIndex * 3) % insertedTags.length;
      
      for (let i = 0; i < numTags; i++) {
        const tagIndex = (startTagIndex + i) % insertedTags.length;
        postTagRelations.push({
          postId: post.id,
          tagId: insertedTags[tagIndex].id,
        });
      }
    });

    await db.insert(postTags).values(postTagRelations);
    console.log(`✅ Created ${postTagRelations.length} post-tag relationships`);

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      users: insertedUsers.length,
      categories: insertedCategories.length,
      tags: insertedTags.length,
      posts: insertedPosts.length,
      postCategories: postCategoryRelations.length,
      postTags: postTagRelations.length,
    };
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...');
    
    // Delete in reverse dependency order
    await db.delete(postTags);
    await db.delete(postCategories);
    await db.delete(posts);
    await db.delete(tags);
    await db.delete(categories);
    await db.delete(users);
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Database clearing failed:', error);
    throw error;
  }
}

// Run seed when executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}