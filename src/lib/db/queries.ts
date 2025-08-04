import { eq, desc, asc, and, or, ilike, count, sql } from 'drizzle-orm';
import { db } from './index';
import { users, posts, categories, tags, postCategories, postTags } from './schema';

/**
 * Database query utilities and helpers
 */

// ============================================================================
// USER QUERIES
// ============================================================================

export const userQueries = {
  /**
   * Get user by ID
   */
  async getById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  },

  /**
   * Get all users with pagination
   */
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [result, totalResult] = await Promise.all([
      db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(users)
    ]);

    return {
      users: result,
      total: totalResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalResult[0].count / limit),
    };
  },

  /**
   * Create new user
   */
  async create(userData: typeof users.$inferInsert) {
    const result = await db
      .insert(users)
      .values(userData)
      .returning();
    return result[0];
  },

  /**
   * Update user
   */
  async update(id: string, userData: Partial<typeof users.$inferInsert>) {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  },
};

// ============================================================================
// POST QUERIES
// ============================================================================

export const postQueries = {
  /**
   * Get post by ID with full details
   */
  async getById(id: string) {
    const result = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id))
      .limit(1);

    if (!result[0]) return null;

    // Get categories and tags for the post
    const [postCats, postTagsData] = await Promise.all([
      db
        .select({ category: categories })
        .from(postCategories)
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, id)),
      db
        .select({ tag: tags })
        .from(postTags)
        .leftJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, id)),
    ]);

    return {
      ...result[0].post,
      author: result[0].author,
      categories: postCats.map(pc => pc.category).filter(Boolean),
      tags: postTagsData.map(pt => pt.tag).filter(Boolean),
    };
  },

  /**
   * Get post by slug
   */
  async getBySlug(slug: string) {
    const result = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!result[0]) return null;

    // Get categories and tags for the post
    const [postCats, postTagsData] = await Promise.all([
      db
        .select({ category: categories })
        .from(postCategories)
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, result[0].post.id)),
      db
        .select({ tag: tags })
        .from(postTags)
        .leftJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, result[0].post.id)),
    ]);

    return {
      ...result[0].post,
      author: result[0].author,
      categories: postCats.map(pc => pc.category).filter(Boolean),
      tags: postTagsData.map(pt => pt.tag).filter(Boolean),
    };
  },

  /**
   * Get all published posts with pagination
   */
  async getPublished(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [result, totalResult] = await Promise.all([
      db
        .select({
          post: posts,
          author: {
            id: users.id,
            name: users.name,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.status, 'published'))
        .orderBy(desc(posts.publishedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.status, 'published'))
    ]);

    return {
      posts: result,
      total: totalResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalResult[0].count / limit),
    };
  },

  /**
   * Get all posts (including drafts) with pagination
   */
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [result, totalResult] = await Promise.all([
      db
        .select({
          post: posts,
          author: {
            id: users.id,
            name: users.name,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(posts)
    ]);

    return {
      posts: result,
      total: totalResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalResult[0].count / limit),
    };
  },

  /**
   * Search posts by title and content
   */
  async search(query: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    
    const whereClause = and(
      eq(posts.status, 'published'),
      or(
        ilike(posts.title, searchPattern),
        ilike(posts.content, searchPattern),
        ilike(posts.excerpt, searchPattern)
      )
    );

    const [result, totalResult] = await Promise.all([
      db
        .select({
          post: posts,
          author: {
            id: users.id,
            name: users.name,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(whereClause)
        .orderBy(desc(posts.publishedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(posts)
        .where(whereClause)
    ]);

    return {
      posts: result,
      total: totalResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalResult[0].count / limit),
      query,
    };
  },

  /**
   * Get posts by category
   */
  async getByCategory(categorySlug: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (!categoryResult[0]) return null;

    const [result, totalResult] = await Promise.all([
      db
        .select({
          post: posts,
          author: {
            id: users.id,
            name: users.name,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .where(and(
          eq(posts.status, 'published'),
          eq(postCategories.categoryId, categoryResult[0].id)
        ))
        .orderBy(desc(posts.publishedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .where(and(
          eq(posts.status, 'published'),
          eq(postCategories.categoryId, categoryResult[0].id)
        ))
    ]);

    return {
      posts: result,
      category: categoryResult[0],
      total: totalResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalResult[0].count / limit),
    };
  },

  /**
   * Increment view count
   */
  async incrementViews(id: string) {
    const result = await db
      .update(posts)
      .set({ 
        viewCount: sql`${posts.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(posts.id, id))
      .returning({ viewCount: posts.viewCount });
    
    return result[0]?.viewCount || 0;
  },

  /**
   * Create new post
   */
  async create(postData: typeof posts.$inferInsert) {
    const result = await db
      .insert(posts)
      .values(postData)
      .returning();
    return result[0];
  },

  /**
   * Update post
   */
  async update(id: string, postData: Partial<typeof posts.$inferInsert>) {
    const result = await db
      .update(posts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return result[0] || null;
  },
};

// ============================================================================
// CATEGORY QUERIES
// ============================================================================

export const categoryQueries = {
  /**
   * Get all categories with post counts
   */
  async getAll() {
    const result = await db
      .select({
        category: categories,
        postCount: count(postCategories.postId),
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .leftJoin(posts, and(
        eq(postCategories.postId, posts.id),
        eq(posts.status, 'published')
      ))
      .groupBy(categories.id)
      .orderBy(asc(categories.name));

    return result;
  },

  /**
   * Get category by slug
   */
  async getBySlug(slug: string) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return result[0] || null;
  },

  /**
   * Create new category
   */
  async create(categoryData: typeof categories.$inferInsert) {
    const result = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    return result[0];
  },
};

// ============================================================================
// TAG QUERIES
// ============================================================================

export const tagQueries = {
  /**
   * Get all tags with post counts
   */
  async getAll() {
    const result = await db
      .select({
        tag: tags,
        postCount: count(postTags.postId),
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .leftJoin(posts, and(
        eq(postTags.postId, posts.id),
        eq(posts.status, 'published')
      ))
      .groupBy(tags.id)
      .orderBy(desc(count(postTags.postId)), asc(tags.name));

    return result;
  },

  /**
   * Get popular tags (most used)
   */
  async getPopular(limit = 10) {
    const result = await db
      .select({
        tag: tags,
        postCount: count(postTags.postId),
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .leftJoin(posts, and(
        eq(postTags.postId, posts.id),
        eq(posts.status, 'published')
      ))
      .groupBy(tags.id)
      .having(sql`count(${postTags.postId}) > 0`)
      .orderBy(desc(count(postTags.postId)))
      .limit(limit);

    return result;
  },

  /**
   * Create new tag
   */
  async create(tagData: typeof tags.$inferInsert) {
    const result = await db
      .insert(tags)
      .values(tagData)
      .returning();
    return result[0];
  },
};

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export const analyticsQueries = {
  /**
   * Get basic site statistics
   */
  async getSiteStats() {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      totalCategories,
      totalTags,
      totalViews,
    ] = await Promise.all([
      db.select({ count: count() }).from(posts),
      db.select({ count: count() }).from(posts).where(eq(posts.status, 'published')),
      db.select({ count: count() }).from(posts).where(eq(posts.status, 'draft')),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(categories),
      db.select({ count: count() }).from(tags),
      db.select({ totalViews: sql<number>`sum(${posts.viewCount})` }).from(posts),
    ]);

    return {
      totalPosts: totalPosts[0].count,
      publishedPosts: publishedPosts[0].count,
      draftPosts: draftPosts[0].count,
      totalUsers: totalUsers[0].count,
      totalCategories: totalCategories[0].count,
      totalTags: totalTags[0].count,
      totalViews: totalViews[0].totalViews || 0,
    };
  },

  /**
   * Get most viewed posts
   */
  async getMostViewed(limit = 5) {
    const result = await db
      .select({
        post: {
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          viewCount: posts.viewCount,
          publishedAt: posts.publishedAt,
        },
        author: {
          name: users.name,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.viewCount))
      .limit(limit);

    return result;
  },

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 5) {
    const result = await db
      .select({
        post: {
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          publishedAt: posts.publishedAt,
        },
        author: {
          name: users.name,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return result;
  },
};