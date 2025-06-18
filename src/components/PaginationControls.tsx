
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage = 1,
  totalPages = 10,
  onPageChange = () => {}
}) => {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange(newPage);
    }
  };

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

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-1 mt-8 mb-8">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`
          h-10 w-10 flex items-center justify-center rounded-lg border transition-all duration-200
          ${page === 1 
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
          onClick={() => handlePageChange(pageNum)}
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
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`
          h-10 w-10 flex items-center justify-center rounded-lg border transition-all duration-200
          ${page === totalPages 
            ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-white' 
            : 'text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PaginationControls;
