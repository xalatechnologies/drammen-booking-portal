
import React from 'react';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';

// Correct facility locations with accurate addresses and coordinates matching FacilityManagement page
const facilityLocations = [
  {
    id: 1,
    name: "Brandengen Skole - Gymsal",
    address: "Iver Holters gate 48, 3041 Drammen",
    lat: 59.7464,
    lng: 10.2045
  },
  {
    id: 2,
    name: "Fjell Skole - Aktivitetshall", 
    address: "Lauritz Hervigs vei 20, 3035 Drammen",
    lat: 59.7298,
    lng: 10.1845
  },
  {
    id: 3,
    name: "Gulskogen Skole - Auditorium",
    address: "Vintergata 8, 3048 Drammen", 
    lat: 59.7512,
    lng: 10.1689
  },
  {
    id: 4,
    name: "Marienlyst Stadion - Møtesal",
    address: "Schwartz gate 2, 3043 Drammen",
    lat: 59.7389,
    lng: 10.2167
  },
  {
    id: 5,
    name: "Drammensbadet - Svømmehall",
    address: "Danvikgata 40, 3045 Drammen",
    lat: 59.7545,
    lng: 10.1798
  },
  {
    id: 6,
    name: "Åssiden Fotballhall",
    address: "Buskerudveien 54, 3024 Drammen",
    lat: 59.7634,
    lng: 10.1456
  },
  {
    id: 7,
    name: "Drammen Bibliotek - Møterom",
    address: "Grønland 32, 3045 Drammen",
    lat: 59.7423,
    lng: 10.2056
  },
];

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location }) => {
  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[400px] relative overflow-hidden">
          <div className="h-[400px] w-full relative bg-gradient-to-br from-blue-50 to-green-50">
            {/* Illustration Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
              {/* Stylized map elements */}
              <div className="absolute top-8 left-12 w-16 h-12 bg-blue-200 rounded-full opacity-60"></div>
              <div className="absolute top-24 right-16 w-24 h-8 bg-green-200 rounded-lg opacity-50"></div>
              <div className="absolute bottom-20 left-8 w-20 h-16 bg-blue-300 rounded-xl opacity-40"></div>
              <div className="absolute bottom-8 right-12 w-12 h-20 bg-green-300 rounded-lg opacity-45"></div>
              
              {/* Mock roads */}
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300 opacity-60 transform rotate-12"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 opacity-60 transform -rotate-6"></div>
              <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-300 opacity-60"></div>
            </div>

            {/* Facility markers on illustration */}
            {filteredFacilities.slice(0, 6).map((facility, index) => (
              <div
                key={facility.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${20 + (index % 3) * 30}%`,
                  top: `${25 + Math.floor(index / 3) * 40}%`
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {facility.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Info overlay */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-md max-w-xs">
              <p className="text-sm font-medium mb-2">Kartvisning - Prototype</p>
              <p className="text-xs text-gray-600 mb-2">Viser {filteredFacilities.length} fasiliteter</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {filteredFacilities.map(facility => (
                  <div key={facility.id} className="text-xs flex items-start gap-1.5">
                    <MapPin className="h-3 w-3 mt-0.5 text-red-500 flex-shrink-0" />
                    <span className="line-clamp-2">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MapView;
