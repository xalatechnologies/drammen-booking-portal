
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
      icon: <Home className="h-6 w-6 text-orange-500" />,
      name: "Gymnasium",
      location: "Halleren",
      key: "gymnasium"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      name: "Meeting room",
      location: "City",
      key: "meeting-room"
    },
    {
      icon: <School className="h-6 w-6 text-yellow-500" />,
      name: "Auditorium",
      location: "Plant",
      key: "auditorium"
    },
    {
      icon: <svg className="h-6 w-6 text-green-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="m7 12 10 5V7L7 12z"/></svg>,
      name: "Sports field",
      location: "Halleren",
      key: "sports-field"
    },
    {
      icon: <CircleDot className="h-6 w-6 text-purple-500" />,
      name: "Tennis court",
      location: "Halleren",
      key: "tennis-court"
    },
    {
      icon: <Waves className="h-6 w-6 text-blue-500" />,
      name: "Swimming pool",
      location: "Gym",
      key: "swimming-pool"
    },
    {
      icon: <svg className="h-6 w-6 text-amber-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>,
      name: "Banquet hall",
      location: "Halleren",
      key: "banquet-hall"
    },
    {
      icon: <UtensilsCrossed className="h-6 w-6 text-red-500" />,
      name: "Kitchen",
      location: "Kitchen",
      key: "kitchen"
    },
    {
      icon: <Activity className="h-6 w-6 text-yellow-500" />,
      name: "Activity hall",
      location: "Halleren",
      key: "activity-hall"
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-orange-500" />,
      name: "Classroom",
      location: "Halleren",
      key: "classroom"
    },
    {
      icon: <svg className="h-6 w-6 text-teal-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M3 7h18"/><path d="M7 7v10"/></svg>,
      name: "Conference room",
      location: "Hall",
      key: "conference-room"
    },
    {
      icon: <svg className="h-6 w-6 text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h18m-2 4v6c0 1-1 2-2 2H6c-1 0-2-1-2-2v-6h14z"/><path d="M4 7V5c0-1 1-2 2-2h10c1 0 2 1 2 2v2"/><path d="M6 13v4"/><path d="M10 13v4"/><path d="M14 13v4"/><path d="M18 13v4"/></svg>,
      name: "Exhibition hall",
      location: "Hall",
      key: "exhibition-hall"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {facilityTypes.slice(0, 8).map((facility) => (
        <Card 
          key={facility.key} 
          className="border cursor-pointer hover:shadow-md transition-all hover:translate-y-[-3px] bg-white overflow-hidden h-24 sm:h-32"
          onClick={() => window.location.href = `/facilities/${facility.key}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-50" />
          <CardContent className="p-2 sm:p-3 relative flex flex-col justify-center h-full">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gray-50 flex items-center justify-center">
                {facility.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{facility.name}</h3>
                <p className="text-blue-600 text-xs sm:text-sm">{facility.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityTypeGrid;
