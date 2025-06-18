
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
      <div className="relative group">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors duration-200"
          aria-hidden="true"
        />
        <Input
          id="facility-search"
          placeholder="Søk etter lokaler, adresser eller områder"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-600 focus:ring-blue-100 rounded-full text-base shadow-sm hover:border-gray-300 transition-all duration-200 w-full"
          aria-describedby="search-help"
          autoComplete="off"
          role="searchbox"
          aria-label="Søk etter lokaler ved navn eller beskrivelse"
        />
      </div>
      <div id="search-help" className="sr-only">
        Skriv inn navn på lokale eller annen beskrivelse for å søke
      </div>
    </div>
  );
};

export default SearchInput;
