
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

// This would typically come from Supabase
const mockFacilities = [
  {
    id: "1",
    name: "Drammen Sports Hall",
    description: "A large sports facility with multiple courts. Ideal for basketball, volleyball, handball, and other indoor sports. The facility includes changing rooms, showers, and basic equipment storage.",
    type: "sports-hall",
    location: "central",
    images: [
      "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542652735873-fb2825bac6e2?w=800&auto=format&fit=crop",
    ],
    amenities: ["Changing Rooms", "Showers", "Equipment Storage", "WiFi", "Parking"],
    capacity: 200,
  },
  {
    id: "2",
    name: "Konnerud Community Center",
    description: "Modern meeting facilities for local groups and organizations. Perfect for workshops, seminars, and community gatherings with modern AV equipment and flexible seating arrangements.",
    type: "meeting-room",
    location: "konnerud",
    images: [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&auto=format&fit=crop",
    ],
    amenities: ["Projector", "Sound System", "Whiteboard", "Coffee Machine", "WiFi"],
    capacity: 30,
  },
  {
    id: "3",
    name: "Åssiden School Auditorium",
    description: "Perfect for presentations and performances with professional lighting and sound systems. The auditorium features comfortable seating and excellent acoustics for concerts and theatrical productions.",
    type: "auditorium",
    location: "aassiden",
    images: [
      "https://images.unsplash.com/photo-1596194081696-4bab3a813b63?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop",
    ],
    amenities: ["Stage", "Professional Lighting", "Sound System", "Backstage Area", "Seating for 150"],
    capacity: 150,
  },
  {
    id: "4",
    name: "Gulskogen Gymnasium",
    description: "Fully equipped sports facility for multiple activities including gymnastics, fitness classes, and sports training. Includes various equipment for different sports activities.",
    type: "gym",
    location: "gulskogen",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop",
    ],
    amenities: ["Exercise Equipment", "Changing Rooms", "Showers", "Drinking Fountains", "First Aid Kit"],
    capacity: 100,
  },
];

const FacilityDetail = () => {
  const { id } = useParams();
  const facility = mockFacilities.find((f) => f.id === id);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Facility Not Found</h2>
          <p className="mb-6">The facility you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Facility details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">{facility.name}</h1>

          {/* Image gallery */}
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden mb-4">
              <img
                src={facility.images[selectedImage]}
                alt={`${facility.name} - view ${selectedImage + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {facility.images.map((img, i) => (
                <div
                  key={i}
                  className={`cursor-pointer h-20 w-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === i
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img
                    src={img}
                    alt={`${facility.name} thumbnail ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About this Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{facility.description}</p>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="capitalize">{facility.type.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>{" "}
                    <span className="capitalize">{facility.location}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>{" "}
                    <span>{facility.capacity} people</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {facility.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Booking calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Check Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              
              <Button className="w-full">
                <CalendarIcon className="mr-2 h-4 w-4" /> Book This Facility
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Select a date and time to proceed with booking
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail;
