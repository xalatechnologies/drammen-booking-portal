
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange
}) => {
  const { page, totalPages, hasNext, hasPrev, total } = pagination;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const startItem = (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, total);

  return (
    <div className="flex flex-col items-center gap-4 mt-8 mb-8">
      {/* Results info */}
      <p className="text-sm text-gray-600">
        Viser {startItem}-{endItem} av {total} lokaler
      </p>

      {/* Only show pagination controls if more than 1 page */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrev}
            className={`
              h-10 w-10 flex items-center justify-center rounded-lg border transition-all duration-200
              ${!hasPrev 
                ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-white' 
                : 'text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
              }
            `}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {getVisiblePages().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                h-10 w-10 flex items-center justify-center text-sm font-medium transition-all duration-200 rounded-lg border
                ${page === pageNum
                  ? 'bg-black text-white border-black'
                  : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
                }
              `}
            >
              {pageNum}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext}
            className={`
              h-10 w-10 flex items-center justify-center rounded-lg border transition-all duration-200
              ${!hasNext 
                ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-white' 
                : 'text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
              }
            `}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
