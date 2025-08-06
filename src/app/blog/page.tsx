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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <h1 className="heading-xl mb-4">
          {search ? `Search Results for "${search}"` : 
           category ? `Posts in ${category.charAt(0).toUpperCase() + category.slice(1)}` : 
           'All Posts'}
        </h1>
        <p className="body-text-secondary text-lg">
          {search ? `Found ${total} result${total !== 1 ? 's' : ''}` :
           category ? `${total} post${total !== 1 ? 's' : ''} in this category` :
           `${total} published post${total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-12">
        <Suspense fallback={<div className="animate-pulse bg-gray-800 h-12 rounded-lg"></div>}>
          <SearchBar currentSearch={search} currentCategory={category} />
        </Suspense>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {posts.map((postData, index) => (
              <PostCard 
                key={postData.id}
                post={postData} 
                featured={index === 0 && page === 1} // First post on first page is featured
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
        <div className="text-center py-16">
          <div className="card max-w-lg mx-auto p-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="heading-lg mb-4">No posts found</h2>
            <p className="body-text-secondary mb-8">
              {search ? 'Try adjusting your search terms or browse all posts.' : 
               category ? 'No posts in this category yet.' :
               'Check back later for new content.'}
            </p>
            {(search || category) && (
              <Link
                href="/blog"
                className="btn btn-secondary inline-flex items-center space-x-2"
              >
                <span>View all posts</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Search Bar Component
function SearchBar({ currentSearch, currentCategory }: { currentSearch?: string; currentCategory?: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search Form */}
      <div className="flex-1 max-w-lg">
        <form action="/blog" method="get" className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search posts..."
            className="form-input pl-12 pr-20"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="submit"
              className="btn btn-ghost mr-2 text-sm"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Filter Tags / Clear */}
      <div className="flex items-center gap-3">
        {currentCategory && (
          <span className="badge">
            Category: {currentCategory}
          </span>
        )}
        {currentSearch && (
          <span className="badge">
            &quot;{currentSearch}&quot;
          </span>
        )}
        {(currentSearch || currentCategory) && (
          <Link
            href="/blog"
            className="link-secondary text-sm hover:text-gray-300 transition-colors"
          >
            Clear all
          </Link>
        )}
      </div>
    </div>
  );
}