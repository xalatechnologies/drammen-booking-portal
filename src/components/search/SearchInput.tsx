
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
        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-7 w-7" 
        aria-hidden="true"
      />
      <Input
        id="facility-search"
        placeholder="Hvor vil du være? Søk etter lokaler..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-16 h-14 border-2 border-gray-300 focus:border-gray-900 focus:ring-0 text-lg font-medium placeholder:text-gray-500 placeholder:font-normal placeholder:text-lg"
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
