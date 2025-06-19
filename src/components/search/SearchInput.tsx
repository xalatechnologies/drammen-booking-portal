
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('search.placeholders.searchText')}
        className="pl-12 h-14 text-lg font-medium border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl transition-all duration-300 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        aria-label={t('search.labels.searchFacilities')}
      />
    </div>
  );
};

export default SearchInput;
