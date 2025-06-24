
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
    <div className="w-full space-y-3 p-3">
      {/* Ultra Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onBack} className="h-8 px-3">
            <ArrowLeft className="w-3 h-3 mr-1" />
            <span className="text-xs">Back</span>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{facility.name}</h1>
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-1" />
              {facility.address_street}, {facility.address_city}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={onCalendar} className="h-8 px-3">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="text-xs">Calendar</span>
          </Button>
          <Button size="sm" onClick={onEdit} className="h-8 px-3">
            <Edit className="w-3 h-3 mr-1" />
            <span className="text-xs">Edit</span>
          </Button>
        </div>
      </div>

      {/* Ultra Compact Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Status</p>
                <Badge
                  variant={facility.status === 'active' ? 'default' : 
                          facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                  className="text-xs px-1 py-0 h-4"
                >
                  {facility.status}
                </Badge>
              </div>
              <Settings className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Capacity</p>
                <p className="text-sm font-bold">{facility.capacity}</p>
              </div>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Price/Hour</p>
                <p className="text-sm font-bold">{facility.price_per_hour} NOK</p>
              </div>
              <Euro className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Time Slots</p>
                <p className="text-sm font-bold">{facility.time_slot_duration}h</p>
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-8">
          <TabsTrigger value="overview" className="text-xs py-1">Overview</TabsTrigger>
          <TabsTrigger value="zones" className="text-xs py-1">Zones</TabsTrigger>
          <TabsTrigger value="hours" className="text-xs py-1">Hours</TabsTrigger>
          <TabsTrigger value="images" className="text-xs py-1">Images</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs py-1">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs py-1">Settings</TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent value="overview" className="space-y-3 mt-0">
            <FacilityBasicInfo facility={facility} />
          </TabsContent>

          <TabsContent value="zones" className="space-y-3 mt-0">
            <FacilityZonesSection facility={facility} />
          </TabsContent>

          <TabsContent value="hours" className="space-y-3 mt-0">
            <FacilityOpeningHours facility={facility} />
          </TabsContent>

          <TabsContent value="images" className="space-y-3 mt-0">
            <FacilityImageGallery facility={facility} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-3 mt-0">
            <FacilityAnalytics facility={facility} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-3 mt-0">
            <FacilitySettingsSection facility={facility} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
