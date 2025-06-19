
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { useTranslation } from '@/i18n';
import { AvailabilityTabContent } from './AvailabilityTabContent';
import { PatternBuilderModal } from './modals/PatternBuilderModal';
import { ConflictWizardModal } from './modals/ConflictWizardModal';

interface AvailabilityTabProps {
  zones: Zone[];
  facilityId?: string;
  facilityName?: string;
  selectedSlots: SelectedTimeSlot[];
  onSlotsChange: (slots: SelectedTimeSlot[]) => void;
}

export function AvailabilityTab({ 
  zones, 
  facilityId = "", 
  facilityName = "",
  selectedSlots,
  onSlotsChange
}: AvailabilityTabProps) {
  const { t } = useTranslation();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(zones[0]?.id || null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [canGoPrevious, setCanGoPrevious] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showConflictWizard, setShowConflictWizard] = useState(false);
  const [conflictResolutionData, setConflictResolutionData] = useState<any>(null);
  const [currentPattern, setCurrentPattern] = useState<RecurrencePattern>({
    type: 'weekly',
    weekdays: [],
    timeSlot: '08:00',
    duration: 2,
    endDate: new Date(),
  });

  const conflictManager = new EnhancedZoneConflictManager();

  const selectedZone = zones.find(zone => zone.id === selectedZoneId);

  const handlePatternBuilderOpen = () => {
    setShowPatternBuilder(true);
  };

  const handlePatternBuilderClose = () => {
    setShowPatternBuilder(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('facility.availability.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zone Selector */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">{t('facility.availability.selectZone')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {zones.map((zone) => (
                <Button
                  key={zone.id}
                  variant={selectedZoneId === zone.id ? "default" : "outline"}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`p-4 h-auto justify-start ${
                    selectedZoneId === zone.id 
                      ? "bg-[#1e3a8a] hover:bg-[#1e40af]" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{zone.name}</div>
                    <div className="text-sm opacity-75">
                      {zone.capacity} {t('facility.availability.capacity')} • {zone.pricePerHour} kr/t
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {selectedZone && (
            <AvailabilityTabContent
              zone={selectedZone}
              zones={zones}
              currentWeekStart={currentWeekStart}
              setCurrentWeekStart={setCurrentWeekStart}
              canGoPrevious={canGoPrevious}
              selectedSlots={selectedSlots}
              setSelectedSlots={onSlotsChange}
              conflictManager={conflictManager}
              showLegend={showLegend}
              onPatternBuilderOpen={handlePatternBuilderOpen}
              onBookingDrawerOpen={() => {}} // No longer needed
              setShowConflictWizard={setShowConflictWizard}
              setConflictResolutionData={setConflictResolutionData}
              currentPattern={currentPattern}
              setCurrentPattern={setCurrentPattern}
              facilityId={facilityId}
              facilityName={facilityName}
              openingHours="08:00-22:00"
            />
          )}
        </CardContent>
      </Card>

      {/* Pattern Builder Modal */}
      <PatternBuilderModal
        isOpen={showPatternBuilder}
        onClose={handlePatternBuilderClose}
        currentPattern={currentPattern}
        setCurrentPattern={setCurrentPattern}
      />

      {/* Conflict Wizard Modal */}
      <ConflictWizardModal
        isOpen={showConflictWizard}
        onClose={() => setShowConflictWizard(false)}
        conflictData={conflictResolutionData}
        onResolution={(resolution: any) => {
          console.log('Conflict resolved with:', resolution);
          setShowConflictWizard(false);
        }}
      />
    </div>
  );
}
