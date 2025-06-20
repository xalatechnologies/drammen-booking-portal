
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
  const [facilityTypes, setFacilityTypes] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // Fetch facility types from database
  useEffect(() => {
    const fetchFacilityTypes = async () => {
      try {
        console.log('SearchFilter - Fetching facility types from database');
        const { data, error } = await supabase
          .from('facilities')
          .select('type')
          .eq('status', 'active');
        
        if (error) {
          console.error('SearchFilter - Error fetching facility types:', error);
          return;
        }

        const uniqueTypes = [...new Set(data?.map(f => f.type) || [])];
        console.log('SearchFilter - Fetched facility types:', uniqueTypes);
        setFacilityTypes(uniqueTypes);
      } catch (error) {
        console.error('SearchFilter - Failed to fetch facility types:', error);
      }
    };

    fetchFacilityTypes();
  }, []);

  // Fetch areas from database
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        console.log('SearchFilter - Fetching areas from database');
        const { data, error } = await supabase
          .from('facilities')
          .select('area, address_city')
          .eq('status', 'active');
        
        if (error) {
          console.error('SearchFilter - Error fetching areas:', error);
          return;
        }

        const uniqueAreas = [...new Set(data?.map(f => f.area) || [])];
        console.log('SearchFilter - Fetched areas:', uniqueAreas);
        setAreas(uniqueAreas);
      } catch (error) {
        console.error('SearchFilter - Failed to fetch areas:', error);
      }
    };

    fetchAreas();
  }, []);

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
            <Select value={facilityType} onValueChange={setFacilityType}>
              <SelectTrigger className="h-14 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="flex items-center text-left">
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg type" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all" className="text-base">Alle typer</SelectItem>
                {facilityTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-base">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="flex-1">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-14 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="flex items-center text-left">
                  <MapPin className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg område" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all" className="text-base">Alle områder</SelectItem>
                {areas.map((area) => (
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

          {/* Accessibility */}
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
