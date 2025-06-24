
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Shield, Clock, Euro, Settings } from "lucide-react";

interface FacilitySettingsSectionProps {
  facility: any;
}

export const FacilitySettingsSection: React.FC<FacilitySettingsSectionProps> = ({ facility }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Facility Settings</h2>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Booking Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Approval</p>
                  <p className="text-sm text-gray-600">Automatically approve eligible bookings</p>
                </div>
                <Switch checked={facility.has_auto_approval} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Featured Facility</p>
                  <p className="text-sm text-gray-600">Show in featured listings</p>
                </div>
                <Switch checked={facility.is_featured} />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Time Slot Duration</label>
                <p className="text-base">{facility.time_slot_duration || 1} hours</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Base Price</label>
                <p className="text-base">{facility.price_per_hour || 450} NOK/hour</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allowed Booking Types */}
      <Card>
        <CardHeader>
          <CardTitle>Allowed Booking Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {facility.allowed_booking_types?.map((type: string) => (
              <Badge key={type} variant="default">
                {type === 'engangs' ? 'One-time' :
                 type === 'fastlan' ? 'Regular lease' :
                 type === 'rammetid' ? 'Frame time' :
                 type === 'strotimer' ? 'Drop-in slots' : type}
              </Badge>
            )) || <p className="text-gray-500">No booking types configured</p>}
          </div>
        </CardContent>
      </Card>

      {/* Booking Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Booking Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Lead Time</label>
              <p className="text-base">{facility.booking_lead_time_hours || 2} hours minimum</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Advance Booking</label>
              <p className="text-base">{facility.max_advance_booking_days || 365} days maximum</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Cancellation Deadline</label>
              <p className="text-base">{facility.cancellation_deadline_hours || 24} hours before</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Deactivate Facility</p>
              <p className="text-sm text-gray-600">Temporarily disable bookings for this facility</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              Deactivate
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Delete Facility</p>
              <p className="text-sm text-gray-600">Permanently remove this facility and all associated data</p>
            </div>
            <Button variant="destructive">
              Delete Facility
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
