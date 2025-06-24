import React from 'react';
import { useFacilityAdminStore } from '@/stores/useFacilityAdminStore';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Euro, 
  Settings, 
  Image as ImageIcon,
  BarChart3
} from "lucide-react";
import { FacilityBasicInfo } from "./sections/FacilityBasicInfo";
import { FacilityZonesSection } from "./sections/FacilityZonesSection";
import { FacilityOpeningHours } from "./sections/FacilityOpeningHours";
import { FacilityImageGallery } from "./sections/FacilityImageGallery";
import { FacilityAnalytics } from "./sections/FacilityAnalytics";
import { FacilitySettingsSection } from "./sections/FacilitySettingsSection";

interface FacilityDetailViewProps {
  facility?: any; // fallback for direct prop, but prefer store
  onBack: () => void;
  onEdit: () => void;
  onCalendar: () => void;
}

export const FacilityDetailView: React.FC<FacilityDetailViewProps> = ({ facility: propFacility, onBack, onEdit, onCalendar }) => {
  const { tSync } = useTranslation();
  const { currentFacility } = useFacilityAdminStore();
  const facility = propFacility || currentFacility;

  if (!facility) {
    return <div className="text-center py-8 text-gray-500">{tSync('admin.facilities.detail.noFacility', 'No facility selected.')}</div>;
  }

  return (
    <div className="w-full px-8 p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{facility.name}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onBack}>{tSync('admin.facilities.actions.back', 'Back')}</Button>
          <Button size="sm" variant="outline" onClick={onCalendar}>{tSync('admin.facilities.actions.calendar', 'Calendar')}</Button>
          <Button size="sm" onClick={onEdit}>{tSync('admin.facilities.actions.edit', 'Edit')}</Button>
        </div>
      </div>
      <div className="mb-2 text-gray-600">{facility.type}</div>
      <div className="mb-2 text-gray-500 text-sm">{facility.area}</div>
      <div className="mb-2 text-gray-500 text-sm">{facility.status}</div>
      <div className="mb-2 text-gray-500 text-sm">{facility.description}</div>
      {/* Add more facility details as needed */}
    </div>
  );
};
