
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Users, 
  School, 
  Activity,
  UtensilsCrossed,
  GraduationCap,
  Theater,
  Music,
  Waves,
  CircleDot
} from "lucide-react";

interface FacilityType {
  icon: React.ReactNode;
  name: string;
  location: string;
  key: string;
}

const FacilityTypeGrid = () => {
  const facilityTypes: FacilityType[] = [
    {
      icon: <Home className="h-5 w-5 text-orange-500" />,
      name: "Gymnasium",
      location: "Halleren",
      key: "gymnasium"
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      name: "Meeting room",
      location: "City",
      key: "meeting-room"
    },
    {
      icon: <School className="h-5 w-5 text-yellow-500" />,
      name: "Auditorium",
      location: "Plant",
      key: "auditorium"
    },
    {
      icon: <Activity className="h-5 w-5 text-green-500" />,
      name: "Sports field",
      location: "Halleren",
      key: "sports-field"
    },
    {
      icon: <CircleDot className="h-5 w-5 text-purple-500" />,
      name: "Tennis court",
      location: "Halleren",
      key: "tennis-court"
    },
    {
      icon: <Waves className="h-5 w-5 text-blue-500" />,
      name: "Swimming pool",
      location: "Gym",
      key: "swimming-pool"
    },
    {
      icon: <Theater className="h-5 w-5 text-amber-500" />,
      name: "Banquet hall",
      location: "Halleren",
      key: "banquet-hall"
    },
    {
      icon: <UtensilsCrossed className="h-5 w-5 text-red-500" />,
      name: "Kitchen",
      location: "Kitchen",
      key: "kitchen"
    },
    {
      icon: <Activity className="h-5 w-5 text-yellow-500" />,
      name: "Activity hall",
      location: "Halleren",
      key: "activity-hall"
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-orange-500" />,
      name: "Classroom",
      location: "Halleren",
      key: "classroom"
    },
    {
      icon: <Music className="h-5 w-5 text-teal-500" />,
      name: "Conference room",
      location: "Hall",
      key: "conference-room"
    },
    {
      icon: <Theater className="h-5 w-5 text-indigo-500" />,
      name: "Exhibition hall",
      location: "Hall",
      key: "exhibition-hall"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {facilityTypes.map((facility) => (
        <Card 
          key={facility.key} 
          className="border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] bg-white"
          onClick={() => window.location.href = `/facilities/${facility.key}`}
        >
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
