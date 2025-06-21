
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
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Facilities
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{facility.name}</h1>
            <p className="text-gray-600">{facility.address_street}, {facility.address_city}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCalendar}>
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Facility
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge
                  variant={facility.status === 'active' ? 'default' : 
                          facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                  className="mt-1"
                >
                  {facility.status}
                </Badge>
              </div>
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="text-2xl font-bold">{facility.capacity}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Price/Hour</p>
                <p className="text-2xl font-bold">{facility.price_per_hour} NOK</p>
              </div>
              <Euro className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Slots</p>
                <p className="text-2xl font-bold">{facility.time_slot_duration}h</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <FacilityBasicInfo facility={facility} />
        </TabsContent>

        <TabsContent value="zones" className="space-y-6">
          <FacilityZonesSection facility={facility} />
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <FacilityOpeningHours facility={facility} />
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <FacilityImageGallery facility={facility} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FacilityAnalytics facility={facility} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <FacilitySettingsSection facility={facility} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
