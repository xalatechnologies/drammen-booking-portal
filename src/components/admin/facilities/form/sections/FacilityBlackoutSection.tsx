
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Trash2, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FacilityBlackoutSectionProps {
  form: UseFormReturn<FacilityFormData>;
  facilityId?: number;
}

interface BlackoutPeriod {
  id: string;
  type: 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

export const FacilityBlackoutSection: React.FC<FacilityBlackoutSectionProps> = ({ form, facilityId }) => {
  const { tSync } = useTranslation();
  const [blackoutPeriods, setBlackoutPeriods] = useState<BlackoutPeriod[]>([]);
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Partial<BlackoutPeriod>>({
    type: 'maintenance',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    reason: '',
    isRecurring: false
  });

  const addBlackoutPeriod = () => {
    if (newPeriod.startDate && newPeriod.endDate && newPeriod.reason) {
      const period: BlackoutPeriod = {
        id: Date.now().toString(),
        type: newPeriod.type as BlackoutPeriod['type'],
        startDate: newPeriod.startDate,
        endDate: newPeriod.endDate,
        startTime: newPeriod.startTime,
        endTime: newPeriod.endTime,
        reason: newPeriod.reason,
        isRecurring: newPeriod.isRecurring || false,
        recurrencePattern: newPeriod.recurrencePattern
      };
      setBlackoutPeriods([...blackoutPeriods, period]);
      setNewPeriod({
        type: 'maintenance',
        startDate: new Date(),
        endDate: new Date(),
        startTime: '',
        endTime: '',
        reason: '',
        isRecurring: false
      });
      setIsAddingPeriod(false);
    }
  };

  const removeBlackoutPeriod = (id: string) => {
    setBlackoutPeriods(blackoutPeriods.filter(period => period.id !== id));
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return '🔧';
      case 'renovation': return '🏗️';
      case 'event': return '🎉';
      case 'weather': return '⛈️';
      case 'other': return '📋';
      default: return '📋';
    }
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = format(start, 'MMM dd, yyyy');
    const endStr = format(end, 'MMM dd, yyyy');
    return start.getTime() === end.getTime() ? startStr : `${startStr} - ${endStr}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {tSync("admin.facilities.form.blackout.title", "Blackout Periods")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Blackout Periods */}
        {blackoutPeriods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-1">{tSync("admin.facilities.form.blackout.noPeriods", "No blackout periods")}</h3>
            <p className="text-sm mb-4">{tSync("admin.facilities.form.blackout.noPeriodsHint", "Add blackout periods to block booking availability")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blackoutPeriods.map((period) => (
              <div key={period.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                <div className="text-2xl">{getTypeIcon(period.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{period.reason}</h4>
                    <Badge className={getTypeColor(period.type)}>{period.type}</Badge>
                    {period.isRecurring && <Badge variant="outline">Recurring</Badge>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      {formatDateRange(period.startDate, period.endDate)}
                    </div>
                    {(period.startTime || period.endTime) && (
                      <div>
                        🕐 {period.startTime || '00:00'} - {period.endTime || '23:59'}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => removeBlackoutPeriod(period.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Blackout Period */}
        {isAddingPeriod ? (
          <div className="space-y-4 p-4 border-2 border-dashed rounded-lg">
            <h3 className="font-medium">{tSync("admin.facilities.form.blackout.addNew", "Add Blackout Period")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.blackout.type", "Type")} *</label>
                <Select onValueChange={(value) => setNewPeriod({...newPeriod, type: value as BlackoutPeriod['type']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                    <SelectItem value="renovation">🏗️ Renovation</SelectItem>
                    <SelectItem value="event">🎉 Private Event</SelectItem>
                    <SelectItem value="weather">⛈️ Weather</SelectItem>
                    <SelectItem value="other">📋 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.blackout.reason", "Reason")} *</label>
                <Input
                  value={newPeriod.reason}
                  onChange={(e) => setNewPeriod({...newPeriod, reason: e.target.value})}
                  placeholder="Brief description of the blackout"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.blackout.startDate", "Start Date")} *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newPeriod.startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPeriod.startDate ? format(newPeriod.startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPeriod.startDate}
                      onSelect={(date) => setNewPeriod({...newPeriod, startDate: date || new Date()})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.blackout.endDate", "End Date")} *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newPeriod.endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPeriod.endDate ? format(newPeriod.endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPeriod.endDate}
                      onSelect={(date) => setNewPeriod({...newPeriod, endDate: date || new Date()})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.blackout.startTime", "Start Time")}</label>
                <Input
                  type="time"
                  value={newPeriod.startTime}
                  onChange={(e) => setNewPeriod({...newPeriod, startTime: e.target.value})}
                  placeholder="Optional start time"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.blackout.endTime", "End Time")}</label>
                <Input
                  type="time"
                  value={newPeriod.endTime}
                  onChange={(e) => setNewPeriod({...newPeriod, endTime: e.target.value})}
                  placeholder="Optional end time"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addBlackoutPeriod} size="sm">
                {tSync("admin.facilities.form.blackout.save", "Save Period")}
              </Button>
              <Button onClick={() => setIsAddingPeriod(false)} size="sm" variant="outline">
                {tSync("admin.common.cancel", "Cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAddingPeriod(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {tSync("admin.facilities.form.blackout.addPeriod", "Add Blackout Period")}
          </Button>
        )}

        {/* Summary */}
        {blackoutPeriods.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Total Periods</div>
              <div className="text-lg font-bold">{blackoutPeriods.length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Maintenance</div>
              <div className="text-lg font-bold text-orange-600">{blackoutPeriods.filter(p => p.type === 'maintenance').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Events</div>
              <div className="text-lg font-bold text-blue-600">{blackoutPeriods.filter(p => p.type === 'event').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Recurring</div>
              <div className="text-lg font-bold text-purple-600">{blackoutPeriods.filter(p => p.isRecurring).length}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
