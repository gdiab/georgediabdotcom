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
    <article className="border border-[#333333] rounded-lg overflow-hidden hover:border-[#4a4a4a] transition-colors duration-200">
      <Link href={`/blog/${post.slug}`}>
        <div className="block">
          {/* Cover Image */}
          {post.coverImage ? (
            <div className={`relative ${featured ? 'h-64' : 'h-48'} w-full`}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
              />
             
            </div>
          ) : (
            <div className={`${featured ? 'h-64' : 'h-48'} w-full bg-[#1a1a1a] flex items-center justify-center relative border-b border-[#333333]`}>
              <div className="text-center">
                <p className="text-[#888888] text-sm">No cover image</p>
              </div>
              
            </div>
          )}

          {/* Content */}
          <div className={`p-${featured ? '8' : '6'} bg-[#0a0a0a]`}>
            {/* Title */}
            <h2 className={`${featured ? 'text-2xl mb-4' : 'text-xl mb-3'} font-bold text-[#f0f0f0] line-clamp-2 hover:text-[#4a9eff] transition-colors`}>
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className={`text-[#b0b0b0] ${featured ? 'text-base mb-6 line-clamp-3' : 'text-sm mb-4 line-clamp-2'}`}>
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-[#888888]">
              <div className="flex items-center space-x-4">

                <span>{formatDate(post.publishedAt)}</span>
              </div>
              
              
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}