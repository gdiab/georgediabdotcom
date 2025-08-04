import Link from 'next/link';
import { postQueries } from '@/lib/db/queries';

export default async function HomePage() {
  // Fetch recent published posts
  const recentPostsData = await postQueries.getPublished(1, 20);
  const recentPosts = recentPostsData.posts;

  return (
    <div>
      {/* Minimal intro */}
      <div className="mb-16">
        <h1 className="holman-h1">Writing</h1>
        <p className="holman-p text-[#b0b0b0]">
          I write about engineering leadership, AI, software development, and building high-performing teams.
        </p>
      </div>

      {/* Posts organized by year - Zach Holman style */}
      {recentPosts.length > 0 && (
        <div>
          {(() => {
            const postsByYear = recentPosts.reduce((acc, postData) => {
              const year = new Date(postData.post.publishedAt || postData.post.createdAt).getFullYear();
              if (!acc[year]) acc[year] = [];
              acc[year].push(postData);
              return acc;
            }, {} as Record<number, typeof recentPosts>);

            return Object.entries(postsByYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, posts]) => (
                <div key={year} className="year-group">
                  <h2 className="year-header">{year}</h2>
                  <div>
                    {posts.map((postData) => {
                      const date = new Date(postData.post.publishedAt || postData.post.createdAt);
                      const monthDay = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      });
                      
                      return (
                        <div key={postData.post.id} className="post-item">
                          <time className="post-date" dateTime={date.toISOString()}>
                            {monthDay}
                          </time>
                          <Link
                            href={`/blog/${postData.post.slug}`}
                            className="post-title"
                          >
                            {postData.post.title}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
          })()}
        </div>
      )}

      {recentPosts.length === 0 && (
        <p className="text-[#888888] text-center py-12">
          No posts yet. Check back soon!
        </p>
      )}
    </div>
  );
}