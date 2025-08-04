import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { postQueries } from '@/lib/db/queries';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all published posts (SSG)
export async function generateStaticParams() {
  try {
    const { posts } = await postQueries.getPublished(1, 1000); // Get all published posts
    
    return posts.map((postData) => ({
      slug: postData.post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await postQueries.getBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt || `Read ${post.title} by ${post.author?.name || 'George Diab'}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        authors: post.author?.name ? [post.author.name] : ['George Diab'],
        images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post',
      description: 'Read the latest blog post by George Diab',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await postQueries.getBySlug(params.slug);
    
    if (!post || post.status !== 'published') {
      notFound();
    }

    // Increment view count
    await postQueries.incrementViews(post.id);

    const formatDate = (date: Date | null) => {
      if (!date) return 'Draft';
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    };

    const readingTime = calculateReadingTime(post.content || '');

    return (
      <article>
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-[#888888]">
            <li>
              <Link href="/" className="holman-link hover:text-[#b0b0b0]">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/blog" className="holman-link hover:text-[#b0b0b0]">
                Blog
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-[#f0f0f0] font-medium truncate">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-6">
            {post.aiGenerated && (
              <div className="inline-flex items-center bg-[#1a1a1a] text-[#f0f0f0] px-3 py-1 rounded-full text-sm font-medium mb-4 border border-[#333333]">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Generated
              </div>
            )}
            
            <h1 className="holman-h1">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="holman-p text-[#b0b0b0] text-xl">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#888888] border-b border-[#333333] pb-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              By {post.author?.name || 'George Diab'}
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.publishedAt)}
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </div>
            
            {post.viewCount && post.viewCount > 0 && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount.toLocaleString()} views
              </div>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12">
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg mb-12">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          ) : (
            <p className="text-[#b0b0b0] italic">No content available.</p>
          )}
        </div>

        {/* Categories and Tags */}
        {(post.categories.length > 0 || post.tags.length > 0) && (
          <div className="border-t border-[#333333] pt-8 mb-12">
            {post.categories.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#f0f0f0] uppercase tracking-wider mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => 
                    category && (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#1a1a1a] text-[#f0f0f0] hover:bg-[#333333] transition-colors border border-[#333333]"
                      >
                        {category.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
            
            {post.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#f0f0f0] uppercase tracking-wider mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => 
                    tag && (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#1a1a1a] text-[#b0b0b0] hover:bg-[#333333] transition-colors border border-[#333333]"
                      >
                        #{tag.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back to Blog */}
        <div className="border-t border-[#333333] pt-8">
          <Link
            href="/blog"
            className="holman-link inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to format content (basic markdown to HTML)
function formatContent(content: string): string {
  // This is a basic implementation. In a real app, you'd use a proper markdown parser
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}