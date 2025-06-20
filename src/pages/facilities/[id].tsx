
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import { Zone } from "@/components/booking/types";
import { useFacility } from "@/hooks/useFacility";
import { useZones } from "@/hooks/useZones";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { CartProvider } from "@/contexts/CartContext";
import { MobileBookingPanel } from "@/components/facility/MobileBookingPanel";
import { convertZoneToBookingZone } from "@/utils/zoneConverter";
import { FacilityDetailBreadcrumb } from "@/components/facility/detail/FacilityDetailBreadcrumb";
import { FacilityDetailLayout } from "@/components/facility/detail/FacilityDetailLayout";
import { FacilityDetailCalendar } from "@/components/facility/detail/FacilityDetailCalendar";
import { LoadingState, ErrorState } from "@/components/facility/detail/FacilityDetailStates";
import { useTranslation } from "@/i18n";

const FacilityDetail = () => {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const { t } = useTranslation();
  const { facility, isLoading, error, notFound } = useFacility(Number(id));
  const { data: zones = [], isLoading: zonesLoading } = useZones(id);

  // Use the centralized slot selection hook
  const {
    selectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  } = useSlotSelection();

  // State for availability tab patterns
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

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    console.log('FacilityDetail: handleRemoveSlot called:', { zoneId, date, timeSlot });
    // This will be handled by the individual slot click since we're removing
    handleSlotClick(zoneId, date, timeSlot, 'available');
  };

  const handleClearSlots = () => {
    console.log('FacilityDetail: handleClearSlots called');
    clearSelection();
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

  // Convert opening hours to string format for MobileBookingPanel
  const formatOpeningHours = (openingHours: any) => {
    if (typeof openingHours === 'string') return openingHours;
    if (Array.isArray(openingHours)) {
      // Convert to a simple string representation
      const weekdays = openingHours.filter(h => h.dayOfWeek >= 1 && h.dayOfWeek <= 5);
      const weekends = openingHours.filter(h => h.dayOfWeek === 0 || h.dayOfWeek === 6);
      
      if (weekdays.length > 0 && weekends.length > 0) {
        return `Man-Fre: ${weekdays[0].opens}-${weekdays[0].closes}, Lør-Søn: ${weekends[0].opens}-${weekends[0].closes}`;
      } else if (weekdays.length > 0) {
        return `Man-Fre: ${weekdays[0].opens}-${weekdays[0].closes}`;
      }
    }
    return "Se detaljer";
  };

  // Loading state
  if (isLoading || zonesLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || notFound) {
    return <ErrorState error={error} notFound={notFound} />;
  }

  // Success state with facility data
  if (!facility) return null;

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalHeader />

        {/* Breadcrumb Navigation */}
        <FacilityDetailBreadcrumb facilityName={facility.name} />

        {/* Main Content */}
        <div className="flex-grow pb-20 lg:pb-0">
          <FacilityDetailLayout 
            facility={facility}
            zones={displayZones}
            onShare={handleShare}
            isFavorited={isFavorited}
            onToggleFavorite={() => setIsFavorited(!isFavorited)}
          />

          {/* Full Width Calendar Section - Updated with Unified Booking Form */}
          <FacilityDetailCalendar 
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

        {/* Mobile Booking Panel */}
        <MobileBookingPanel 
          facilityName={facility.name} 
          facilityId={id || ""} 
          capacity={facility.capacity} 
          area={facility.area} 
          openingHours={formatOpeningHours(facility.openingHours)} 
        />
      </div>
    </CartProvider>
  );
};

export default FacilityDetail;
