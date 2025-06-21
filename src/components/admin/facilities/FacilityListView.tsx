
import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFacilities } from "@/hooks/useFacilities";
import FacilityTable from "./FacilityTable";
import FacilityFilters from "./FacilityFilters";
import FacilityPagination from "./FacilityPagination";
import PageHeader from "@/components/admin/PageHeader";
import { Facility } from "@/types/facility";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect: (facilityId: number | undefined) => void;
}

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    searchTerm: "",
    facilityType: "",
    status: "",
    area: ""
  });

  // Fetch facilities with pagination
  const { 
    facilities, 
    isLoading, 
    error 
  } = useFacilities({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: filters.searchTerm,
    facilityType: filters.facilityType,
    status: filters.status,
    area: filters.area
  });

  // Get unique values for filter dropdowns
  const facilityTypes = useMemo(() => {
    if (!facilities?.data) return [];
    const types = [...new Set(facilities.data.map(f => f.type))];
    return types.filter(Boolean);
  }, [facilities?.data]);

  const areas = useMemo(() => {
    if (!facilities?.data) return [];
    const areaList = [...new Set(facilities.data.map(f => f.area))];
    return areaList.filter(Boolean);
  }, [facilities?.data]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  const handleViewFacility = useCallback((facility: Facility) => {
    onFacilitySelect(facility.id);
  }, [onFacilitySelect]);

  const handleEditFacility = useCallback((facility: Facility) => {
    onFacilitySelect(facility.id);
  }, [onFacilitySelect]);

  const handleCreateNew = useCallback(() => {
    onFacilitySelect(undefined);
  }, [onFacilitySelect]);

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-lg text-red-600">
          Feil ved lasting av fasiliteter: {error.message}
        </div>
      </div>
    );
  }

  const totalPages = facilities?.pagination ? Math.ceil(facilities.pagination.total / itemsPerPage) : 1;
  const totalItems = facilities?.pagination?.total || 0;

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader
        title="Fasiliteter"
        description="Administrer alle fasiliteter, inkludert sports-, kultur- og møtefasiliteter. Opprett nye, rediger eksisterende og overvåk status."
        actions={
          <Button size="lg" onClick={handleCreateNew} className="text-base px-6 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Ny facilitet
          </Button>
        }
      />

      <FacilityFilters
        onFiltersChange={handleFiltersChange}
        facilityTypes={facilityTypes}
        areas={areas}
      />

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Registrerte fasiliteter ({totalItems})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <FacilityTable
            facilities={facilities?.data || []}
            onEdit={handleEditFacility}
            onView={handleViewFacility}
            isLoading={isLoading}
          />
          
          {facilities?.data && facilities.data.length > 0 && (
            <FacilityPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
