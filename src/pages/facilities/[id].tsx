
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { AirBnbStyleGallery } from "@/components/facility/AirBnbStyleGallery";
import { FacilityHeader } from "@/components/facility/FacilityHeader";
import { FacilityInfoTabs } from "@/components/facility/FacilityInfoTabs";
import { PersistentBookingSidebar } from "@/components/facility/PersistentBookingSidebar";
import { SimilarFacilitiesSlider } from "@/components/facility/SimilarFacilitiesSlider";
import { AvailabilityTab } from "@/components/facility/tabs/AvailabilityTab";
import { Zone } from "@/components/booking/types";
import { useOptimizedFacility } from "@/hooks/useOptimizedFacility";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n";
import { CartProvider } from "@/contexts/CartContext";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const { t } = useTranslation();

  const { facility, isLoading, error, notFound } = useOptimizedFacility(Number(id));

  // Enhanced zones with full zone management capabilities
  const zones: Zone[] = [{
    id: "whole-facility",
    name: t('facility.booking.wholeVenue'),
    capacity: facility?.capacity || 30,
    equipment: facility?.equipment || ["Projektor", "Lydanlegg", "Whiteboard"],
    pricePerHour: facility?.pricePerHour || 450,
    description: t('facility.booking.wholeVenueDescription'),
    area: facility?.area || "120 m²",
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
      specialInstructions: t('facility.booking.mainZoneInstructions'),
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
  }];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: facility?.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <CartProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <GlobalHeader />
          <div className="flex-grow">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <div className="space-y-6">
                <Skeleton className="h-96 w-full rounded-lg" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-96 w-full rounded-lg" />
                  </div>
                  <div className="lg:col-span-1">
                    <Skeleton className="h-80 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <GlobalFooter />
        </div>
      </CartProvider>
    );
  }

  // Error state
  if (error || notFound) {
    return (
      <CartProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <GlobalHeader />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {notFound ? "Lokale ikke funnet" : "Feil ved lasting"}
              </h1>
              <p className="text-gray-600 mb-8">
                {notFound 
                  ? "Det forespurte lokalet kunne ikke finnes."
                  : "Det oppstod en feil ved lasting av lokalet."
                }
              </p>
              <Button onClick={() => navigate("/")} className="mb-4">
                <Home className="h-4 w-4 mr-2" />
                Tilbake til forsiden
              </Button>
            </div>
          </div>
          <GlobalFooter />
        </div>
      </CartProvider>
    );
  }

  // Success state with facility data
  if (!facility) return null;

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalHeader />

        {/* Breadcrumb Navigation */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* AirBnB-Style Image Gallery */}
                <AirBnbStyleGallery 
                  images={[
                    facility.image,
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop"
                  ]} 
                  facilityName={facility.name}
                />

                {/* Facility Header */}
                <FacilityHeader 
                  name={facility.name} 
                  address={facility.address} 
                  onShare={handleShare} 
                  isFavorited={isFavorited} 
                  onToggleFavorite={() => setIsFavorited(!isFavorited)} 
                />

                {/* Main Calendar - Primary Feature */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Tilgjengelighet og booking</h2>
                      <div className="text-sm text-gray-500">
                        Velg tidspunkt for å booke
                      </div>
                    </div>
                    <AvailabilityTab 
                      zones={zones} 
                      startDate={new Date()} 
                      showLegend={true}
                      facilityId={id}
                      facilityName={facility.name}
                    />
                  </div>
                </div>

                {/* Facility Info Tabs */}
                <FacilityInfoTabs 
                  description={facility.description} 
                  capacity={facility.capacity} 
                  equipment={facility.equipment || []} 
                  zones={zones} 
                  amenities={facility.amenities || []} 
                  address={facility.address}
                  openingHours={facility.openingHours}
                  area={facility.area}
                  hasAutoApproval={facility.hasAutoApproval || true}
                  zoneCards={<></>} 
                />
              </div>

              {/* Right Column - Persistent Booking Panel (1/3 width) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <PersistentBookingSidebar
                    facilityName={facility.name}
                    facilityId={id || ""}
                    capacity={facility.capacity}
                    area={facility.area}
                    openingHours={facility.openingHours}
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
    </CartProvider>
  );
};

export default FacilityDetail;
