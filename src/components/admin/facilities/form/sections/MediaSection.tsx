import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityImageManagement } from '../../FacilityImageManagement';
import { VideoManagement } from './media/VideoManagement';
import { VirtualTourManagement } from './media/VirtualTourManagement';
import { DocumentManagement } from './media/DocumentManagement';
import { useTranslation } from "@/hooks/useTranslation";

interface MediaSectionProps {
  facilityId: string | number;
}

/**
 * MediaSection component that manages all media-related content for a facility
 * Following Single Responsibility Principle by delegating specific media types
 * to specialized components
 */
export const MediaSection: React.FC<MediaSectionProps> = ({ facilityId }) => {
  const { tSync } = useTranslation();
  const facilityIdNum = typeof facilityId === 'string' ? parseInt(facilityId) : facilityId;

  // Don't try to load media for new facilities
  const isNewFacility = facilityId === 'new';

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-lg font-semibold mb-2">
          {tSync("admin.facility.media.title", "Media Management")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {tSync("admin.facility.media.description", "Manage images, videos, virtual tours, and documents for this facility.")}
        </p>
      </div>

      {isNewFacility ? (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          {tSync("admin.facility.media.saveFirst", "Please save the facility first to enable media management.")}
        </div>
      ) : (
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="images">
              {tSync("admin.facility.media.tabs.images", "Images")}
            </TabsTrigger>
            <TabsTrigger value="videos">
              {tSync("admin.facility.media.tabs.videos", "Videos")}
            </TabsTrigger>
            <TabsTrigger value="virtualTours">
              {tSync("admin.facility.media.tabs.virtualTours", "Virtual Tours")}
            </TabsTrigger>
            <TabsTrigger value="documents">
              {tSync("admin.facility.media.tabs.documents", "Documents")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            <FacilityImageManagement facilityId={facilityIdNum} />
          </TabsContent>
          
          <TabsContent value="videos">
            <VideoManagement facilityId={facilityIdNum} />
          </TabsContent>
          
          <TabsContent value="virtualTours">
            <VirtualTourManagement facilityId={facilityIdNum} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentManagement facilityId={facilityIdNum} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
