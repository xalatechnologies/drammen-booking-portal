import React, { useEffect, useState } from 'react';
import { useFacility } from '../../hooks/useFacility';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Facility } from '../../types/facility';

interface FacilityListProps {
  facilityType?: string;
  showActiveOnly?: boolean;
  onFacilitySelect?: (facility: Facility) => void;
  className?: string;
}

export function FacilityList({
  facilityType,
  showActiveOnly = true,
  onFacilitySelect,
  className = ''
}: FacilityListProps) {
  // Use our custom hook that wraps the Zustand store
  const {
    items: facilities,
    isLoading,
    error,
    pagination,
    fetchList,
    getFacilitiesByType,
    getActiveFacilities,
    setSelectedItem
  } = useFacility();

  // Local state for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load facilities on component mount
  useEffect(() => {
    const loadFacilities = async () => {
      if (facilityType) {
        await getFacilitiesByType(facilityType);
      } else if (showActiveOnly) {
        await getActiveFacilities();
      } else {
        await fetchList();
      }
    };
    
    loadFacilities();
  }, [facilityType, showActiveOnly, getFacilitiesByType, getActiveFacilities, fetchList]);
  
  // Handle facility selection
  const handleFacilitySelect = (facility: Facility) => {
    setSelectedItem(facility);
    if (onFacilitySelect) {
      onFacilitySelect(facility);
    }
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search submit
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchList({
      filters: {
        name: searchTerm,
        ...(facilityType ? { facilityType } : {}),
        ...(showActiveOnly ? { status: 'active' } : {})
      }
    });
  };
  
  // Handle pagination
  const handlePageChange = async (newPage: number) => {
    await fetchList({
      pagination: {
        page: newPage,
        limit: pagination.limit
      },
      filters: {
        name: searchTerm,
        ...(facilityType ? { facilityType } : {}),
        ...(showActiveOnly ? { status: 'active' } : {})
      }
    });
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search facilities..."
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <Button type="submit">Search</Button>
      </form>
      
      {/* Loading and error states */}
      {isLoading && <div className="text-center py-4">Loading facilities...</div>}
      {error && <div className="text-red-500 py-2">{error}</div>}
      
      {/* Facilities list */}
      {!isLoading && facilities.length === 0 && (
        <div className="text-center py-4">No facilities found</div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden">
            {facility.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{facility.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{facility.address}, {facility.city}</p>
              <p className="text-sm mb-4">{facility.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  facility.status === 'active' ? 'bg-green-100 text-green-800' :
                  facility.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {facility.status}
                </span>
                <Button onClick={() => handleFacilitySelect(facility)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {facilities.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
