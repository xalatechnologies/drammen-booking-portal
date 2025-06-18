
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Clock, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
}

export function BookingDrawer({ isOpen, onClose, selectedSlots, facilityId, facilityName }: BookingDrawerProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'summary' | 'details'>('summary');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: ''
  });

  // Calculate pricing for all selected slots
  const { calculation } = usePriceCalculation({
    facilityId,
    zoneId: selectedSlots[0]?.zoneId,
    startDate: selectedSlots[0]?.date,
    customerType: 'private',
    timeSlot: selectedSlots[0]?.timeSlot
  });

  const totalPrice = calculation ? calculation.finalPrice * selectedSlots.length : 0;

  const handleSubmit = () => {
    // Navigate to booking confirmation
    navigate(`/booking/${facilityId}/confirm`, {
      state: {
        selectedSlots,
        formData,
        totalPrice
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-end">
      <div className="bg-white w-full md:w-96 md:h-full md:max-h-screen overflow-auto rounded-t-lg md:rounded-none shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fullfør booking</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {step === 'summary' ? (
            <>
              {/* Booking Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Booking oversikt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{facilityName}</p>
                    <p className="text-sm text-gray-600">{selectedSlots.length} tidspunkt valgt</p>
                  </div>
                  
                  <div className="space-y-2 max-h-32 overflow-auto">
                    {selectedSlots.slice(0, 5).map((slot, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{format(slot.date, 'EEE dd.MM', { locale: nb })}</span>
                        <Badge variant="outline" className="text-xs">
                          {slot.timeSlot}
                        </Badge>
                      </div>
                    ))}
                    {selectedSlots.length > 5 && (
                      <p className="text-xs text-gray-500">
                        + {selectedSlots.length - 5} flere tidspunkt
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              {calculation && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Prising
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PriceBreakdown calculation={calculation} />
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total ({selectedSlots.length} tidspunkt):</span>
                        <span className="text-lg">{totalPrice} kr</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={() => setStep('details')} className="w-full" size="lg">
                Fortsett til detaljer
              </Button>
            </>
          ) : (
            <>
              {/* Contact Details Form */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Kontaktinformasjon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="name">Navn *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ditt navn"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Telefonnummer"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-post *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="din@epost.no"
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization">Organisasjon</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="Navn på organisasjon (valgfritt)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">Formål med booking *</Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                      placeholder="F.eks. fotballtrening, arrangement"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Tilleggsinformasjon</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Eventuelle spesielle behov eller kommentarer"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('summary')} className="flex-1">
                  Tilbake
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.purpose}
                >
                  Send søknad
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
