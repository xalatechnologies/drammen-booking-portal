
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building, Users, CreditCard, Check } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { useCart } from '@/contexts/CartContext';

interface BookingStepsAccordionProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
}

export function BookingStepsAccordion({
  selectedSlots,
  facilityId,
  facilityName,
  zones
}: BookingStepsAccordionProps) {
  const { addToCart } = useCart();
  const [openSteps, setOpenSteps] = useState<string[]>(['details']);
  const [formData, setFormData] = useState({
    customerType: 'private' as 'private' | 'business' | 'organization',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    organization: '',
    purpose: '',
    eventType: '',
    attendees: '',
    notes: ''
  });

  const getZoneName = (zoneId: string) => {
    return zones.find(z => z.id === zoneId)?.name || zoneId;
  };

  const calculateTotalPrice = () => {
    return selectedSlots.reduce((total, slot) => {
      const zone = zones.find(z => z.id === slot.zoneId);
      const basePrice = zone?.pricePerHour || 225;
      const duration = slot.duration || 2; // Use slot duration or default to 2
      let price = basePrice * duration;
      
      // Apply customer type discounts
      switch (formData.customerType) {
        case 'organization':
          price *= 0.8; // 20% discount
          break;
        case 'business':
          price *= 0.9; // 10% discount
          break;
      }
      
      return total + price;
    }, 0);
  };

  const isFormValid = () => {
    return formData.contactName && 
           formData.contactEmail && 
           formData.contactPhone && 
           formData.purpose &&
           (formData.customerType === 'private' || formData.organization);
  };

  const handleAddToCart = () => {
    if (!isFormValid()) return;

    selectedSlots.forEach(slot => {
      const zone = zones.find(z => z.id === slot.zoneId);
      const basePrice = zone?.pricePerHour || 225;
      const duration = slot.duration || 2;
      let price = basePrice * duration;
      
      // Apply discounts
      switch (formData.customerType) {
        case 'organization':
          price *= 0.8;
          break;
        case 'business':
          price *= 0.9;
          break;
      }

      addToCart({
        facilityId,
        facilityName,
        zoneName: getZoneName(slot.zoneId),
        date: slot.date,
        timeSlot: slot.timeSlot,
        price,
        customerType: formData.customerType,
        contactDetails: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          organization: formData.organization
        },
        bookingDetails: {
          purpose: formData.purpose,
          eventType: formData.eventType,
          attendees: formData.attendees ? parseInt(formData.attendees) : undefined,
          notes: formData.notes
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        value={openSteps} 
        onValueChange={setOpenSteps}
        className="space-y-2"
      >
        {/* Booking Details Step */}
        <AccordionItem value="details" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-medium">
                1
              </div>
              <span className="font-medium">Booking detaljer</span>
              {isFormValid() && (
                <Check className="h-4 w-4 text-green-600 ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Customer Type */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Kunde type</Label>
                <RadioGroup
                  value={formData.customerType}
                  onValueChange={(value: 'private' | 'business' | 'organization') => 
                    setFormData(prev => ({ ...prev, customerType: value }))
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer flex-1">
                      <User className="h-4 w-4" />
                      Privatperson
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building className="h-4 w-4" />
                      Bedrift
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="organization" id="organization" />
                    <Label htmlFor="organization" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Users className="h-4 w-4" />
                      Organisasjon/Forening
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Contact Information */}
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="contactName">Kontaktperson *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Fullt navn"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">E-post *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="din@epost.no"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Telefon *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+47 123 45 678"
                  />
                </div>
                {formData.customerType !== 'private' && (
                  <div>
                    <Label htmlFor="organization">
                      {formData.customerType === 'business' ? 'Bedriftsnavn' : 'Organisasjonsnavn'} *
                    </Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder={formData.customerType === 'business' ? 'Bedriftsnavn' : 'Organisasjonsnavn'}
                    />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="purpose">Formål med booking *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg formål" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sport">Sport/Trening</SelectItem>
                      <SelectItem value="meeting">Møte</SelectItem>
                      <SelectItem value="event">Arrangement</SelectItem>
                      <SelectItem value="course">Kurs</SelectItem>
                      <SelectItem value="other">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="attendees">Antall deltakere</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={formData.attendees}
                    onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
                    placeholder="Antall personer"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Tilleggsopplysninger</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Spesielle behov, utstyr, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pricing & Confirmation Step */}
        <AccordionItem value="confirmation" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm font-medium">
                2
              </div>
              <span className="font-medium">Bekreft og legg til handlekurv</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Booking Summary */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Booking oversikt</h4>
                  <div className="space-y-2 text-sm">
                    {selectedSlots.map((slot, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">
                            {format(slot.date, 'EEEE dd. MMMM', { locale: nb })}
                          </div>
                          <div className="text-gray-600">
                            {slot.timeSlot} - {getZoneName(slot.zoneId)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {Math.round((zones.find(z => z.id === slot.zoneId)?.pricePerHour || 225) * (slot.duration || 2) * 
                              (formData.customerType === 'organization' ? 0.8 : 
                               formData.customerType === 'business' ? 0.9 : 1))} kr
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Totalt:</span>
                      <span>{Math.round(calculateTotalPrice())} kr</span>
                    </div>
                    {formData.customerType !== 'private' && (
                      <div className="text-sm text-green-600">
                        Inkludert {formData.customerType === 'organization' ? '20%' : '10%'} rabatt
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!isFormValid()}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Legg til i handlekurv ({Math.round(calculateTotalPrice())} kr)
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
