
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FacilityImageGallery } from "@/components/facility/FacilityImageGallery";
import { FacilityHeader } from "@/components/facility/FacilityHeader";
import { FacilityInfoTabs } from "@/components/facility/FacilityInfoTabs";
import { EnhancedFacilitySidebar } from "@/components/facility/EnhancedFacilitySidebar";
import { SimilarFacilitiesSlider } from "@/components/facility/SimilarFacilitiesSlider";
import { AvailabilityTab } from "@/components/facility/tabs/AvailabilityTab";
import { LocalizationTestComprehensive } from "@/components/localization/LocalizationTestComprehensive";
import { Zone } from "@/components/booking/types";
import { useQuery } from "@tanstack/react-query";
import { LocalizedFacilityService } from "@/services/LocalizedFacilityService";
import { useLocalizedServices } from "@/hooks/useLocalizedServices";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showLocalizationTest, setShowLocalizationTest] = useState(false);
  const { t } = useTranslation();

  // Ensure localized services are properly initialized
  useLocalizedServices();

  const { data: facilityResponse, isLoading, error } = useQuery({
    queryKey: ['facility', id],
    queryFn: () => LocalizedFacilityService.getFacilityById(Number(id)),
    enabled: !!id
  });

  const facility = facilityResponse?.success ? facilityResponse.data : null;
  const notFound = facilityResponse?.success === false && facilityResponse.error?.message?.includes('not found');

  // Enhanced zones with full zone management capabilities
  const zones: Zone[] = [{
    id: "whole-facility",
    name: t('facility.zones.wholeVenue'),
    capacity: facility?.capacity || 30,
    equipment: facility?.equipment || [t('common.equipment.projector'), t('common.equipment.sound'), t('common.equipment.whiteboard')],
    pricePerHour: facility?.pricePerHour || 450,
    description: t('facility.zones.wholeVenueDescription'),
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
      specialInstructions: t('facility.zones.mainZoneInstructions'),
      maintenanceSchedule: [{
        day: t('common.weekdays.monday'),
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
      entryPoints: [t('common.entrances.main'), t('common.entrances.equipment'), t('common.entrances.emergency')]
    },
    accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
    features: [t('common.features.airConditioning'), t('common.features.modernSound'), t('common.features.ledLighting'), t('common.features.securityCameras')],
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

  const handleBookingClick = () => {
    const bookingPath = `/booking/${id}`;
    navigate(bookingPath);
  };

  // Show localization test in development mode
  if (showLocalizationTest) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalHeader />
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-6">
            <Button 
              onClick={() => setShowLocalizationTest(false)}
              variant="outline"
              className="mb-4"
            >
              ← {t('common.actions.back')}
            </Button>
            <LocalizationTestComprehensive />
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
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
    );
  }

  // Error state
  if (error || notFound) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {notFound ? t('facility.errors.notFound') : t('facility.errors.loadError')}
            </h1>
            <p className="text-gray-600 mb-8">
              {notFound 
                ? t('facility.errors.notFoundDescription')
                : t('facility.errors.loadErrorDescription')
              }
            </p>
            <Button onClick={() => navigate("/")} className="mb-4">
              <Home className="h-4 w-4 mr-2" />
              {t('common.navigation.backToHome')}
            </Button>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  // Success state with facility data
  if (!facility) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-1" />
              {t('common.navigation.home')}
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{facility.name}</span>
            {/* Development localization test button */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <span className="text-gray-400">/</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowLocalizationTest(true)}
                  className="text-blue-600 hover:text-blue-900 p-0 h-auto font-normal"
                >
                  🌍 {t('common.debug.testLocalization')}
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* Image Gallery */}
            <FacilityImageGallery images={[facility.image]} />

            {/* Header */}
            <div className="flex-1">
              <FacilityHeader 
                name={facility.name} 
                address={facility.address} 
                onShare={handleShare} 
                isFavorited={isFavorited} 
                onToggleFavorite={() => setIsFavorited(!isFavorited)} 
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Facility Info Tabs */}
                <FacilityInfoTabs 
                  description={facility.description} 
                  capacity={facility.capacity} 
                  equipment={facility.equipment || []} 
                  zones={zones} 
                  amenities={facility.amenities || []} 
                  address={facility.address} 
                  zoneCards={<></>} 
                />
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <EnhancedFacilitySidebar 
                  facilityName={facility.name} 
                  facilityId={id} 
                  hasAutoApproval={facility.hasAutoApproval || true} 
                  openingHours={facility.openingHours} 
                  capacity={facility.capacity}
                  area={facility.area}
                  zoneCount={zones.length}
                  onShare={handleShare} 
                  onToggleFavorite={() => setIsFavorited(!isFavorited)} 
                  isFavorited={isFavorited} 
                />
              </div>
            </div>

            {/* Enhanced Availability Calendar Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('facility.availability.title')}</h2>
                <AvailabilityTab 
                  zones={zones} 
                  startDate={new Date()} 
                  showLegend={true}
                  facilityId={id}
                  facilityName={facility.name}
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
