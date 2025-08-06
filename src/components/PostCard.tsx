import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    viewCount: number | null;
    aiGenerated: boolean | null;
  };
  author: {
    id: string | null;
    name: string | null;
  } | null;
  featured?: boolean;
}

export default function PostCard({ post, author, featured = false }: PostCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Draft';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <article className="card card-clickable group animate-fade-in">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Cover Image */}
        {post.coverImage ? (
          <div className={`relative ${featured ? 'h-56' : 'h-48'} w-full overflow-hidden rounded-t-lg`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            />
            {post.aiGenerated && (
              <div className="absolute top-3 right-3">
                <span className="badge badge-primary text-xs">AI Generated</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`${featured ? 'h-56' : 'h-48'} w-full bg-gray-700 flex items-center justify-center rounded-t-lg border-b border-gray-600`}>
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v12H4V4zm16-2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM9 11l2 3 3-4 4 5H6l3-4z"/>
              </svg>
              <p className="text-gray-500 text-sm">No cover image</p>
            </div>
            {post.aiGenerated && (
              <div className="absolute top-3 right-3">
                <span className="badge badge-primary text-xs">AI Generated</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-${featured ? '8' : '6'}`}>
          {/* Date */}
          <div className="mb-3">
            <time className="text-blue-400 text-sm font-medium" dateTime={post.publishedAt?.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Title */}
          <h2 className={`${featured ? 'heading-lg mb-4' : 'heading-md mb-3'} group-hover:text-blue-400 transition-colors truncate-2`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className={`body-text-secondary ${featured ? 'text-base mb-6 truncate-3' : 'text-sm mb-4 truncate-2'}`}>
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              {author?.name && (
                <span>by {author.name}</span>
              )}
              {post.viewCount !== null && post.viewCount > 0 && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.viewCount}</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="text-xs">Read more</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}