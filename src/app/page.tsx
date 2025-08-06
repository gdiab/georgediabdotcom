import Link from 'next/link';
import { postQueries } from '@/lib/db/queries';
import PostCard from '@/components/PostCard';

export default async function HomePage() {
  // Fetch recent published posts
  const recentPostsData = await postQueries.getPublished(1, 6);
  const recentPosts = recentPostsData.posts;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="heading-xl mb-6">
          Engineering Leadership & Technology
        </h1>
        <p className="body-text text-xl max-w-3xl mx-auto mb-8">
          I write about engineering leadership, AI, software development, and building high-performing teams. 
          Exploring the intersection of technology and human potential.
        </p>
        <Link 
          href="/blog" 
          className="btn btn-primary inline-flex items-center space-x-2"
        >
          <span>View All Posts</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-lg">Latest Posts</h2>
            <Link 
              href="/blog" 
              className="link-primary text-sm font-medium hover:text-blue-300"
            >
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.slice(0, 3).map((postData) => (
              <PostCard
                key={postData.id}
                post={postData}
                featured={false}
              />
            ))}
          </div>
          
          {/* Additional posts in a simpler list format */}
          {recentPosts.length > 3 && (
            <div className="mt-12">
              <h3 className="heading-md mb-6">More Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.slice(3).map((postData) => {
                  const date = new Date(postData.post.publishedAt || postData.post.createdAt);
                  const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'short', 
                    day: 'numeric' 
                  });
                  
                  return (
                    <div key={postData.post.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex-1">
                        <Link
                          href={`/blog/${postData.post.slug}`}
                          className="link-primary hover:text-blue-300 font-medium"
                        >
                          {postData.post.title}
                        </Link>
                        {postData.post.excerpt && (
                          <p className="body-text-secondary text-sm mt-1 truncate-2">
                            {postData.post.excerpt}
                          </p>
                        )}
                      </div>
                      <time className="text-blue-400 text-sm font-medium ml-4 flex-shrink-0" dateTime={date.toISOString()}>
                        {formattedDate}
                      </time>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {recentPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto p-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="heading-md mb-2">No posts yet</h3>
            <p className="body-text-secondary">
              Check back soon for insights on engineering leadership and technology!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}