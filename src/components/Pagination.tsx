import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: { [key: string]: string | undefined };
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add existing search params (except page)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        params.set(key, value);
      }
    });
    
    // Add page if not the first page
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers at most
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="Pagination">
      {/* Previous Page Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="holman-link relative inline-flex items-center px-4 py-2 text-sm font-medium text-[#b0b0b0] border border-[#333333] rounded-md hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Link>
      ) : (
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-[#666666] border border-[#333333] rounded-md cursor-not-allowed bg-[#0a0a0a]">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </span>
      )}

      {/* First page and ellipsis */}
      {pageNumbers[0] > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="holman-link relative inline-flex items-center px-3 py-2 text-sm font-medium text-[#b0b0b0] border border-[#333333] rounded-md hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]"
          >
            1
          </Link>
          {pageNumbers[0] > 2 && (
            <span className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-[#666666] border border-[#333333] rounded-md cursor-default bg-[#0a0a0a]">
              ...
            </span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        page === currentPage ? (
          <span
            key={page}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-[#0a0a0a] bg-[#f0f0f0] border border-[#f0f0f0] rounded-md cursor-default"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={createPageUrl(page)}
            className="holman-link relative inline-flex items-center px-3 py-2 text-sm font-medium text-[#b0b0b0] border border-[#333333] rounded-md hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]"
          >
            {page}
          </Link>
        )
      ))}

      {/* Last page and ellipsis */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-[#666666] border border-[#333333] rounded-md cursor-default bg-[#0a0a0a]">
              ...
            </span>
          )}
          <Link
            href={createPageUrl(totalPages)}
            className="holman-link relative inline-flex items-center px-3 py-2 text-sm font-medium text-[#b0b0b0] border border-[#333333] rounded-md hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Page Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="holman-link relative inline-flex items-center px-4 py-2 text-sm font-medium text-[#b0b0b0] border border-[#333333] rounded-md hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]"
        >
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-[#666666] border border-[#333333] rounded-md cursor-not-allowed bg-[#0a0a0a]">
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}