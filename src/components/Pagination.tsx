// components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  resultsText?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, resultsText }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const showPages = isMobile ? 3 : 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 2) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - (isMobile ? 0 : 1));
      const end = Math.min(totalPages - 1, currentPage + (isMobile ? 0 : 1));

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 1) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
      <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {resultsText || `Page ${currentPage} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: 'white', color: '#101C50' }}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-xs sm:text-sm text-gray-500"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'text-white'
                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
              style={{
                fontFamily: 'Metropolis, sans-serif',
                backgroundColor: currentPage === page ? '#101C50' : 'white',
                color: currentPage === page ? 'white' : '#101C50',
              }}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#101C50', color: 'white' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
