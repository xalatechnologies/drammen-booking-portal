
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Clock } from 'lucide-react';
import { useFacilities } from '@/hooks/useFacilities';

interface FacilityLocation {
  id: string; // Changed from number to string
  name: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  type: string;
  capacity: number;
  nextAvailable: string;
}

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<FacilityLocation | null>(null);
  const { data: facilities = [], isLoading } = useFacilities();

  // Convert facilities to map locations
  const mapLocations: FacilityLocation[] = facilities.map(facility => ({
    id: facility.id, // Already a string
    name: facility.name,
    address: facility.area,
    lat: 59.9139, // Default Oslo coordinates
    lng: 10.7522,
    image: facility.facility_images?.[0]?.image_url || '/placeholder.svg',
    type: facility.type,
    capacity: facility.capacity,
    nextAvailable: 'Available now'
  }));

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      try {
        await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 59.9139, lng: 10.7522 }, // Oslo center
          zoom: 11,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);

        // Add markers for each facility
        mapLocations.forEach((facility) => {
          const marker = new google.maps.Marker({
            position: { lat: facility.lat, lng: facility.lng },
            map: mapInstance,
            title: facility.name,
            icon: {
              url: '/map-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
            },
          });

          marker.addListener('click', () => {
            setSelectedFacility(facility);
          });
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    if (!isLoading) {
      initMap();
    }
  }, [isLoading, mapLocations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {selectedFacility && (
        <Card className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <img 
                src={selectedFacility.image} 
                alt={selectedFacility.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{selectedFacility.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {selectedFacility.type}
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{selectedFacility.address}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{selectedFacility.capacity}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{selectedFacility.nextAvailable}</span>
                  </div>
                </div>
                
                <Button size="sm" className="w-full text-xs">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapView;
