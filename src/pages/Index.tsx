
import React, { useState, useMemo } from 'react';
import { SearchFilter } from '@/components/SearchFilter';
import FacilityGrid from '@/components/FacilityGrid';
import MapView from '@/components/MapView';
import CalendarView from '@/components/CalendarView';
import HeroBanner from '@/components/HeroBanner';
import { Button } from '@/components/ui/button';
import { Calendar, Grid, Map } from 'lucide-react';
import { useFacilities } from '@/hooks/useFacilities';

type ViewMode = 'grid' | 'map' | 'calendar';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityType, setFacilityType] = useState('all');
  const [location, setLocation] = useState('all');
  const [accessibility, setAccessibility] = useState('all');
  const [capacity, setCapacity] = useState<[number, number]>([0, 200]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Use the simplified hook
  const { facilities, isLoading, error } = useFacilities({
    pagination: { page: 1, limit: 50 },
    filters: {
      facilityType: facilityType !== 'all' ? facilityType : undefined,
      location: location !== 'all' ? location : undefined,
      accessibility: accessibility !== 'all' ? accessibility : undefined,
      capacity: capacity && (capacity[0] > 0 || capacity[1] < 200) ? capacity : undefined,
      date: selectedDate,
    }
  });

  // Client-side search filtering
  const filteredFacilities = useMemo(() => {
    if (!searchTerm) return facilities;
    return facilities.filter(facility => 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facilities, searchTerm]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-8">Laster inn...</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">Feil ved lasting av data</div>;
    }

    switch (viewMode) {
      case 'map':
        return <MapView facilities={filteredFacilities} />;
      case 'calendar':
        return (
          <CalendarView 
            date={selectedDate}
            facilityType={facilityType}
            location={location}
            accessibility={accessibility}
            capacity={capacity}
          />
        );
      default:
        return <FacilityGrid facilities={filteredFacilities} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            facilityType={facilityType}
            onFacilityTypeChange={setFacilityType}
            location={location}
            onLocationChange={setLocation}
            accessibility={accessibility}
            onAccessibilityChange={setAccessibility}
            capacity={capacity}
            onCapacityChange={setCapacity}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-lg shadow-sm border p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center space-x-2"
            >
              <Grid className="h-4 w-4" />
              <span>Rutenett</span>
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="flex items-center space-x-2"
            >
              <Map className="h-4 w-4" />
              <span>Kart</span>
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Kalender</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Viser {filteredFacilities.length} av {facilities.length} lokaler
          </p>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
