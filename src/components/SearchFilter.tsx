
import React from "react";
import { MapPin, Users, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  setCapacity,
}) => {
  const handleCapacityChange = (value: string) => {
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
    <div className="bg-slate-100 w-full">
      <div className="w-full px-4 py-3">
        {/* Single filter row - equally distributed */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch w-full">
          {/* Facility type */}
          <div className="flex-1">
            <Select value={facilityType} onValueChange={setFacilityType}>
              <SelectTrigger className="h-11 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg">
                <div className="flex items-center text-left">
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-base">Alle typer</SelectItem>
                <SelectItem value="gymnasium" className="text-base">Gymnasium</SelectItem>
                <SelectItem value="meeting-room" className="text-base">Møterom</SelectItem>
                <SelectItem value="auditorium" className="text-base">Auditorium</SelectItem>
                <SelectItem value="sports-field" className="text-base">Sportsbane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="flex-1">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-11 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg">
                <div className="flex items-center text-left">
                  <MapPin className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg område" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-base">Alle områder</SelectItem>
                <SelectItem value="halleren" className="text-base">Halleren</SelectItem>
                <SelectItem value="city" className="text-base">Sentrum</SelectItem>
                <SelectItem value="plant" className="text-base">Planten</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="flex-1">
            <Select value={getCapacityValue()} onValueChange={handleCapacityChange}>
              <SelectTrigger className="h-11 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg">
                <div className="flex items-center text-left">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Velg kapasitet" />
                </div>
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className="h-11 w-full border-gray-300 hover:border-blue-500 text-base rounded-lg">
                <div className="flex items-center text-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <SelectValue placeholder="Velg tilgjengelighet" />
                </div>
              </SelectTrigger>
              <SelectContent>
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
