
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
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
        aria-hidden="true"
      />
      <Input
        id="facility-search"
        placeholder="Søk lokaler"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
