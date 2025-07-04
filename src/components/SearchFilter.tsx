
import React, { useEffect, useState } from "react";
import { MapPin, Users, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface SearchFilterProps {
  date?: Date;
  setDate: (date?: Date) => void;
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  availableNow: boolean;
  setAvailableNow: (available: boolean) => void;
  hasEquipment: boolean;
  setHasEquipment: (hasEquipment: boolean) => void;
  hasParking: boolean;
  setHasParking: (hasParking: boolean) => void;
  hasWifi: boolean;
  setHasWifi: (hasWifi: boolean) => void;
  allowsPhotography: boolean;
  setAllowsPhotography: (allowsPhotography: boolean) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  facilityType,
  setFacilityType,
  location,
  setLocation,
  accessibility,
  setAccessibility,
  capacity,
  setCapacity
}) => {
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL available filter options (without applying current filters)
  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      console.log('SearchFilter - Fetching ALL available filter options');

      // Get ALL locations to extract complete option lists
      const { data, error } = await supabase
        .from('app_locations')
        .select('location_type, address')
        .eq('is_published', true);
      
      if (error) {
        console.error('SearchFilter - Error fetching filter options:', error);
        return;
      }

      // Extract unique values for each filter from ALL locations
      const types = [...new Set(data?.map(f => f.location_type).filter(Boolean) || [])];
      const areas = [...new Set(data?.map(f => f.address).filter(Boolean) || [])];

      console.log('SearchFilter - ALL available options:', { types, areas });

      setAvailableTypes(types);
      setAvailableAreas(areas);
    } catch (error) {
      console.error('SearchFilter - Failed to fetch filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch options only once on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []); // Removed dependencies to avoid re-fetching when filters change

  const handleCapacityChange = (value: string) => {
    console.log('SearchFilter - Capacity filter changed to:', value);
    switch (value) {
      case "small":
        setCapacity([0, 20]);
        break;
      case "medium":
        setCapacity([21, 50]);
        break;
      case "large":
        setCapacity([51, 100]);
        break;
      case "extra-large":
        setCapacity([101, 200]);
        break;
      default:
        setCapacity([0, 200]);
    }
  };

  const getCapacityValue = () => {
    const [min, max] = capacity;
    if (min === 0 && max === 20) return "small";
    if (min === 21 && max === 50) return "medium";
    if (min === 51 && max === 100) return "large";
    if (min === 101 && max === 200) return "extra-large";
    return "all";
  };

  return (
    <div className="bg-gradient-to-r from-slate-600/90 to-slate-700/90 backdrop-blur-sm w-full shadow-lg border-b border-slate-500/30 my-[22px] py-[8px]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Single filter row - equally distributed */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch w-full">
          {/* Facility type */}
          <div className="flex-1">
            <Select value={facilityType} onValueChange={setFacilityType} disabled={loading}>
              <SelectTrigger className="h-14 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="flex items-center text-left">
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg type" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all" className="text-base">Alle typer</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-base">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="flex-1">
            <Select value={location} onValueChange={setLocation} disabled={loading}>
              <SelectTrigger className="h-14 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="flex items-center text-left">
                  <MapPin className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg område" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all" className="text-base">Alle områder</SelectItem>
                {availableAreas.map((area) => (
                  <SelectItem key={area} value={area} className="text-base">{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="flex-1">
            <Select value={getCapacityValue()} onValueChange={handleCapacityChange}>
              <SelectTrigger className="h-14 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="flex items-center text-left">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg kapasitet" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all" className="text-base">Alle størrelser</SelectItem>
                <SelectItem value="small" className="text-base">Liten (1-20 personer)</SelectItem>
                <SelectItem value="medium" className="text-base">Middels (21-50 personer)</SelectItem>
                <SelectItem value="large" className="text-base">Stor (51-100 personer)</SelectItem>
                <SelectItem value="extra-large" className="text-base">Ekstra stor (100+ personer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility - simplified for now */}
          <div className="flex-1">
            <Select value={accessibility} onValueChange={setAccessibility}>
              <SelectTrigger className="h-14 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="flex items-center text-left">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-4 w-4">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <SelectValue placeholder="Velg tilgjengelighet" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all" className="text-base">Alle</SelectItem>
                <SelectItem value="wheelchair" className="text-base">Rullestoltilpasset</SelectItem>
                <SelectItem value="hearing-loop" className="text-base">Teleslynge</SelectItem>
                <SelectItem value="visual-aids" className="text-base">Synshjelpemidler</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
