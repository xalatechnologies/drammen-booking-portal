import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FacilityImageGallery } from "@/components/facility/FacilityImageGallery";
import { FacilityHeader } from "@/components/facility/FacilityHeader";
import { FacilityInfoTabs } from "@/components/facility/FacilityInfoTabs";
import { EnhancedFacilitySidebar } from "@/components/facility/EnhancedFacilitySidebar";
import { SimilarFacilitiesSlider } from "@/components/facility/SimilarFacilitiesSlider";
import { Zone } from "@/components/booking/types";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Enhanced zones with full zone management capabilities
  const zones: Zone[] = [{
    id: "whole-facility",
    name: "Hele lokalet",
    capacity: 30,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Sportsutstyr", "Basketkurver", "Volleyballnett", "Håndballmål"],
    pricePerHour: 450,
    description: "Komplett gymsal med full tilgang til alt utstyr og alle soner",
    area: "120 m²",
    isMainZone: true,
    subZones: ["zone-1", "zone-2"],
    bookingRules: {
      minBookingDuration: 2,
      maxBookingDuration: 8,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: 48
    },
    adminInfo: {
      contactPersonName: "Lars Hansen",
      contactPersonEmail: "lars.hansen@drammen.kommune.no",
      specialInstructions: "Hele lokalet inkluderer begge soner og all tilgjengelig utstyr. Perfekt for store arrangementer og turneringer.",
      maintenanceSchedule: [{
        day: "Mandag",
        startTime: "06:00",
        endTime: "08:00"
      }]
    },
    layout: {
      coordinates: {
        x: 0,
        y: 0,
        width: 120,
        height: 80
      },
      entryPoints: ["Hovedinngang", "Utstyrsinngaang", "Nødutgang vest"]
    },
    accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
    features: ["Klimaanlegg", "Moderne lyd", "LED-belysning", "Sikkerhetskameraer"],
    isActive: true
  }, {
    id: "zone-1",
    name: "Sone A (Nord)",
    capacity: 15,
    equipment: ["Lydanlegg", "Basketkurv", "Håndballmål"],
    pricePerHour: 250,
    description: "Nordre del av gymsalen med basketbane og håndballfelt",
    area: "60 m²",
    parentZoneId: "whole-facility",
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 6,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
      bookingTypes: ['one-time', 'recurring'],
      advanceBookingDays: 60,
      cancellationHours: 24
    },
    adminInfo: {
      contactPersonName: "Maria Olsen",
      contactPersonEmail: "maria.olsen@drammen.kommune.no",
      specialInstructions: "Egnet for mindre ballsportaktiviteter og gruppetrening.",
      maintenanceSchedule: [{
        day: "Tirsdag",
        startTime: "07:00",
        endTime: "08:00"
      }]
    },
    layout: {
      coordinates: {
        x: 0,
        y: 0,
        width: 60,
        height: 80
      },
      entryPoints: ["Hovedinngang", "Nord-inngang"]
    },
    accessibility: ["wheelchair", "hearing-loop"],
    features: ["Delvis klimaanlegg", "God ventilasjon"],
    isActive: true
  }, {
    id: "zone-2",
    name: "Sone B (Sør)",
    capacity: 15,
    equipment: ["Projektor", "Whiteboard", "Volleyballnett", "Presentasjonsutstyr"],
    pricePerHour: 280,
    description: "Søndre del av gymsalen med volleyballbane og presentasjoner",
    area: "60 m²",
    parentZoneId: "whole-facility",
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 6,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
      bookingTypes: ['one-time', 'recurring'],
      advanceBookingDays: 60,
      cancellationHours: 24
    },
    adminInfo: {
      contactPersonName: "Erik Nordahl",
      contactPersonEmail: "erik.nordahl@drammen.kommune.no",
      specialInstructions: "Perfekt for volleyball, badminton og presentasjoner. Har avansert AV-utstyr.",
      maintenanceSchedule: [{
        day: "Onsdag",
        startTime: "07:00",
        endTime: "08:00"
      }]
    },
    layout: {
      coordinates: {
        x: 60,
        y: 0,
        width: 60,
        height: 80
      },
      entryPoints: ["Hovedinngang", "Sør-inngang"]
    },
    accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
    features: ["Avansert AV-utstyr", "Fleksibel belysning", "Akustikk optimaliseret"],
    restrictions: ["Ingen mat eller drikke", "Kun innendørssko"],
    isActive: true
  }];

  // Mock facility data with zones - in a real app this would be fetched based on id
  const facility = {
    id,
    name: `Gymsal ${id} - Brandengen skole`,
    address: "Knoffs gate 8, Drammen",
    capacity: 30,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Sportsutstyr", "Basketkurver", "Volleyballnett", "Håndballmål"],
    description: "Dette er en moderne gymsal på Brandengen skole, perfekt for idrettsaktiviteter, trening og mindre arrangementer. Salen er utstyrt med standard sportsutstyr og har god ventilasjon. Lokalet har nylig blitt renovert med moderne lyd- og lyssystemer. Gymsalen har parkett gulv av høy kvalitet som er egnet for alle typer ballsport og dans. Det er også installert moderne ventilasjonsanlegg som sikrer god luftkvalitet under intensive aktiviteter.",
    images: ["/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png", "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.8,
    reviewCount: 124,
    pricePerHour: 450,
    area: "120 m²",
    accessibility: ["wheelchair", "hearing-loop"],
    amenities: ["Parkering", "Wi-Fi", "Garderober", "Dusjer", "Kafeteria", "Førstehjelpsutstyr", "Brannsikkerhet", "Sikkerhetskameraer"],
    openingHours: "Man-Søn: 06:00-23:00",
    zones: zones,
    hasAutoApproval: true,
    availableTimes: [{
      date: new Date(),
      slots: [{
        start: "08:00",
        end: "10:00",
        available: true
      }, {
        start: "10:00",
        end: "12:00",
        available: false
      }, {
        start: "12:00",
        end: "14:00",
        available: true
      }, {
        start: "14:00",
        end: "16:00",
        available: true
      }, {
        start: "16:00",
        end: "18:00",
        available: false
      }, {
        start: "18:00",
        end: "20:00",
        available: true
      }, {
        start: "20:00",
        end: "22:00",
        available: true
      }]
    }, {
      date: new Date(Date.now() + 86400000),
      slots: [{
        start: "08:00",
        end: "10:00",
        available: true
      }, {
        start: "10:00",
        end: "12:00",
        available: true
      }, {
        start: "12:00",
        end: "14:00",
        available: true
      }, {
        start: "14:00",
        end: "16:00",
        available: false
      }, {
        start: "16:00",
        end: "18:00",
        available: true
      }, {
        start: "18:00",
        end: "20:00",
        available: false
      }, {
        start: "20:00",
        end: "22:00",
        available: true
      }]
    }, {
      date: new Date(Date.now() + 172800000),
      slots: [{
        start: "08:00",
        end: "10:00",
        available: true
      }, {
        start: "10:00",
        end: "12:00",
        available: true
      }, {
        start: "12:00",
        end: "14:00",
        available: true
      }, {
        start: "14:00",
        end: "16:00",
        available: true
      }, {
        start: "16:00",
        end: "18:00",
        available: true
      }, {
        start: "18:00",
        end: "20:00",
        available: true
      }, {
        start: "20:00",
        end: "22:00",
        available: true
      }]
    }]
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookingClick = () => {
    const bookingPath = `/booking/${id}`;
    navigate(bookingPath);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-1" />
              Hjem
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{facility.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* Image Gallery */}
            <FacilityImageGallery images={facility.images} />

            {/* Header */}
            <div className="flex-1">
              <FacilityHeader name={facility.name} address={facility.address} onShare={handleShare} isFavorited={isFavorited} onToggleFavorite={() => setIsFavorited(!isFavorited)} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Facts */}
                <FacilityInfoTabs 
                  description={facility.description} 
                  capacity={facility.capacity} 
                  equipment={facility.equipment} 
                  zones={zones} 
                  amenities={facility.amenities} 
                  address={facility.address} 
                  quickFacts={<></>} 
                  zoneCards={<></>} 
                />
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <EnhancedFacilitySidebar 
                  zones={zones} 
                  facilityName={facility.name} 
                  facilityId={id} 
                  hasAutoApproval={facility.hasAutoApproval} 
                  openingHours={facility.openingHours} 
                  onShare={handleShare} 
                  onToggleFavorite={() => setIsFavorited(!isFavorited)} 
                  isFavorited={isFavorited} 
                />
              </div>
            </div>
          </div>

          {/* Similar Facilities Section */}
          <div className="mt-12">
            <SimilarFacilitiesSlider currentFacilityId={id || ""} />
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default FacilityDetail;
