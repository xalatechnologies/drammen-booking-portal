
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  School, 
  MapPin,
  Building
} from "lucide-react";

interface FacilityType {
  icon: React.ReactNode;
  name: string;
  location: string;
  key: string;
  image?: string;
}

const FacilityTypeGrid = () => {
  const facilityTypes: FacilityType[] = [
    {
      icon: <Home className="h-5 w-5 text-orange-500" />,
      name: "Gymnasium",
      location: "Halleren",
      key: "gymnasium",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-5 w-5 text-blue-500" />,
      name: "Meeting room",
      location: "City",
      key: "meeting-room",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop"
    },
    {
      icon: <School className="h-5 w-5 text-yellow-500" />,
      name: "Auditorium",
      location: "Plant",
      key: "auditorium",
      image: "https://images.unsplash.com/photo-1596194081696-4bab3a813b63?w=600&auto=format&fit=crop"
    },
    {
      icon: <Home className="h-5 w-5 text-green-500" />,
      name: "Sports field",
      location: "Halleren",
      key: "sports-field",
      image: "https://img8.custompublish.com/getfile.php/4858135.2928.i7jbbupwjptlwn/750x0/6390879_4858135.jpg"
    },
    {
      icon: <MapPin className="h-5 w-5 text-purple-500" />,
      name: "Tennis court",
      location: "Halleren",
      key: "tennis-court",
      image: "https://images.unsplash.com/photo-1581093458791-9d09a19b1322?w=600&auto=format&fit=crop"
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
      name: "Swimming pool",
      location: "Gym",
      key: "swimming-pool",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-5 w-5 text-amber-500" />,
      name: "Banquet hall",
      location: "Halleren",
      key: "banquet-hall",
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format&fit=crop"
    },
    {
      icon: <Home className="h-5 w-5 text-red-500" />,
      name: "Kitchen",
      location: "Kitchen",
      key: "kitchen",
      image: "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-5 w-5 text-yellow-500" />,
      name: "Activity hall",
      location: "Halleren",
      key: "activity-hall",
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=600&auto=format&fit=crop"
    },
    {
      icon: <School className="h-5 w-5 text-orange-500" />,
      name: "Classroom",
      location: "Halleren",
      key: "classroom",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-5 w-5 text-teal-500" />,
      name: "Conference room",
      location: "Hall",
      key: "conference-room",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-5 w-5 text-indigo-500" />,
      name: "Exhibition hall",
      location: "Hall",
      key: "exhibition-hall",
      image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {facilityTypes.map((facility) => (
        <Card 
          key={facility.key} 
          className="border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] bg-white overflow-hidden"
          onClick={() => window.location.href = `/facilities/${facility.key}`}
        >
          <div className="h-24 w-full">
            <img 
              src={facility.image} 
              alt={facility.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                {facility.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 truncate">{facility.name}</h3>
                <p className="text-blue-600 text-xs font-medium truncate">{facility.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityTypeGrid;
