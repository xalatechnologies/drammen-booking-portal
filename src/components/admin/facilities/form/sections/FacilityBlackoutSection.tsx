
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Calendar, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

interface FacilityBlackoutSectionProps {
  form: UseFormReturn<FacilityFormData>;
  facilityId?: number;
}

interface FacilityBlackoutSectionRef {
  saveData: () => Promise<boolean>;
}

interface BlackoutPeriod {
  id: string;
  type: 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';
  reason: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
}

export const FacilityBlackoutSection = forwardRef<FacilityBlackoutSectionRef, FacilityBlackoutSectionProps>(({ form, facilityId }, ref) => {
  const { tSync } = useTranslation();
  const [blackoutPeriods, setBlackoutPeriods] = useState<BlackoutPeriod[]>([]);
  const [isAddingBlackout, setIsAddingBlackout] = useState(false);

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      console.log('Saving blackout periods:', blackoutPeriods);
      
      if (!facilityId) {
        console.log('No facility ID, skipping blackout periods save');
        return true;
      }

      try {
        // Here you would implement the actual API call to save blackout periods
        console.log('Blackout periods would be saved:', {
          facilityId,
          blackouts: blackoutPeriods.map(blackout => ({
            facility_id: facilityId,
            type: blackout.type,
            reason: blackout.reason,
            start_date: blackout.startDate,
            end_date: blackout.endDate,
            start_time: blackout.startTime,
            end_time: blackout.endTime,
            is_all_day: blackout.isAllDay,
            recurring_pattern: blackout.recurring
          }))
        });
        
        return true;
      } catch (error) {
        console.error('Failed to save blackout periods:', error);
        return false;
      }
    }
  }), [blackoutPeriods, facilityId]);

  const getTypeIcon = (type: string) => {
    const icons = {
      maintenance: "🔧",
      renovation: "🏗️",
      event: "🎉",
      weather: "⛈️",
      other: "📋"
    };
    return icons[type as keyof typeof icons] || "📋";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'renovation': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'weather': return 'bg-gray-100 text-gray-800';
      case 'other': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteBlackout = (id: string) => {
    setBlackoutPeriods(periods => periods.filter(period => period.id !== id));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {tSync("admin.facilities.form.blackouts.title", "Blackout Periods")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Blackout Periods List */}
        {blackoutPeriods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-1">{tSync("admin.facilities.form.blackouts.noBlackouts", "No blackout periods configured")}</h3>
            <p className="text-sm mb-4">{tSync("admin.facilities.form.blackouts.noBlackoutsHint", "Add blackout periods to block bookings during maintenance or special events")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blackoutPeriods.map((blackout) => (
              <div key={blackout.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                <div className="text-2xl">{getTypeIcon(blackout.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{blackout.reason}</h4>
                    <Badge className={getTypeColor(blackout.type)}>{blackout.type}</Badge>
                    {blackout.recurring && <Badge variant="outline">Recurring</Badge>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Start:</span> {blackout.startDate}
                      {!blackout.isAllDay && blackout.startTime && ` ${blackout.startTime}`}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {blackout.endDate}
                      {!blackout.isAllDay && blackout.endTime && ` ${blackout.endTime}`}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {blackout.isAllDay ? 'All day' : 'Partial day'}
                    </div>
                  </div>
                  {blackout.recurring && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Repeats {blackout.recurring.pattern} every {blackout.recurring.interval} 
                      {blackout.recurring.pattern === 'daily' ? ' day(s)' : 
                       blackout.recurring.pattern === 'weekly' ? ' week(s)' : ' month(s)'}
                      {blackout.recurring.endDate && ` until ${blackout.recurring.endDate}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteBlackout(blackout.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Blackout Button */}
        <Button onClick={() => setIsAddingBlackout(true)} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {tSync("admin.facilities.form.blackouts.addBlackout", "Add Blackout Period")}
        </Button>

        {/* Summary */}
        {blackoutPeriods.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Total Blackouts</div>
              <div className="text-lg font-bold">{blackoutPeriods.length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Maintenance</div>
              <div className="text-lg font-bold text-orange-600">{blackoutPeriods.filter(b => b.type === 'maintenance').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Events</div>
              <div className="text-lg font-bold text-blue-600">{blackoutPeriods.filter(b => b.type === 'event').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Recurring</div>
              <div className="text-lg font-bold text-purple-600">{blackoutPeriods.filter(b => b.recurring).length}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FacilityBlackoutSection.displayName = "FacilityBlackoutSection";
