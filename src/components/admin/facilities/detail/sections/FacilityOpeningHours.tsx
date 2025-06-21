
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit } from "lucide-react";

interface FacilityOpeningHoursProps {
  facility: any;
}

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const FacilityOpeningHours: React.FC<FacilityOpeningHoursProps> = ({ facility }) => {
  // Mock opening hours data - replace with real data from facility
  const openingHours = [
    { day_of_week: 1, open_time: '06:00', close_time: '23:00', is_open: true },
    { day_of_week: 2, open_time: '06:00', close_time: '23:00', is_open: true },
    { day_of_week: 3, open_time: '06:00', close_time: '23:00', is_open: true },
    { day_of_week: 4, open_time: '06:00', close_time: '23:00', is_open: true },
    { day_of_week: 5, open_time: '06:00', close_time: '23:00', is_open: true },
    { day_of_week: 6, open_time: '08:00', close_time: '22:00', is_open: true },
    { day_of_week: 0, open_time: '08:00', close_time: '22:00', is_open: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Opening Hours</h2>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Hours
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openingHours.map((schedule) => (
              <div key={schedule.day_of_week} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <span className="font-medium w-20">{WEEKDAYS[schedule.day_of_week]}</span>
                  {schedule.is_open ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Open
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Closed
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  {schedule.is_open ? (
                    <span className="text-sm font-medium">
                      {schedule.open_time} - {schedule.close_time}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Season Start</label>
              <p className="text-base">{facility.season_from || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Season End</label>
              <p className="text-base">{facility.season_to || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Lead Time</label>
              <p className="text-base">{facility.booking_lead_time_hours || 2} hours</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Max Advance</label>
              <p className="text-base">{facility.max_advance_booking_days || 365} days</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Cancellation</label>
              <p className="text-base">{facility.cancellation_deadline_hours || 24} hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
