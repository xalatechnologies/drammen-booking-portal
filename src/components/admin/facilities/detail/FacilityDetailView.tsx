
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  facility: any;
  onBack: () => void;
  onEdit: () => void;
  onCalendar: () => void;
}

export const FacilityDetailView: React.FC<FacilityDetailViewProps> = ({
  facility,
  onBack,
  onEdit,
  onCalendar
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full space-y-4 p-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{facility.name}</h1>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {facility.address_street}, {facility.address_city}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onCalendar}>
            <Calendar className="w-4 h-4 mr-1" />
            Calendar
          </Button>
          <Button size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <Badge
                  variant={facility.status === 'active' ? 'default' : 
                          facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {facility.status}
                </Badge>
              </div>
              <Settings className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Capacity</p>
                <p className="text-lg font-bold">{facility.capacity}</p>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Price/Hour</p>
                <p className="text-lg font-bold">{facility.price_per_hour} NOK</p>
              </div>
              <Euro className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Time Slots</p>
                <p className="text-lg font-bold">{facility.time_slot_duration}h</p>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs with Better Spacing */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-10">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="zones" className="text-xs">Zones</TabsTrigger>
          <TabsTrigger value="hours" className="text-xs">Hours</TabsTrigger>
          <TabsTrigger value="images" className="text-xs">Images</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="overview" className="space-y-4 mt-0">
            <FacilityBasicInfo facility={facility} />
          </TabsContent>

          <TabsContent value="zones" className="space-y-4 mt-0">
            <FacilityZonesSection facility={facility} />
          </TabsContent>

          <TabsContent value="hours" className="space-y-4 mt-0">
            <FacilityOpeningHours facility={facility} />
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-0">
            <FacilityImageGallery facility={facility} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-0">
            <FacilityAnalytics facility={facility} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-0">
            <FacilitySettingsSection facility={facility} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
