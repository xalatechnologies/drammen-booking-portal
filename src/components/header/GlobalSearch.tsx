
import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslatedFacilities } from "@/hooks/useTranslatedFacilities";

export const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: response } = useTranslatedFacilities();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const facilities = response?.data || [];
  
  const filteredFacilities = facilities.filter((facility: any) =>
    facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search facilities..."
          className="pl-10 pr-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
          onKeyPress={handleKeyPress}
        />
      </div>

      {isOpen && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredFacilities.length > 0 ? (
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2 px-2">Facilities</h3>
              {filteredFacilities.slice(0, 5).map((facility: any) => (
                <Button
                  key={facility.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto hover:bg-gray-50"
                  onClick={() => {
                    console.log("Selected facility:", facility);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{facility.name}</div>
                      {facility.description && (
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {facility.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No facilities found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
