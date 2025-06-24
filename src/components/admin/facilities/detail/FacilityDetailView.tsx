
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FacilityBasicInfo } from './sections/FacilityBasicInfo';
import { FacilityImageGallery } from './sections/FacilityImageGallery';
import { FacilityOpeningHours } from './sections/FacilityOpeningHours';
import { FacilityZonesSection } from './sections/FacilityZonesSection';
import { FacilityAnalytics } from './sections/FacilityAnalytics';
import { FacilitySettingsSection } from './sections/FacilitySettingsSection';
import { Facility } from '@/types/facility';

interface FacilityDetailViewProps {
  facility: Facility;
}

export function FacilityDetailView({ facility }: FacilityDetailViewProps) {
  // Transform facility opening hours to match expected interface
  const transformedOpeningHours = facility.openingHours?.map(hour => ({
    id: hour.id || `${hour.day_of_week}-${hour.open_time}`,
    dayOfWeek: hour.day_of_week || 0,
    openTime: hour.open_time || '09:00',
    closeTime: hour.close_time || '17:00',
    isOpen: hour.is_open ?? true
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{facility.name}</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <FacilityBasicInfo facility={facility} />
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <FacilityImageGallery facilityId={facility.id} images={facility.images} />
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <FacilityOpeningHours facility={{ id: facility.id, openingHours: transformedOpeningHours }} />
        </TabsContent>

        <TabsContent value="zones" className="space-y-6">
          <FacilityZonesSection facility={{ id: facility.id, zones: facility.zones }} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FacilityAnalytics facility={{ id: facility.id }} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <FacilitySettingsSection facility={facility} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
