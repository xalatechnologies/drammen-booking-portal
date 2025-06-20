
import React, { useEffect, useRef, useState } from "react";
import { Loader2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacilityCard } from "./facility/FacilityCard";
import FacilityListItem from "./facility/FacilityListItem";
import { useOptimizedFacilities } from "@/hooks/useOptimizedFacilities";
import { FacilityFilters } from "@/types/facility";
import { useNavigate } from "react-router-dom";

interface InfiniteScrollFacilitiesProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
}

export function InfiniteScrollFacilities({
  filters,
  viewMode
}: InfiniteScrollFacilitiesProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allFacilities, setAllFacilities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const { facilities, pagination, isLoading, error } = useOptimizedFacilities({
    pagination: { page, limit: 6 },
    filters
  });

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setAllFacilities([]);
    setHasMore(true);
  }, [JSON.stringify(filters)]);

  // Add new facilities to the list
  useEffect(() => {
    if (facilities.length > 0) {
      if (page === 1) {
        setAllFacilities(facilities);
      } else {
        setAllFacilities(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(f => f.id));
          const newFacilities = facilities.filter(f => !existingIds.has(f.id));
          return [...prev, ...newFacilities];
        });
      }
      
      if (pagination) {
        setHasMore(pagination.hasNext);
      }
    }
  }, [facilities, page, pagination]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading) {
          console.log('Loading next page:', page + 1);
          setPage(prev => prev + 1);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      observer.disconnect();
    };
  }, [hasMore, isLoading, page]);

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle address click - navigate to map view with filters
  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    const searchParams = new URLSearchParams();
    if (filters.facilityType) searchParams.set('facilityType', filters.facilityType);
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.accessibility) searchParams.set('accessibility', filters.accessibility);
    if (filters.capacity && Array.isArray(filters.capacity)) {
      searchParams.set('capacity', filters.capacity.join(','));
    }
    if (filters.searchTerm) searchParams.set('searchTerm', filters.searchTerm);
    searchParams.set('viewMode', 'map');
    searchParams.set('focusFacility', facility.id.toString());
    
    navigate(`/?${searchParams.toString()}`);
  };

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-xl font-medium text-red-800 mb-2">Feil ved lasting</h3>
        <p className="text-red-600">Kunne ikke laste lokaler. Prøv igjen senere.</p>
      </div>
    );
  }

  if (page === 1 && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 font-medium">Laster lokaler...</p>
        </div>
      </div>
    );
  }

  if (allFacilities.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
        <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Results summary */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {pagination?.total || allFacilities.length} lokaler
          </Badge>
          {viewMode === "grid" && (
            <Badge variant="secondary" className="text-gray-600">
              Rutenett visning
            </Badge>
          )}
          {viewMode === "list" && (
            <Badge variant="secondary" className="text-gray-600">
              Liste visning
            </Badge>
          )}
        </div>
      </div>

      {/* Facilities content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
          {allFacilities.map((facility, index) => (
            <div 
              key={`${facility.id}-${index}`}
              className="animate-scale-in"
              style={{ animationDelay: `${(index % 6) * 50}ms` }}
            >
              <FacilityCard 
                facility={facility} 
                onAddressClick={handleAddressClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {allFacilities.map((facility, index) => (
            <div 
              key={`${facility.id}-${index}`}
              className="animate-fade-in"
              style={{ animationDelay: `${(index % 6) * 50}ms` }}
            >
              <FacilityListItem 
                facility={facility}
                facilityType={filters.facilityType}
                location={filters.location}
                accessibility={filters.accessibility}
                capacity={filters.capacity}
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && page > 1 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-700 font-medium">Laster flere lokaler...</span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && allFacilities.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600 font-medium">Du har sett alle tilgjengelige lokaler</span>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Infinite scroll trigger - This is the key element for intersection observer */}
      {hasMore && (
        <div 
          ref={observerRef} 
          className="h-10 flex items-center justify-center"
        >
          {/* Visual indicator when near end */}
          {!isLoading && (
            <div className="text-gray-400 text-sm">Laster flere...</div>
          )}
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 z-50"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
