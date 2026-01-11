import { PaginationProps } from "./types";
import { Button } from "../Button";

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewChange,
  loading = false,
}: PaginationProps) {
  const perPageOptions = [10, 20, 30, 50, 100];
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages && !loading && onPageChange) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === 1 || loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === totalPages || loading
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-2">
          {/*{onViewChange && (*/}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => onViewChange && onViewChange(e.target.value)}
              disabled={loading}
              className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {perPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {/*)}*/}
          <p className="text-sm text-gray-700">
            <span>{totalItems} Entries</span>
            <span className="ml-1">
              (Showing {startIndex + 1}-{endIndex} of {totalItems})
            </span>
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex gap-2 -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                currentPage === 1 || loading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => goToPage(number)}
                disabled={loading}
                aria-current={currentPage === number ? "page" : undefined}
                className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold ${
                  currentPage === number
                    ? "z-10 border-primary-100 bg-primary-50 text-primary"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {number}
              </button>
            ))}

            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              type="button"
              variant="primary"
              size="small"
              outline
            >
              Next Page
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
