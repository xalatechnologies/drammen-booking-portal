
import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResult {
  id: string;
  type: 'facility' | 'location' | 'category' | 'recent';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  url: string;
  image?: string;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const translations = {
    NO: {
      placeholder: "Søk lokaler, områder, aktiviteter...",
      noResults: "Ingen resultater funnet",
      facilities: "Lokaler",
      locations: "Områder",
      categories: "Kategorier",
      recent: "Nylig søkt"
    },
    EN: {
      placeholder: "Search facilities, areas, activities...",
      noResults: "No results found",
      facilities: "Facilities",
      locations: "Locations", 
      categories: "Categories",
      recent: "Recent searches"
    }
  };

  const t = translations[language];

  // Mock data with images - in real app this would come from an API
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "facility",
      title: "Drammen Idrettshall",
      subtitle: "Bragernes - Kapasitet: 200",
      icon: <Building className="h-5 w-5" />,
      url: "/facilities/1",
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png"
    },
    {
      id: "2", 
      type: "facility",
      title: "Konnerud Gymsal",
      subtitle: "Konnerud - Kapasitet: 50",
      icon: <Building className="h-5 w-5" />,
      url: "/facilities/2",
      image: "/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png"
    },
    {
      id: "3",
      type: "location",
      title: "Drammen Sentrum",
      subtitle: "15 lokaler tilgjengelig",
      icon: <MapPin className="h-5 w-5" />,
      url: "/?location=drammen-sentrum",
      image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png"
    },
    {
      id: "4",
      type: "category",
      title: "Møterom",
      subtitle: "12 lokaler tilgjengelig",
      icon: <Users className="h-5 w-5" />,
      url: "/?type=meeting-room",
      image: "/lovable-uploads/bda6906f-cc9a-4d78-9e9e-84c342947fae.png"
    },
    {
      id: "5",
      type: "recent",
      title: "Idrettshall Strømsø",
      subtitle: "Søkt i går",
      icon: <Clock className="h-5 w-5" />,
      url: "/facilities/5",
      image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png"
    }
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      // Smart search logic - filter and rank results
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Sort by relevance (exact matches first, then partial matches)
      const sorted = filtered.sort((a, b) => {
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
      // Show recent searches when no search term
      const recentResults = mockResults.filter(r => r.type === 'recent');
      setResults(recentResults);
      setIsOpen(searchTerm.length === 0 && document.activeElement === searchRef.current?.querySelector('input'));
    }
  }, [searchTerm]);

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
    setSearchTerm("");
    setIsOpen(false);
    onResultClick?.(result);
    
    // Navigate to result
    window.location.href = result.url;
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
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-400 text-base font-medium placeholder:text-gray-500"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl z-50 max-h-[500px] overflow-hidden">
          <Command>
            <CommandList>
              {results.length === 0 ? (
                <CommandEmpty className="py-8 text-center text-base text-gray-500">
                  {t.noResults}
                </CommandEmpty>
              ) : (
                <>
                  {Object.entries(groupedResults).map(([type, typeResults]) => (
                    <CommandGroup 
                      key={type} 
                      heading={t[type as keyof typeof t] || type}
                      className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-700 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2"
                    >
                      {typeResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          value={result.title}
                          onSelect={() => handleResultClick(result)}
                          className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50"
                        >
                          {result.image ? (
                            <div className="w-12 h-12 bg-gray-100 overflow-hidden flex-shrink-0">
                              <img 
                                src={result.image} 
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {result.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate text-base">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-sm text-gray-500 truncate mt-1">
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
