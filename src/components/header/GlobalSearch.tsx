
import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { facilityRepository } from "@/dal/repositories";
import { Facility } from "@/types/facility";

interface SearchResult {
  id: string;
  type: 'facility' | 'location' | 'category' | 'recent';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  url: string;
  image?: string;
  searchParams?: Record<string, string>;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    NO: {
      placeholder: "Søk lokaler, områder, aktiviteter...",
      noResults: "Ingen resultater funnet",
      facilities: "Lokaler",
      locations: "Områder",
      categories: "Kategorier",
      recent: "Nylig søkt",
      searching: "Søker..."
    },
    EN: {
      placeholder: "Search facilities, areas, activities...",
      noResults: "No results found",
      facilities: "Facilities",
      locations: "Locations", 
      categories: "Categories",
      recent: "Recent searches",
      searching: "Searching..."
    }
  };

  const t = translations[language];

  // Load facilities on component mount
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setIsLoading(true);
        console.log("GlobalSearch - Loading facilities...");
        const result = await facilityRepository.findAll({ page: 1, limit: 100 });
        if (result.success && result.data?.data) {
          console.log("GlobalSearch - Loaded facilities:", result.data.data.length);
          setFacilities(result.data.data);
        } else {
          console.error("GlobalSearch - Failed to load facilities:", result.error);
        }
      } catch (error) {
        console.error("GlobalSearch - Error loading facilities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFacilities();
  }, []);

  // Create search results from facilities and other data
  const createSearchResults = (searchTerm: string): SearchResult[] => {
    if (!searchTerm.trim() || facilities.length === 0) return [];
    
    const searchLower = searchTerm.toLowerCase();
    console.log("GlobalSearch - Searching for:", searchLower);
    
    const facilityResults: SearchResult[] = facilities
      .filter(facility => {
        const matchesName = facility.name.toLowerCase().includes(searchLower);
        const matchesDescription = facility.description?.toLowerCase().includes(searchLower);
        const matchesType = facility.type.toLowerCase().includes(searchLower);
        const matchesArea = facility.area.toLowerCase().includes(searchLower);
        const matchesActivity = facility.suitableFor?.some(activity => 
          activity.toLowerCase().includes(searchLower)
        );
        
        return matchesName || matchesDescription || matchesType || matchesArea || matchesActivity;
      })
      .slice(0, 6) // Limit facility results
      .map(facility => ({
        id: facility.id.toString(),
        type: 'facility' as const,
        title: facility.name,
        subtitle: `${facility.area} - Kapasitet: ${facility.capacity}`,
        icon: <Building className="h-5 w-5" />,
        url: `/facilities/${facility.id}`,
        image: facility.image
      }));

    // Add location results (unique areas from facilities)
    const uniqueAreas = Array.from(new Set(facilities.map(f => f.area)))
      .filter(area => area.toLowerCase().includes(searchLower))
      .slice(0, 3)
      .map(area => ({
        id: `location-${area}`,
        type: 'location' as const,
        title: area,
        subtitle: `${facilities.filter(f => f.area === area).length} lokaler tilgjengelig`,
        icon: <MapPin className="h-5 w-5" />,
        url: '/',
        searchParams: { location: area.toLowerCase().replace(' ', '-') }
      }));

    // Add category results (unique types from facilities)
    const uniqueTypes = Array.from(new Set(facilities.map(f => f.type)))
      .filter(type => type.toLowerCase().includes(searchLower))
      .slice(0, 3)
      .map(type => ({
        id: `category-${type}`,
        type: 'category' as const,
        title: type,
        subtitle: `${facilities.filter(f => f.type === type).length} lokaler tilgjengelig`,
        icon: <Users className="h-5 w-5" />,
        url: '/',
        searchParams: { facilityType: type.toLowerCase().replace(' ', '-') }
      }));

    console.log("GlobalSearch - Total results:", facilityResults.length + uniqueAreas.length + uniqueTypes.length);
    
    return [...facilityResults, ...uniqueAreas, ...uniqueTypes];
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const searchResults = createSearchResults(searchTerm);
      
      // Sort by relevance (exact matches first, then partial matches)
      const sorted = searchResults.sort((a, b) => {
        const aExact = a.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bExact = b.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Prioritize facilities over other types
        if (a.type === 'facility' && b.type !== 'facility') return -1;
        if (a.type !== 'facility' && b.type === 'facility') return 1;
        
        return 0;
      });
      
      setResults(sorted.slice(0, 8)); // Limit to 8 results
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchTerm, facilities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    console.log("GlobalSearch - Result clicked:", result.title);
    setSearchTerm("");
    setIsOpen(false);
    onResultClick?.(result);
    
    // Navigate using React Router
    if (result.searchParams) {
      // For search results with parameters, navigate to home page with search params
      const searchParams = new URLSearchParams(result.searchParams);
      navigate(`${result.url}?${searchParams.toString()}`);
    } else {
      // For direct navigation (facilities)
      navigate(result.url);
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    const key = result.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder={t.placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
          className="pl-12 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-400 text-base font-medium placeholder:text-base placeholder:font-medium"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl z-50 max-h-[500px] overflow-hidden">
          <Command>
            <CommandList>
              {isLoading ? (
                <CommandEmpty className="py-8 text-center text-base text-gray-500">
                  {t.searching}
                </CommandEmpty>
              ) : results.length === 0 ? (
                <CommandEmpty className="py-8 text-center text-base text-gray-500">
                  {searchTerm.length > 0 ? t.noResults : "Skriv for å søke..."}
                </CommandEmpty>
              ) : (
                <>
                  {Object.entries(groupedResults).map(([type, typeResults]) => (
                    <CommandGroup 
                      key={type} 
                      heading={t[type as keyof typeof t] || type}
                      className="[&_[cmdk-group-heading]]:text-base [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-700 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-3"
                    >
                      {typeResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          value={result.title}
                          onSelect={() => handleResultClick(result)}
                          className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50"
                        >
                          {result.image ? (
                            <div className="w-12 h-12 bg-gray-100 overflow-hidden flex-shrink-0 rounded">
                              <img 
                                src={result.image} 
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0 rounded">
                              {result.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate text-base">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-base text-gray-500 truncate mt-1">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
