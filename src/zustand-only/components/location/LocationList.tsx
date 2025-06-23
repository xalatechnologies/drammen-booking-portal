import React, { useEffect, useState } from 'react';
import { useLocation } from '@/zustand-only/hooks/useLocation';
import { useTranslation } from '@/zustand-only/hooks/useTranslation';
import { Location } from '@/zustand-only/types/models';

/**
 * Location list component using the Zustand-only architecture
 */
export function LocationList() {
  const { t } = useTranslation();
  const {
    locations,
    isLoading,
    error,
    loadLocations,
    getLocalizedName,
    getLocalizedDescription,
    searchLocations,
    pagination,
    changePage
  } = useLocation({ autoLoad: true });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocations(searchTerm);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    changePage(page);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('facilities.title')}</h1>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('common.search')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t('common.search')}
          </button>
        </div>
      </form>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Locations grid */}
      {!isLoading && !error && (
        <>
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('facilities.noFacilitiesFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <LocationCard 
                  key={location.id} 
                  location={location}
                  getLocalizedName={getLocalizedName}
                  getLocalizedDescription={getLocalizedDescription}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } text-sm font-medium border ${
                      page === pagination.page ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Location card component
 */
interface LocationCardProps {
  location: Location;
  getLocalizedName: (location: Location) => string;
  getLocalizedDescription: (location: Location) => string;
}

function LocationCard({ location, getLocalizedName, getLocalizedDescription }: LocationCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Location image */}
      <div className="h-48 bg-gray-200">
        {location.metadata?.imageUrl ? (
          <img
            src={location.metadata.imageUrl}
            alt={getLocalizedName(location)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">{t('common.noImage')}</span>
          </div>
        )}
      </div>
      
      {/* Location details */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{getLocalizedName(location)}</h2>
        
        {location.address && (
          <p className="text-gray-600 mb-4">
            <span className="inline-block mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            {location.address}
          </p>
        )}
        
        <p className="text-gray-700 mb-6 line-clamp-3">
          {getLocalizedDescription(location)}
        </p>
        
        {/* Zone count badge */}
        {location.zones && (
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {t('facilities.zonesAvailable', { count: location.zones.length })}
            </span>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between mt-4">
          <a
            href={`/locations/${location.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t('common.viewDetails')}
          </a>
          
          <a
            href={`/locations/${location.id}/book`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            {t('facilities.bookFacility')}
          </a>
        </div>
      </div>
    </div>
  );
}
