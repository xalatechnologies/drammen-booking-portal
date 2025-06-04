
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
      <div className="flex items-center gap-2">
        {/* Results info */}
        <div className="text-sm text-gray-600 mr-4">
          Side {page} av {totalPages}
        </div>

        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(page - 1)}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${page === 1 
                    ? 'pointer-events-none opacity-50 text-gray-400' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer'
                  }
                `}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Forrige</span>
              </PaginationPrevious>
            </PaginationItem>

            {getVisiblePages().map((pageNum, index) => {
              if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-gray-400" />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum as number)}
                    isActive={page === pageNum}
                    className={`
                      min-w-[40px] h-10 flex items-center justify-center text-sm font-medium transition-all cursor-pointer
                      ${page === pageNum
                        ? 'bg-[#0B3D91] text-white border-[#0B3D91] hover:bg-blue-700 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200'
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
                  flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${page === totalPages 
                    ? 'pointer-events-none opacity-50 text-gray-400' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer'
                  }
                `}
              >
                <span className="hidden sm:inline">Neste</span>
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationControls;
