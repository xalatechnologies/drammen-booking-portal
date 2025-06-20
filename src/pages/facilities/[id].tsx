
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { AirBnbStyleGallery } from "@/components/facility/AirBnbStyleGallery";
import { FacilityHeader } from "@/components/facility/FacilityHeader";
import { FacilityInfoTabs } from "@/components/facility/FacilityInfoTabs";
import { FacilityContactInfo } from "@/components/facility/FacilityContactInfo";
import { AvailabilityTab } from "@/components/facility/tabs/AvailabilityTab";
import { SimilarFacilitiesSlider } from "@/components/facility/SimilarFacilitiesSlider";
import { Zone } from "@/components/booking/types";
import { useOptimizedFacility } from "@/hooks/useOptimizedFacility";
import { useZones } from "@/hooks/useZones";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n";
import { CartProvider } from "@/contexts/CartContext";
import { MobileBookingPanel } from "@/components/facility/MobileBookingPanel";
import { convertZoneToBookingZone } from "@/utils/zoneConverter";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const { t } = useTranslation();
  const { facility, isLoading, error, notFound } = useOptimizedFacility(Number(id));
  const { data: zones = [], isLoading: zonesLoading } = useZones(id);

  // State for availability tab
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [currentPattern, setCurrentPattern] = useState<any>({});

  // Default zone if no zones are returned from the API
  const defaultZone: Zone = {
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
  };

  // Use real zones if available, otherwise fall back to default
  const convertedZones = zones.length > 0 ? zones.map(convertZoneToBookingZone) : [defaultZone];
  const displayZones = convertedZones;

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = selectedSlots.some(slot => 
      slot.zoneId === zoneId &&
      slot.date.toDateString() === date.toDateString() &&
      slot.timeSlot === timeSlot
    );

    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(slot => 
        !(slot.zoneId === zoneId &&
          slot.date.toDateString() === date.toDateString() &&
          slot.timeSlot === timeSlot)
      ));
    } else {
      setSelectedSlots([...selectedSlots, { 
        zoneId, 
        date, 
        timeSlot,
        duration: 2 // Default 2 hours duration
      }]);
    }
  };

  const handleBulkSlotSelection = (slots: any[]) => {
    setSelectedSlots(prev => [...prev, ...slots]);
  };

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    setSelectedSlots(selectedSlots.filter(slot => 
      !(slot.zoneId === zoneId &&
        slot.date.toDateString() === date.toDateString() &&
        slot.timeSlot === timeSlot)
    ));
  };

  const handleClearSlots = () => {
    setSelectedSlots([]);
  };

  const handlePatternApply = (pattern: any) => {
    setCurrentPattern(pattern);
  };

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
  if (isLoading || zonesLoading) {
    return <CartProvider>
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
      </CartProvider>;
  }

  // Error state
  if (error || notFound) {
    return <CartProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <GlobalHeader />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {notFound ? "Lokale ikke funnet" : "Feil ved lasting"}
              </h1>
              <p className="text-gray-600 mb-8">
                {notFound ? "Det forespurte lokalet kunne ikke finnes." : "Det oppstod en feil ved lasting av lokalet."}
              </p>
              <Button onClick={() => navigate("/")} className="mb-4">
                <Home className="h-4 w-4 mr-2" />
                Tilbake til forsiden
              </Button>
            </div>
          </div>
          <GlobalFooter />
        </div>
      </CartProvider>;
  }

  // Success state with facility data
  if (!facility) return null;
  return <CartProvider>
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
        <div className="flex-grow pb-20 lg:pb-0">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Full Width Gallery Section */}
            <div className="w-full mb-8">
              <AirBnbStyleGallery images={[facility.image, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop"]} facilityName={facility.name} />
            </div>

            {/* Facility Header - Title, Tags, Address */}
            <div className="mb-8">
              <FacilityHeader name={facility.name} address={facility.address} onShare={handleShare} isFavorited={isFavorited} onToggleFavorite={() => setIsFavorited(!isFavorited)} />
            </div>

            {/* Main Content Layout - 70% / 30% */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-12">
              {/* Left Column - Tabs Content (70%) */}
              <div className="lg:col-span-7 space-y-6">
                <FacilityInfoTabs description={facility.description} capacity={facility.capacity} equipment={facility.equipment || []} zones={displayZones} amenities={facility.amenities || []} address={facility.address} area={facility.area} suitableFor={facility.suitableFor || []} facilityId={id} facilityName={facility.name} />
              </div>

              {/* Right Column - Contact Info Sidebar (30%) */}
              <div className="lg:col-span-3 hidden lg:block">
                <div className="sticky top-6">
                  <FacilityContactInfo facilityName={facility.name} address={facility.address} openingHours={facility.openingHours} capacity={facility.capacity} area={facility.area} />
                </div>
              </div>
            </div>

            {/* Full Width Calendar Section - Updated with Unified Booking Form */}
            <div className="w-full mb-12">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Tilgjengelighet og booking</h2>
                <AvailabilityTab 
                  zones={displayZones} 
                  selectedSlots={selectedSlots}
                  onSlotClick={handleSlotClick}
                  onBulkSlotSelection={handleBulkSlotSelection}
                  onClearSlots={handleClearSlots}
                  onRemoveSlot={handleRemoveSlot}
                  facilityId={id || ""} 
                  facilityName={facility.name}
                  currentPattern={currentPattern}
                  onPatternChange={setCurrentPattern}
                  onPatternApply={handlePatternApply}
                  timeSlotDuration={facility.timeSlotDuration || 1}
                />
              </div>
            </div>

            {/* Similar Facilities Section */}
            <div className="mt-12">
              <SimilarFacilitiesSlider currentFacilityId={id || ""} />
            </div>
          </div>
        </div>

        {/* Mobile Booking Panel */}
        <MobileBookingPanel facilityName={facility.name} facilityId={id || ""} capacity={facility.capacity} area={facility.area} openingHours={facility.openingHours} />

        <GlobalFooter />
      </div>
    </CartProvider>;
};

export default FacilityDetail;
