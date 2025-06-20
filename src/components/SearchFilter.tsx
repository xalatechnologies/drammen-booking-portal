
import React from "react";
import { MapPin, Users, Building } from "lucide-react";
import { Label } from "@/components/ui/label";
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
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Single filter row - equally distributed */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Facility type */}
          <div className="flex-1">
            <Label className="text-xl font-semibold text-gray-900 mb-4 block">
              Type lokale
            </Label>
            <Select value={facilityType} onValueChange={setFacilityType}>
              <SelectTrigger className="h-16 w-full border-gray-300 hover:border-blue-500 text-xl rounded-xl">
                <Building className="mr-3 h-6 w-6" />
                <SelectValue placeholder="Velg type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xl">Alle typer</SelectItem>
                <SelectItem value="gymnasium" className="text-xl">Gymnasium</SelectItem>
                <SelectItem value="meeting-room" className="text-xl">Møterom</SelectItem>
                <SelectItem value="auditorium" className="text-xl">Auditorium</SelectItem>
                <SelectItem value="sports-field" className="text-xl">Sportsbane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="flex-1">
            <Label className="text-xl font-semibold text-gray-900 mb-4 block">
              Område
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-16 w-full border-gray-300 hover:border-blue-500 text-xl rounded-xl">
                <MapPin className="mr-3 h-6 w-6" />
                <SelectValue placeholder="Velg område" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xl">Alle områder</SelectItem>
                <SelectItem value="halleren" className="text-xl">Halleren</SelectItem>
                <SelectItem value="city" className="text-xl">Sentrum</SelectItem>
                <SelectItem value="plant" className="text-xl">Planten</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="flex-1">
            <Label className="text-xl font-semibold text-gray-900 mb-4 block">
              Kapasitet
            </Label>
            <Select value={getCapacityValue()} onValueChange={handleCapacityChange}>
              <SelectTrigger className="h-16 w-full border-gray-300 hover:border-blue-500 text-xl rounded-xl">
                <Users className="mr-3 h-6 w-6" />
                <SelectValue placeholder="Velg kapasitet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xl">Alle størrelser</SelectItem>
                <SelectItem value="small" className="text-xl">Liten (1-20 personer)</SelectItem>
                <SelectItem value="medium" className="text-xl">Middels (21-50 personer)</SelectItem>
                <SelectItem value="large" className="text-xl">Stor (51-100 personer)</SelectItem>
                <SelectItem value="extra-large" className="text-xl">Ekstra stor (100+ personer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility */}
          <div className="flex-1">
            <Label className="text-xl font-semibold text-gray-900 mb-4 block">
              Tilgjengelighet
            </Label>
            <Select value={accessibility} onValueChange={setAccessibility}>
              <SelectTrigger className="h-16 w-full border-gray-300 hover:border-blue-500 text-xl rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-3 h-6 w-6"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <SelectValue placeholder="Velg tilgjengelighet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xl">Alle</SelectItem>
                <SelectItem value="wheelchair" className="text-xl">Rullestoltilpasset</SelectItem>
                <SelectItem value="hearing-loop" className="text-xl">Teleslynge</SelectItem>
                <SelectItem value="visual-aids" className="text-xl">Synshjelpemidler</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
