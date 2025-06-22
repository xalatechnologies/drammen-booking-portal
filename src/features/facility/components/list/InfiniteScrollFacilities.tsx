import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useFacilities, useFacilitiesPagination } from "@/features/facility/hooks/useFacilities";
import { FacilityCard } from "../shared/FacilityCard";
import { FacilityListItem } from "../shared/FacilityListItem";
import { ViewHeader } from "./ViewHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/core/localization/hooks/useLocalization";
import { Search } from "lucide-react";
import { FacilityFilters } from "@/features/facility/types/facility";

/**
 * LoadingSpinner Component - Embedded in InfiniteScrollFacilities
 * 
 * Following Single Responsibility Principle by handling only the loading indicator display
 * This local implementation prevents dependency issues
 */
function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };
  
  return (
    <div
      className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * InfiniteScrollFacilities Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface InfiniteScrollFacilitiesProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
  setViewMode?: (mode: "grid" | "map" | "calendar" | "list") => void;
}

/**
 * InfiniteScrollFacilities Component
 * 
 * Responsible for loading and rendering facility data with infinite scroll functionality
 * Following Single Responsibility Principle by focusing only on data loading and rendering logic
 */
export function InfiniteScrollFacilities({
  filters,
  viewMode,
  setViewMode
}: InfiniteScrollFacilitiesProps) {
  const { translate } = useLocalization();
  const { pagination, nextPage, goToPage } = useFacilitiesPagination(1, 6);
  const [allFacilities, setAllFacilities] = useState<any[]>([]);

  // Memoize the filter string to detect changes
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  const { facilities, isLoading, pagination: paginationInfo } = useFacilities({
    pagination,
    filters,
  });

  // Reset when filters change - but only when we actually have a change
  useEffect(() => {
    setAllFacilities([]);
    if (pagination.page !== 1) {
      goToPage(1);
    }
  }, [filterString]); 

  // Handle facility data updates - separate effect without filter dependencies
  useEffect(() => {
    if (!isLoading && facilities && Array.isArray(facilities)) {
      // If it's the first page, replace all facilities; otherwise append
      if (pagination.page === 1) {
        setAllFacilities(facilities);
      } else {
        setAllFacilities(prev => {
          // Prevent duplicates by checking IDs
          const existingIds = new Set(prev.map(f => f.id));
          const newFacilities = facilities.filter(f => !existingIds.has(f.id));
          return [...prev, ...newFacilities];
        });
      }
    }
  }, [facilities, isLoading, pagination.page]);

  // Intersection observer callback
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLoading && paginationInfo.hasNextPage) {
      nextPage();
    }
  }, [isLoading, paginationInfo.hasNextPage, nextPage]);

  // Setup observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 400px 0px', // Load more items earlier
      threshold: 0.1,
    });
    
    const loader = document.getElementById('facility-scroll-loader');
    if (loader) observer.observe(loader);
    
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [handleObserver]);

  return (
    <div className="facility-infinite-scroll">
      <ViewHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalCount={paginationInfo.totalCount || 0}
        filterCount={Object.keys(filters).filter(k => 
          // @ts-ignore - We know these are valid filter keys
          filters[k] !== undefined && filters[k] !== '' && 
          // @ts-ignore
          (!Array.isArray(filters[k]) || filters[k].length > 0)
        ).length}
      />

      {/* Render grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFacilities.map((facility) => (
            <FacilityCard 
              key={facility.id} 
              facility={facility}
            />
          ))}
        </div>
      )}

      {/* Render list view */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {allFacilities.map((facility) => (
            <FacilityListItem 
              key={facility.id} 
              facility={facility}
            />
          ))}
        </div>
      )}

      {/* No results message */}
      {!isLoading && allFacilities.length === 0 && (
        <div className="my-16 text-center">
          <p className="text-lg text-gray-600">
            {translate('facility.noResults')}
          </p>
          <p className="text-gray-500 mt-2">
            {translate('facility.tryAdjustingFilters')}
          </p>
        </div>
      )}

      {/* Loading indicator */}
      <div 
        id="facility-scroll-loader" 
        className="flex justify-center py-8"
      >
        {isLoading && (
          <LoadingSpinner size="lg" />
        )}
      </div>
    </div>
  );
}
