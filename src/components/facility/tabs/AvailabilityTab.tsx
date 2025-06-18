import React, { useState } from "react";
import { format, addDays, startOfWeek, isBefore, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Users, DollarSign, Repeat, ShoppingCart, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zone } from "@/components/booking/types";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { ExistingBooking } from "@/utils/zoneConflictManager";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { RecurrencePatternBuilder } from "@/components/facility/RecurrencePatternBuilder";
import { BookingDrawer } from "@/components/facility/BookingDrawer";
import { ConflictTooltip } from "@/components/facility/ConflictTooltip";
import { ConflictResolutionWizard } from "@/components/facility/ConflictResolutionWizard";
import { RecurrencePattern, SelectedTimeSlot, recurrenceEngine } from "@/utils/recurrenceEngine";

interface AvailabilityTabProps {
  zones: Zone[];
  startDate: Date;
  showLegend?: boolean;
  facilityId?: string;
  facilityName?: string;
}

export function AvailabilityTab({ 
  zones, 
  startDate, 
  showLegend = true,
  facilityId = "",
  facilityName = ""
}: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startDate, { weekStartsOn: 1 }));
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [showConflictWizard, setShowConflictWizard] = useState(false);
  const [conflictResolutionData, setConflictResolutionData] = useState<any>(null);
  const [currentPattern, setCurrentPattern] = useState<RecurrencePattern>({
    type: 'single',
    weekdays: [],
    timeSlots: [],
    interval: 1
  });
  
  // Mock existing bookings for demo
  const existingBookings: ExistingBooking[] = [
    {
      id: "1",
      zoneId: "whole-facility",
      date: new Date(2025, 5, 19),
      timeSlot: "14:00",
      bookedBy: "Drammen Fotballklubb"
    },
    {
      id: "2", 
      zoneId: "zone-1",
      date: new Date(2025, 5, 20),
      timeSlot: "10:00",
      bookedBy: "Lokale Basketlag"
    }
  ];

  const conflictManager = new EnhancedZoneConflictManager(zones, existingBookings);
  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const today = startOfDay(new Date());
  const currentWeekStartDay = startOfDay(currentWeekStart);
  const canGoPrevious = !isBefore(addDays(currentWeekStartDay, -7), today);

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return { status: 'unavailable', conflict: null };
    }

    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { status: 'busy', conflict };
    }

    return { status: 'available', conflict: null };
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => 
      slot.zoneId === zoneId && 
      format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      slot.timeSlot === timeSlot
    );
  };

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(zoneId, date, timeSlot);

    if (isSelected) {
      // Remove from selection
      setSelectedSlots(prev => prev.filter(slot => 
        !(slot.zoneId === zoneId && 
          format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
          slot.timeSlot === timeSlot)
      ));
    } else {
      // Add to selection
      const newSlot: SelectedTimeSlot = {
        zoneId,
        date: new Date(date),
        timeSlot,
        duration: 2 // Default 2 hours
      };
      setSelectedSlots(prev => [...prev, newSlot]);
    }
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const handlePatternApply = (pattern: RecurrencePattern) => {
    if (pattern.weekdays.length === 0 || pattern.timeSlots.length === 0) return;

    const startDateForPattern = currentWeekStart;
    const zoneId = zones[0]?.id || 'whole-facility';
    
    const occurrences = recurrenceEngine.generateOccurrences(
      pattern,
      startDateForPattern,
      zoneId,
      12
    );

    // Check for conflicts in recurring pattern
    const conflictedDates: Date[] = [];
    const availableDates: Date[] = [];
    
    occurrences.forEach(occurrence => {
      const { status } = getAvailabilityStatus(occurrence.zoneId, occurrence.date, occurrence.timeSlot);
      if (status === 'available') {
        availableDates.push(occurrence.date);
      } else {
        conflictedDates.push(occurrence.date);
      }
    });

    // If there are conflicts, show resolution wizard
    if (conflictedDates.length > 0) {
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        const resolution = conflictManager.resolveRecurringConflicts(
          zoneId,
          occurrences.map(o => o.date),
          pattern.timeSlots[0],
          {
            skipConflictedDates: true,
            suggestAlternativeTimes: true,
            suggestAlternativeZones: true,
            allowPartialBooking: true
          }
        );

        setConflictResolutionData({
          conflictedDates: resolution.conflictedDates,
          availableDates: resolution.availableDates,
          alternativeTimeSlots: resolution.alternativeTimeSlots,
          suggestedZones: resolution.suggestedZones,
          originalZone: zone,
          originalTimeSlot: pattern.timeSlots[0],
          occurrences
        });
        setShowConflictWizard(true);
      }
    } else {
      // No conflicts, proceed with booking
      setSelectedSlots(occurrences);
    }
    
    setShowPatternBuilder(false);
  };

  const handleConflictResolution = (resolution: any) => {
    // Apply the selected resolution
    switch (resolution.type) {
      case 'skip-conflicts':
        if (conflictResolutionData) {
          const availableOccurrences = conflictResolutionData.occurrences.filter((occ: SelectedTimeSlot) =>
            resolution.selectedDates?.some(date => 
              format(date, 'yyyy-MM-dd') === format(occ.date, 'yyyy-MM-dd')
            )
          );
          setSelectedSlots(availableOccurrences);
        }
        break;
      case 'use-alternatives':
        // Implementation for alternative time slots
        break;
      case 'change-zone':
        if (resolution.selectedZone && conflictResolutionData) {
          const newOccurrences = conflictResolutionData.occurrences.map((occ: SelectedTimeSlot) => ({
            ...occ,
            zoneId: resolution.selectedZone.id
          }));
          setSelectedSlots(newOccurrences);
        }
        break;
    }
    setShowConflictWizard(false);
  };

  const getStatusColor = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 hover:bg-blue-600 border-blue-600 ring-2 ring-blue-300 text-white';
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border-green-400 hover:border-green-500';
      case 'busy':
        return 'bg-red-100 border-red-400 cursor-not-allowed';
      case 'unavailable':
      default:
        return 'bg-gray-100 border-gray-400 cursor-not-allowed';
    }
  };

  const renderSlotButton = (zone: Zone, day: Date, timeSlot: string, dayIndex: number) => {
    const { status, conflict } = getAvailabilityStatus(zone.id, day, timeSlot);
    const isSelected = isSlotSelected(zone.id, day, timeSlot);
    const statusColor = getStatusColor(status, isSelected);
    
    const button = (
      <button
        className={`w-full h-12 rounded-md border-2 transition-all duration-200 font-inter ${statusColor} ${
          status === 'available' 
            ? 'cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105' 
            : 'cursor-not-allowed opacity-75'
        }`}
        disabled={status !== 'available'}
        onClick={() => handleSlotClick(zone.id, day, timeSlot, status)}
      >
        {isSelected && (
          <div className="text-xs font-medium">✓</div>
        )}
        {status === 'busy' && (
          <AlertTriangle className="h-3 w-3 mx-auto text-red-500" />
        )}
      </button>
    );

    if (conflict) {
      return (
        <ConflictTooltip key={dayIndex} conflict={conflict}>
          {button}
        </ConflictTooltip>
      );
    }

    return button;
  };

  const renderZoneCalendar = (zone: Zone) => (
    <div className="space-y-4">
      {/* Zone Info Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{zone.name}</h4>
          <p className="text-sm text-gray-600">Klikk på ledige timer for å velge tidsrom</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border text-sm">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{zone.capacity}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{zone.pricePerHour} kr/t</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPatternBuilder(true)}
            className="flex items-center gap-2"
          >
            <Repeat className="h-4 w-4" />
            Gjentakende booking
          </Button>
          
          {selectedSlots.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Tøm valg ({selectedSlots.length})
            </Button>
          )}
        </div>

        {selectedSlots.length > 0 && (
          <Button
            onClick={() => setShowBookingDrawer(true)}
            className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af]"
          >
            <ShoppingCart className="h-4 w-4" />
            Book {selectedSlots.length} tidspunkt
          </Button>
        )}
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          className="flex items-center gap-2 h-9 px-4 text-sm"
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          Forrige
        </Button>
        
        <div className="flex items-center gap-2 text-base font-medium bg-white px-4 py-2 rounded-lg border shadow-sm">
          <Calendar className="h-4 w-4" />
          {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          className="flex items-center gap-2 h-9 px-4 text-sm"
        >
          Neste
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="p-2 text-base font-medium text-gray-500">Tid</div>
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`p-2 text-center rounded ${isToday ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                  <div className={`text-base font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className={`text-base font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format(day, "dd.MM", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 truncate" title={holidayCheck.name}>
                      {holidayCheck.name?.substring(0, 8)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-2">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-2">
                <div className="p-3 text-base font-medium text-gray-700 flex items-center bg-gray-50 rounded">
                  {timeSlot}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const button = renderSlotButton(zone, day, timeSlot, dayIndex);
                  return (
                    <div key={dayIndex} className="relative">
                      {button}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Slots Summary */}
      {selectedSlots.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-800">Valgte tidspunkt ({selectedSlots.length})</h4>
              <Badge className="bg-blue-600">{selectedSlots.length} timer</Badge>
            </div>
            <div className="max-h-24 overflow-auto space-y-1">
              {selectedSlots.slice(0, 3).map((slot, index) => (
                <div key={index} className="text-sm text-blue-700">
                  {format(slot.date, 'EEE dd.MM', { locale: nb })} - {slot.timeSlot}
                </div>
              ))}
              {selectedSlots.length > 3 && (
                <div className="text-xs text-blue-600">+ {selectedSlots.length - 3} flere</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-6 text-base">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-400"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-400"></div>
              <span>Opptatt</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-blue-500 border-2 border-blue-600"></div>
              <span>Valgt</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 font-inter">
      {/* Enhanced Zone Tabs */}
      <Tabs defaultValue={zones[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 h-auto p-1 bg-gray-100 rounded-lg">
          {zones.map((zone) => (
            <TabsTrigger 
              key={zone.id} 
              value={zone.id}
              className="flex flex-col items-center p-3 h-auto data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white hover:bg-[#1e40af] hover:text-white transition-colors rounded-md font-inter"
            >
              <span className="font-medium text-base">{zone.name}</span>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-75">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{zone.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{zone.pricePerHour}kr</span>
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {zones.map((zone) => (
          <TabsContent key={zone.id} value={zone.id} className="mt-6">
            {renderZoneCalendar(zone)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Pattern Builder Modal */}
      {showPatternBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <RecurrencePatternBuilder
            pattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onClose={() => {
              handlePatternApply(currentPattern);
              setShowPatternBuilder(false);
            }}
          />
        </div>
      )}

      {/* Conflict Resolution Wizard */}
      {showConflictWizard && conflictResolutionData && (
        <ConflictResolutionWizard
          isOpen={showConflictWizard}
          onClose={() => setShowConflictWizard(false)}
          conflictedDates={conflictResolutionData.conflictedDates}
          availableDates={conflictResolutionData.availableDates}
          alternativeTimeSlots={conflictResolutionData.alternativeTimeSlots}
          suggestedZones={conflictResolutionData.suggestedZones}
          originalZone={conflictResolutionData.originalZone}
          originalTimeSlot={conflictResolutionData.originalTimeSlot}
          onResolutionSelect={handleConflictResolution}
        />
      )}

      {/* Booking Drawer */}
      <BookingDrawer
        isOpen={showBookingDrawer}
        onClose={() => setShowBookingDrawer(false)}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
      />
    </div>
  );
}
