
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="relative">
      <label htmlFor="facility-search" className="sr-only">
        Søk etter lokaler
      </label>
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
        aria-hidden="true"
      />
      <Input
        id="facility-search"
        placeholder="Søk etter lokaler, aktiviteter eller områder..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 h-14 border-0 bg-white/90 backdrop-blur-sm shadow-lg focus:shadow-xl focus:bg-white focus:ring-4 focus:ring-white/50 text-lg font-medium placeholder:text-gray-500 placeholder:font-normal placeholder:text-base rounded-xl transition-all duration-300"
        aria-describedby="search-help"
        autoComplete="off"
        role="searchbox"
        aria-label="Søk etter lokaler ved navn eller beskrivelse"
      />
      <div id="search-help" className="sr-only">
        Skriv inn navn på lokale eller annen beskrivelse for å søke
      </div>
    </div>
  );
};

export default SearchInput;
