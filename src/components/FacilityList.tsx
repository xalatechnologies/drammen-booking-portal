
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

interface FacilityListProps {
  date?: Date;
  facilityType: string;
  location: string;
}

// This would typically come from an API/Supabase
const mockFacilities = [
  {
    id: 1,
    name: "Drammen Sports Hall",
    description: "A large sports facility with multiple courts",
    type: "sports-hall",
    location: "central",
    image: "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop",
    nextAvailable: new Date(2025, 4, 22, 10, 0),
    capacity: 200,
  },
  {
    id: 2,
    name: "Konnerud Community Center",
    description: "Modern meeting facilities for local groups",
    type: "meeting-room",
    location: "konnerud",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop",
    nextAvailable: new Date(2025, 4, 23, 13, 0),
    capacity: 30,
  },
  {
    id: 3,
    name: "Åssiden School Auditorium",
    description: "Perfect for presentations and performances",
    type: "auditorium",
    location: "aassiden",
    image: "https://images.unsplash.com/photo-1596194081696-4bab3a813b63?w=600&auto=format&fit=crop",
    nextAvailable: new Date(2025, 4, 24, 9, 0),
    capacity: 150,
  },
  {
    id: 4,
    name: "Gulskogen Gymnasium",
    description: "Fully equipped sports facility for multiple activities",
    type: "gym",
    location: "gulskogen",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop",
    nextAvailable: new Date(2025, 4, 22, 15, 30),
    capacity: 100,
  },
  {
    id: 5,
    name: "Fjell Community House",
    description: "Modern meeting spaces for local community gatherings",
    type: "community-house",
    location: "fjell",
    image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format&fit=crop",
    nextAvailable: new Date(2025, 4, 25, 12, 0),
    capacity: 75,
  },
  {
    id: 6,
    name: "Strømsø School Kitchen",
    description: "Full-service kitchen for cooking classes and events",
    type: "kitchen",
    location: "stromso",
    image: "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?w=600&auto=format&fit=crop",
    nextAvailable: new Date(2025, 4, 26, 16, 0),
    capacity: 20,
  },
];

const FacilityList: React.FC<FacilityListProps> = ({
  date,
  facilityType,
  location,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter facilities based on search criteria
  const filteredFacilities = mockFacilities.filter((facility) => {
    if (facilityType && facility.type !== facilityType) return false;
    if (location && facility.location !== location) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="p-0">
              <Skeleton className="h-48 rounded-t-lg" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredFacilities.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No facilities found</h3>
        <p className="text-muted-foreground mt-2">
          Try changing your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFacilities.map((facility) => (
        <Card key={facility.id} className="overflow-hidden flex flex-col">
          <div className="h-48 overflow-hidden">
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>
          <CardHeader>
            <CardTitle>{facility.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">{facility.description}</p>
            <div className="flex items-center gap-2 mt-4">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Next available:{" "}
                {format(facility.nextAvailable, "EEE, MMM d, h:mm a")}
              </span>
            </div>
            <p className="text-sm mt-2">Capacity: {facility.capacity} people</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => window.location.href = `/facilities/${facility.id}`}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FacilityList;
