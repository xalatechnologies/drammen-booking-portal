
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Zone } from '@/components/booking/types';
import { AlternativeZoneSuggestion } from '@/utils/enhancedZoneConflictManager';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ConflictResolutionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  conflictedDates: Date[];
  availableDates: Date[];
  alternativeTimeSlots: { date: Date; slots: string[] }[];
  suggestedZones: AlternativeZoneSuggestion[];
  originalZone: Zone;
  originalTimeSlot: string;
  onResolutionSelect: (resolution: {
    type: 'skip-conflicts' | 'use-alternatives' | 'change-zone';
    selectedDates?: Date[];
    alternativeSlots?: { date: Date; slot: string }[];
    selectedZone?: Zone;
  }) => void;
}

export function ConflictResolutionWizard({
  isOpen,
  onClose,
  conflictedDates,
  availableDates,
  alternativeTimeSlots,
  suggestedZones,
  originalZone,
  originalTimeSlot,
  onResolutionSelect
}: ConflictResolutionWizardProps) {
  const [selectedResolution, setSelectedResolution] = useState<string>('skip');
  const [selectedAlternativeSlots, setSelectedAlternativeSlots] = useState<{ date: Date; slot: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const handleResolutionConfirm = () => {
    switch (selectedResolution) {
      case 'skip':
        onResolutionSelect({
          type: 'skip-conflicts',
          selectedDates: availableDates
        });
        break;
      case 'alternatives':
        onResolutionSelect({
          type: 'use-alternatives',
          selectedDates: availableDates,
          alternativeSlots: selectedAlternativeSlots
        });
        break;
      case 'change-zone':
        if (selectedZone) {
          onResolutionSelect({
            type: 'change-zone',
            selectedZone
          });
        }
        break;
    }
    onClose();
  };

  const toggleAlternativeSlot = (date: Date, slot: string) => {
    const existing = selectedAlternativeSlots.find(s => 
      format(s.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && s.slot === slot
    );
    
    if (existing) {
      setSelectedAlternativeSlots(prev => prev.filter(s => s !== existing));
    } else {
      setSelectedAlternativeSlots(prev => [...prev, { date, slot }]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto font-inter">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Løs booking-konflikter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conflict Summary */}
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-orange-800">
                {conflictedDates.length} av {conflictedDates.length + availableDates.length} datoer har konflikter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-700 mb-1">✓ Tilgjengelige datoer ({availableDates.length})</p>
                  <div className="space-y-1">
                    {availableDates.slice(0, 3).map(date => (
                      <div key={date.toISOString()}>
                        {format(date, 'EEE dd.MM', { locale: nb })} kl. {originalTimeSlot}
                      </div>
                    ))}
                    {availableDates.length > 3 && (
                      <div className="text-gray-600">+ {availableDates.length - 3} flere</div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-red-700 mb-1">✗ Konflikter ({conflictedDates.length})</p>
                  <div className="space-y-1">
                    {conflictedDates.slice(0, 3).map(date => (
                      <div key={date.toISOString()}>
                        {format(date, 'EEE dd.MM', { locale: nb })} kl. {originalTimeSlot}
                      </div>
                    ))}
                    {conflictedDates.length > 3 && (
                      <div className="text-gray-600">+ {conflictedDates.length - 3} flere</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolution Options */}
          <Tabs value={selectedResolution} onValueChange={setSelectedResolution}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="skip">Hopp over konflikter</TabsTrigger>
              <TabsTrigger value="alternatives">Alternative tidspunkt</TabsTrigger>
              <TabsTrigger value="change-zone">Bytt sone</TabsTrigger>
            </TabsList>

            <TabsContent value="skip" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Book kun tilgjengelige datoer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Book {originalZone.name} for {availableDates.length} tilgjengelige datoer og hopp over konfliktene.
                  </p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {availableDates.length} bookinger bekreftet
                  </Badge>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alternatives" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Velg alternative tidspunkt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    For konflikter, velg alternative tidspunkt på samme dager:
                  </p>
                  <div className="space-y-3 max-h-40 overflow-auto">
                    {alternativeTimeSlots.map(({ date, slots }) => (
                      <div key={date.toISOString()} className="border rounded-lg p-3">
                        <p className="font-medium text-sm mb-2">
                          {format(date, 'EEEE dd.MM.yyyy', { locale: nb })}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {slots.map(slot => (
                            <Button
                              key={slot}
                              size="sm"
                              variant={selectedAlternativeSlots.some(s => 
                                format(s.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && s.slot === slot
                              ) ? 'default' : 'outline'}
                              onClick={() => toggleAlternativeSlot(date, slot)}
                              className="text-xs"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="change-zone" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    Velg alternativ sone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Disse sonene er tilgjengelige for ønsket tidspunkt:
                  </p>
                  <div className="space-y-3 max-h-40 overflow-auto">
                    {suggestedZones.map(({ zone, reason, score }) => (
                      <div
                        key={zone.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedZone?.id === zone.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedZone(zone)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{zone.name}</p>
                            <p className="text-xs text-gray-600">{reason}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {zone.capacity} personer
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {zone.pricePerHour} kr/t
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                Match: {score}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button 
              onClick={handleResolutionConfirm}
              disabled={
                (selectedResolution === 'change-zone' && !selectedZone) ||
                (selectedResolution === 'alternatives' && selectedAlternativeSlots.length === 0 && alternativeTimeSlots.length > 0)
              }
            >
              Bruk denne løsningen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
