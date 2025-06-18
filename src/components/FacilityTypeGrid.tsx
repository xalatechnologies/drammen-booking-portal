
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  School, 
  MapPin,
  Building
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FacilityType {
  icon: React.ReactNode;
  nameKey: string;
  locationKey: string;
  key: string;
  image?: string;
}

const FacilityTypeGrid = () => {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      gymnasium: "Gymnasium",
      meetingRoom: "Møterom",
      auditorium: "Auditorium",
      sportsField: "Sportsbane",
      tennisCourt: "Tennisbane",
      swimmingPool: "Svømmebasseng",
      banquetHall: "Festsal",
      kitchen: "Kjøkken",
      activityHall: "Aktivitetshall",
      classroom: "Klasserom",
      conferenceRoom: "Konferanserom",
      exhibitionHall: "Utstillingshall",
      halleren: "Halleren",
      city: "Sentrum",
      plant: "Planten",
      gym: "Treningssenter",
      hall: "Hall",
      kitchen: "Kjøkken"
    },
    EN: {
      gymnasium: "Gymnasium",
      meetingRoom: "Meeting room",
      auditorium: "Auditorium",
      sportsField: "Sports field",
      tennisCourt: "Tennis court",
      swimmingPool: "Swimming pool",
      banquetHall: "Banquet hall",
      kitchen: "Kitchen",
      activityHall: "Activity hall",
      classroom: "Classroom",
      conferenceRoom: "Conference room",
      exhibitionHall: "Exhibition hall",
      halleren: "Halleren",
      city: "City",
      plant: "Plant",
      gym: "Gym",
      hall: "Hall",
      kitchen: "Kitchen"
    }
  };

  const t = translations[language];

  const facilityTypes: FacilityType[] = [
    {
      icon: <Home className="h-6 w-6 text-orange-500" />,
      nameKey: "gymnasium",
      locationKey: "halleren",
      key: "gymnasium",
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png"
    },
    {
      icon: <Building className="h-6 w-6 text-blue-500" />,
      nameKey: "meetingRoom",
      locationKey: "city",
      key: "meeting-room",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop"
    },
    {
      icon: <School className="h-6 w-6 text-yellow-500" />,
      nameKey: "auditorium",
      locationKey: "plant",
      key: "auditorium",
      image: "https://www.drammen.kommune.no/globalassets/tjenester/skole/bilder/bragernes-skole.jpg?quality=80&width=900"
    },
    {
      icon: <Home className="h-6 w-6 text-green-500" />,
      nameKey: "sportsField",
      locationKey: "halleren",
      key: "sports-field",
      image: "https://img8.custompublish.com/getfile.php/4858135.2928.i7jbbupwjptlwn/750x0/6390879_4858135.jpg"
    },
    {
      icon: <MapPin className="h-6 w-6 text-purple-500" />,
      nameKey: "tennisCourt",
      locationKey: "halleren",
      key: "tennis-court",
      image: "https://images.unsplash.com/photo-1581093458791-9d09a19b1322?w=600&auto=format&fit=crop"
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-500" />,
      nameKey: "swimmingPool",
      locationKey: "gym",
      key: "swimming-pool",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-6 w-6 text-amber-500" />,
      nameKey: "banquetHall",
      locationKey: "halleren",
      key: "banquet-hall",
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format&fit=crop"
    },
    {
      icon: <Home className="h-6 w-6 text-red-500" />,
      nameKey: "kitchen",
      locationKey: "kitchen",
      key: "kitchen",
      image: "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-6 w-6 text-yellow-500" />,
      nameKey: "activityHall",
      locationKey: "halleren",
      key: "activity-hall",
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=600&auto=format&fit=crop"
    },
    {
      icon: <School className="h-6 w-6 text-orange-500" />,
      nameKey: "classroom",
      locationKey: "halleren",
      key: "classroom",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-6 w-6 text-teal-500" />,
      nameKey: "conferenceRoom",
      locationKey: "hall",
      key: "conference-room",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop"
    },
    {
      icon: <Building className="h-6 w-6 text-indigo-500" />,
      nameKey: "exhibitionHall",
      locationKey: "hall",
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
              alt={t[facility.nameKey as keyof typeof t]} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                {facility.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-800 truncate">{t[facility.nameKey as keyof typeof t]}</h3>
                <p className="text-blue-600 text-sm font-medium truncate">{t[facility.locationKey as keyof typeof t]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityTypeGrid;
