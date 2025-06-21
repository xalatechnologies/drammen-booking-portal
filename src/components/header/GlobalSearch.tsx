
import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { facilityRepository } from "@/dal/repositories";
import { Facility } from "@/types/facility";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

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
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { handleSearchResult, getRecentSearches } = useGlobalSearch();

  const translations = {
    NO: {
      placeholder: "Søk lokaler, områder, aktiviteter...",
      noResults: "Ingen resultater funnet",
      facilities: "Lokaler",
      locations: "Områder",
      categories: "Kategorier",
      recent: "Nylig søkt",
      searching: "Søker...",
      error: "Feil ved søking"
    },
    EN: {
      placeholder: "Search facilities, areas, activities...",
      noResults: "No results found",
      facilities: "Facilities",
      locations: "Locations", 
      categories: "Categories",
      recent: "Recent searches",
      searching: "Searching...",
      error: "Search error"
    }
  };

  const t = translations[language];

  // Load facilities on component mount
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("GlobalSearch - Loading facilities...");
        
        const result = await facilityRepository.getAll({ page: 1, limit: 100 });
        console.log("GlobalSearch - Repository result:", result);
        
        if (result.success && result.data?.data) {
          console.log("GlobalSearch - Loaded facilities:", result.data.data.length);
          setFacilities(result.data.data);
          setError(null);
        } else {
          const errorMsg = result.error?.message || "Failed to load facilities";
          console.error("GlobalSearch - Failed to load facilities:", errorMsg);
          setError(errorMsg);
          setFacilities([]);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to load facilities";
        console.error("GlobalSearch - Error loading facilities:", error);
        setError(errorMsg);
        setFacilities([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFacilities();
  }, []);

  // Create search results from facilities and other data
  const createSearchResults = (searchTerm: string): SearchResult[] => {
    console.log("GlobalSearch - Creating search results for:", searchTerm);
    console.log("GlobalSearch - Available facilities:", facilities.length);
    
    if (!searchTerm.trim()) {
      // Show recent searches when no search term
      const recentSearches = getRecentSearches();
      console.log("GlobalSearch - Recent searches:", recentSearches.length);
      return recentSearches.map(search => ({
        ...search,
        icon: <Clock className="h-5 w-5" />
      }));
    }
    
    if (facilities.length === 0) {
      console.log("GlobalSearch - No facilities available for search");
      return [];
    }
    
    const searchLower = searchTerm.toLowerCase();
    console.log("GlobalSearch - Searching for:", searchLower);
    
    const facilityResults: SearchResult[] = facilities
      .filter(facility => {
        const matchesName = facility.name.toLowerCase().includes(searchLower);
        const matchesDescription = facility.description?.toLowerCase().includes(searchLower);
        const matchesType = facility.type.toLowerCase().includes(searchLower);
        const matchesArea = facility.area.toLowerCase().includes(searchLower);
        const matchesActivity = facility.equipment?.some(eq => 
          eq.toLowerCase().includes(searchLower)
        );
        
        const matches = matchesName || matchesDescription || matchesType || matchesArea || matchesActivity;
        if (matches) {
          console.log("GlobalSearch - Facility match:", facility.name);
        }
        return matches;
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
        searchParams: { location: area.toLowerCase().replace(/\s+/g, '-') }
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
        searchParams: { facilityType: type.toLowerCase().replace(/\s+/g, '-') }
      }));

    const totalResults = [...facilityResults, ...uniqueAreas, ...uniqueTypes];
    console.log("GlobalSearch - Total results:", totalResults.length);
    
    return totalResults;
  };

  useEffect(() => {
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
    setIsOpen(searchTerm.length > 0 || sorted.length > 0);
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
    console.log("GlobalSearch - Result clicked:", result.title, result);
    setSearchTerm("");
    setIsOpen(false);
    
    // Use the global search hook for consistent handling
    handleSearchResult({
      id: result.id,
      type: result.type,
      title: result.title,
      subtitle: result.subtitle,
      url: result.url,
      searchParams: result.searchParams
    });
    
    // Call the optional callback
    onResultClick?.(result);
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
          onFocus={() => {
            const searchResults = createSearchResults(searchTerm);
            setIsOpen(searchTerm.length > 0 || searchResults.length > 0);
          }}
          className="pl-12 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-400 text-base font-medium placeholder:text-base placeholder:font-medium"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl z-50 max-h-[500px] overflow-hidden">
          <Command>
            <CommandList>
              {error ? (
                <CommandEmpty className="py-8 text-center text-base text-red-500">
                  {t.error}: {error}
                </CommandEmpty>
              ) : isLoading ? (
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
