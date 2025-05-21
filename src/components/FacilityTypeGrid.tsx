
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
  Waves
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
      icon: <Home className="h-8 w-8 text-orange-500" />,
      name: "Gymnasium",
      location: "Halleren",
      key: "gymnasium"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      name: "Meeting room",
      location: "City",
      key: "meeting-room"
    },
    {
      icon: <School className="h-8 w-8 text-yellow-500" />,
      name: "Auditorium",
      location: "Plant",
      key: "auditorium"
    },
    {
      icon: <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="m7 12 10 5V7L7 12z"/></svg>,
      name: "Sports field",
      location: "Halleren",
      key: "sports-field"
    },
    {
      icon: <svg className="h-8 w-8 text-purple-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4c-1.2-1.2-3.1-1.2-4.3 0L12 5.7 10.3 4c-1.2-1.2-3.1-1.2-4.3 0-1.2 1.2-1.2 3.1 0 4.3L12 14.1l6-5.8c1.2-1.2 1.2-3.1 0-4.3z"/><path d="M12 14.1v7.4"/><path d="m15 18-3 3-3-3"/></svg>,
      name: "Tennis court",
      location: "Halleren",
      key: "tennis-court"
    },
    {
      icon: <Waves className="h-8 w-8 text-blue-500" />,
      name: "Swimming pool",
      location: "Gym",
      key: "swimming-pool"
    },
    {
      icon: <svg className="h-8 w-8 text-amber-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>,
      name: "Banquet hall",
      location: "Halleren",
      key: "banquet-hall"
    },
    {
      icon: <UtensilsCrossed className="h-8 w-8 text-red-500" />,
      name: "Kitchen",
      location: "Kitchen",
      key: "kitchen"
    },
    {
      icon: <Activity className="h-8 w-8 text-yellow-500" />,
      name: "Activity hall",
      location: "Halleren",
      key: "activity-hall"
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
      name: "Classroom",
      location: "Halleren",
      key: "classroom"
    },
    {
      icon: <svg className="h-8 w-8 text-teal-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M3 7h18"/><path d="M7 7v10"/></svg>,
      name: "Conference room",
      location: "Hall",
      key: "conference-room"
    },
    {
      icon: <svg className="h-8 w-8 text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h18m-2 4v6c0 1-1 2-2 2H6c-1 0-2-1-2-2v-6h14z"/><path d="M4 7V5c0-1 1-2 2-2h10c1 0 2 1 2 2v2"/><path d="M6 13v4"/><path d="M10 13v4"/><path d="M14 13v4"/><path d="M18 13v4"/></svg>,
      name: "Exhibition hall",
      location: "Hall",
      key: "exhibition-hall"
    },
    {
      icon: <Theater className="h-8 w-8 text-pink-500" />,
      name: "Theater",
      location: "Halleren",
      key: "theater"
    },
    {
      icon: <Music className="h-8 w-8 text-violet-500" />,
      name: "Music room",
      location: "Halleren",
      key: "music-room"
    },
    {
      icon: <svg className="h-8 w-8 text-cyan-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7-.7.7"/><rect width="16" height="12" x="4" y="12" rx="2"/><path d="M8 12v4"/><path d="M16 12v4"/><path d="M12 12v8"/></svg>,
      name: "Meeting space",
      location: "Halleren",
      key: "meeting-space"
    },
    {
      icon: <svg className="h-8 w-8 text-emerald-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20V8H2z"/><path d="M8 12h8"/><path d="M16 16h0"/><path d="M12 16h0"/><path d="M8 16h0"/><path d="M12 2v7"/><path d="m9 5 3-3 3 3"/></svg>,
      name: "Exhibition hall",
      location: "Halleren",
      key: "exhibition-hall-2"
    },
    {
      icon: <svg className="h-8 w-8 text-fuchsia-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11.2" r="7"/><path d="m16 16 1.9 1.9"/><path d="M5 3 2 6"/><path d="M22 3l-3 3"/><path d="M6.3 10.4 9 13.1"/><path d="m17.1 13.1-3-3.1"/></svg>,
      name: "Squash court",
      location: "Squash",
      key: "squash-court"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {facilityTypes.map((facility) => (
        <Card 
          key={facility.key} 
          className="border cursor-pointer hover:shadow-md transition-all hover:translate-y-[-5px] bg-white overflow-hidden"
          onClick={() => window.location.href = `/facilities/${facility.key}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-50" />
          <CardContent className="p-5 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-50 flex items-center justify-center">
                {facility.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{facility.name}</h3>
                <p className="text-blue-600 font-medium">{facility.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityTypeGrid;
