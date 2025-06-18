import React, { useState, useRef, useEffect } from "react";
import { Search, X, MapPin, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: number;
  type: 'facility' | 'location' | 'event';
  title: string;
  subtitle: string;
  image?: string;
}

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 1,
      type: 'facility',
      title: 'Brandengen Skole - Gymsal',
      subtitle: 'Iver Holters gate 48, Drammen',
      image: '/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png'
    },
    {
      id: 2,
      type: 'facility',
      title: 'Fjell Skole - Aktivitetshall',
      subtitle: 'Lauritz Hervigs vei 20, Drammen',
      image: '/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png'
    },
    {
      id: 3,
      type: 'location',
      title: 'Drammen Sentrum',
      subtitle: '15 tilgjengelige lokaler',
      image: '/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png'
    },
    {
      id: 4,
      type: 'event',
      title: 'Idrettshaller',
      subtitle: '8 tilgjengelige lokaler',
      image: '/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png'
    }
  ];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      setIsSearching(true);
      // Simulate API call delay
      setTimeout(() => {
        setResults(mockResults.filter(result => 
          result.title.toLowerCase().includes(value.toLowerCase()) || 
          result.subtitle.toLowerCase().includes(value.toLowerCase())
        ));
        setIsSearching(false);
        setIsResultsVisible(true);
      }, 300);
    } else {
      setResults([]);
      setIsResultsVisible(false);
    }
  };

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'facility') {
      navigate(`/facilities/${result.id}`);
    } else if (result.type === 'location') {
      navigate(`/?location=${result.title.toLowerCase().replace(' ', '-')}`);
    } else {
      navigate(`/?facilityType=${result.title.toLowerCase().replace(' ', '-')}`);
    }
    setIsResultsVisible(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setIsResultsVisible(false);
  };

  // Get icon based on result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-600" />;
      default:
        return <Users className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Søk etter lokaler, områder eller aktiviteter..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-12 pr-10 h-14 text-lg border-2 border-gray-200 focus:border-blue-600 focus:ring-blue-100 w-full shadow-sm hover:shadow-md transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal"
          onFocus={() => {
            if (searchTerm.length > 1) {
              setIsResultsVisible(true);
            }
          }}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-400 hover:text-gray-600"
            onClick={clearSearch}
            aria-label="Tøm søk"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isResultsVisible && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Søker...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500">Søkeresultater</h3>
              </div>
              <div>
                {results.map((result) => (
                  <div 
                    key={`${result.type}-${result.id}`}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    onClick={() => handleResultClick(result)}
                  >
                    {result.image ? (
                      <div className="w-16 h-16 bg-gray-200 mr-4 flex-shrink-0">
                        <img 
                          src={result.image} 
                          alt={result.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 mr-4 flex items-center justify-center flex-shrink-0">
                        {getResultIcon(result.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 truncate">{result.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(searchTerm)}`)}
                >
                  Vis alle resultater
                </Button>
              </div>
            </div>
          ) : searchTerm.length > 1 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-2">Ingen resultater funnet for "{searchTerm}"</p>
              <p className="text-sm text-gray-500">Prøv et annet søkeord eller sjekk stavemåten</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;