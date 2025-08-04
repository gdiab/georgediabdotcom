import { Suspense } from 'react';
import Link from 'next/link';
import { postQueries } from '@/lib/db/queries';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

interface BlogPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search;
  const category = searchParams.category;
  const postsPerPage = 9;

  // Fetch posts based on search/category filters
  let postsData;
  
  if (search) {
    postsData = await postQueries.search(search, page, postsPerPage);
  } else if (category) {
    postsData = await postQueries.getByCategory(category, page, postsPerPage);
  } else {
    postsData = await postQueries.getPublished(page, postsPerPage);
  }

  // Handle case where category doesn't exist
  if (!postsData) {
    postsData = await postQueries.getPublished(page, postsPerPage);
  }

  const { posts, total, totalPages } = postsData;

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="holman-h1">
          {search ? `Search Results for "${search}"` : 
           category ? `Posts in ${category.charAt(0).toUpperCase() + category.slice(1)}` : 
           'All Posts'}
        </h1>
        <p className="holman-p text-[#b0b0b0]">
          {search ? `Found ${total} result${total !== 1 ? 's' : ''}` :
           category ? `${total} post${total !== 1 ? 's' : ''} in this category` :
           `${total} published post${total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <Suspense fallback={<div className="animate-pulse bg-[#1a1a1a] h-12 rounded-lg"></div>}>
          <SearchBar currentSearch={search} currentCategory={category} />
        </Suspense>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((postData) => (
              <PostCard 
                key={postData.post.id}
                post={postData.post} 
                author={postData.author}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/blog"
              searchParams={searchParams}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="holman-h2">No posts found</h2>
          <p className="holman-p text-[#b0b0b0] mb-6">
            {search ? 'Try adjusting your search terms.' : 'Check back later for new content.'}
          </p>
          {(search || category) && (
            <Link
              href="/blog"
              className="holman-link"
            >
              View all posts
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Search Bar Component
function SearchBar({ currentSearch, currentCategory }: { currentSearch?: string; currentCategory?: string }) {
  return (
    <div className="max-w-md">
      <form action="/blog" method="get" className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Search posts..."
          className="block w-full pl-10 pr-3 py-3 border border-[#333333] rounded-lg leading-5 bg-[#1a1a1a] text-[#f0f0f0] placeholder-[#888888] focus:outline-none focus:placeholder-[#b0b0b0] focus:ring-1 focus:ring-[#4a9eff] focus:border-[#4a9eff]"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="submit"
            className="mr-3 text-[#888888] hover:text-[#f0f0f0] transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Clear filters */}
      {(currentSearch || currentCategory) && (
        <div className="text-center mt-4">
          <Link
            href="/blog"
            className="holman-link text-sm text-[#888888] hover:text-[#b0b0b0]"
          >
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}