
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useFacilityStore } from '@/stores/useFacilityStore';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { searchTerm, setSearchTerm } = useFacilityStore();

  // Sync with facility store
  const value = {
    searchTerm,
    setSearchTerm
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
