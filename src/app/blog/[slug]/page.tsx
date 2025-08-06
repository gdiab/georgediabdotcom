import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { postQueries } from '@/lib/db/queries';
import ShareButton from '@/components/ShareButton';

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
      slug: postData.slug,
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
    const description = post.seoDescription || post.excerpt || `Read ${post.title} by George Diab`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        authors: ['George Diab'],
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
      <article className="animate-fade-in">
        {/* Back Navigation */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </nav>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
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

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-6">
            
            <h1 className="heading-xl mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="body-text text-xl text-gray-300 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-b border-gray-700 pb-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              By {post.author?.name || 'George Diab'}
            </div>
            
            <div className="flex items-center text-blue-400">
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

        {/* Article Content */}
        <div className="prose max-w-none mb-16">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          ) : (
            <div className="card p-8 text-center">
              <p className="body-text-secondary italic">No content available.</p>
            </div>
          )}
        </div>

        {/* Categories and Tags */}
        {(post.categories.length > 0 || post.tags.length > 0) && (
          <div className="border-t border-gray-700 pt-8 mb-12">
            <div className="flex flex-col sm:flex-row gap-6">
              {post.categories.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-3">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => 
                      category && (
                        <Link
                          key={category.id}
                          href={`/blog?category=${category.slug}`}
                          className="badge hover:bg-blue-400 hover:text-gray-900 transition-colors"
                        >
                          {category.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
              
              {post.tags.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => 
                      tag && (
                        <Link
                          key={tag.id}
                          href={`/blog?tag=${tag.slug}`}
                          className="badge text-xs hover:bg-blue-400 hover:text-gray-900 transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share & Navigation */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="btn btn-secondary inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Posts
            </Link>

            {/* Share buttons */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">Share:</span>
              <ShareButton title={post.title} />
            </div>
          </div>
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