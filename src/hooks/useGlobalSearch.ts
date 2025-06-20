
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface GlobalSearchResult {
  id: string;
  type: 'facility' | 'location' | 'category' | 'recent';
  title: string;
  subtitle?: string;
  url: string;
  searchParams?: Record<string, string>;
}

export function useGlobalSearch() {
  const navigate = useNavigate();

  const handleSearchResult = useCallback((result: GlobalSearchResult) => {
    console.log('useGlobalSearch - Handling search result:', result);
    
    // Save to recent searches in localStorage
    try {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const newSearch = {
        id: result.id,
        title: result.title,
        type: result.type,
        timestamp: Date.now()
      };
      
      // Remove duplicate and add to beginning
      const filtered = recentSearches.filter((search: any) => search.id !== result.id);
      const updated = [newSearch, ...filtered].slice(0, 10); // Keep only 10 recent searches
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }

    // Navigate based on result type
    if (result.searchParams) {
      // For search results with parameters, navigate to home page with search params
      const searchParams = new URLSearchParams(result.searchParams);
      const url = `${result.url}?${searchParams.toString()}`;
      console.log('useGlobalSearch - Navigating to:', url);
      navigate(url);
    } else {
      // For direct navigation (facilities)
      console.log('useGlobalSearch - Navigating to:', result.url);
      navigate(result.url);
    }
  }, [navigate]);

  const getRecentSearches = useCallback((): GlobalSearchResult[] => {
    try {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      return recentSearches.map((search: any) => ({
        id: search.id,
        type: 'recent' as const,
        title: search.title,
        subtitle: `Søkt ${new Date(search.timestamp).toLocaleDateString()}`,
        url: search.type === 'facility' ? `/facilities/${search.id}` : '/',
        searchParams: search.type !== 'facility' ? { [search.type]: search.title } : undefined
      }));
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      return [];
    }
  }, []);

  return {
    handleSearchResult,
    getRecentSearches
  };
}
