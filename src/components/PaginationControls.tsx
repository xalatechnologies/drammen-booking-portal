
import React, { useState } from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
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
    const delta = 2;

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis-start');
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-8 mb-8">
      <div className="flex items-center gap-1">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(page - 1)}
                className={`
                  h-10 w-10 p-0 flex items-center justify-center transition-all duration-200
                  ${page === 1 
                    ? 'pointer-events-none opacity-30 text-gray-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationPrevious>
            </PaginationItem>

            {getVisiblePages().map((pageNum, index) => {
              if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-gray-400 h-10 w-10 flex items-center justify-center" />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum as number)}
                    isActive={page === pageNum}
                    className={`
                      h-10 w-10 flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer border
                      ${page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(page + 1)}
                className={`
                  h-10 w-10 p-0 flex items-center justify-center transition-all duration-200
                  ${page === totalPages 
                    ? 'pointer-events-none opacity-30 text-gray-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Results info */}
        <div className="text-sm text-gray-500 ml-4">
          Side {page} av {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
