
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, MapPin, Calendar, X, ShoppingCart, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { BookingFormFields } from "@/components/booking/BookingFormFields";
import { BookingActionButtons } from "@/components/booking/BookingActionButtons";
import { ActorType } from "@/types/pricing";

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
}

interface ReusableBookingSidebarProps {
  facilityName: string;
  facilityId: string;
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  onClearSlots: () => void;
  onContinueBooking?: () => void;
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  compact?: boolean;
}

export const ReusableBookingSidebar: React.FC<ReusableBookingSidebarProps> = ({
  facilityName,
  facilityId,
  zones,
  selectedSlots,
  onRemoveSlot,
  onClearSlots,
  onContinueBooking,
  onAddToCart,
  onCompleteBooking,
  compact = false
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: ''
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalSlots = selectedSlots.length;
  const totalHours = selectedSlots.reduce((sum, slot) => sum + (slot.duration || 1), 0);
  
  // Calculate estimated price
  const estimatedPrice = selectedSlots.reduce((total, slot) => {
    const zone = zones.find(z => z.id === slot.zoneId);
    return total + (zone?.pricePerHour || 450) * (slot.duration || 1);
  }, 0);

  // Group slots by date - ensure dates are Date objects
  const slotsByDate = selectedSlots.reduce((acc, slot) => {
    const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date);
    const dateKey = format(slotDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      ...slot,
      date: slotDate
    });
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isFormValid = () => {
    return selectedSlots.length > 0 &&
           formData.purpose &&
           formData.activityType &&
           formData.actorType &&
           termsAccepted;
  };

  const handleAddToCart = () => {
    if (onAddToCart && isFormValid()) {
      onAddToCart({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }
  };

  const handleCompleteBooking = () => {
    if (onCompleteBooking && isFormValid()) {
      onCompleteBooking({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }
  };

  if (totalSlots === 0) {
    return (
      <Card className={`${compact ? 'max-w-sm' : 'w-full'}`}>
        <CardHeader>
          <CardTitle className="text-lg">Booking sammendrag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Ingen tidspunkter valgt</p>
            <p className="text-sm text-gray-400">
              Velg tidspunkter i kalenderen for å starte booking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${compact ? 'max-w-sm' : 'w-full'}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Booking sammendrag
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSlots}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Nullstill
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Facility Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{facilityName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{totalHours} timer totalt</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{totalSlots} tidspunkt{totalSlots !== 1 ? 'er' : ''}</span>
          </div>
        </div>

        <Separator />

        {/* Selected Slots */}
        <div className="space-y-3 max-h-32 overflow-y-auto">
          {Object.entries(slotsByDate).map(([dateKey, daySlots]) => (
            <div key={dateKey} className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                {format(new Date(dateKey), 'EEEE, dd. MMMM', { locale: nb })}
              </h4>
              
              {daySlots.map((slot, index) => {
                const zone = zones.find(z => z.id === slot.zoneId);
                return (
                  <div 
                    key={`${slot.zoneId}-${slot.timeSlot}-${index}`}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {slot.timeSlot}
                        </Badge>
                        <span className="text-sm font-medium">
                          {zone?.name || 'Ukjent sone'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {zone?.pricePerHour || 450} kr/time
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <Separator />

        {/* Booking Form Fields */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Booking detaljer</h4>
          <BookingFormFields
            formData={formData}
            onUpdateFormData={updateFormData}
          />
        </div>

        <Separator />

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Estimert pris:</span>
            <span className="font-medium">{estimatedPrice.toLocaleString('no-NO')} kr</span>
          </div>
          <p className="text-xs text-gray-500">
            Endelig pris kan variere basert på tilleggstjenester
          </p>
        </div>

        {/* Action Buttons */}
        <BookingActionButtons
          termsAccepted={termsAccepted}
          onTermsAcceptedChange={setTermsAccepted}
          onAddToCart={handleAddToCart}
          onCompleteBooking={handleCompleteBooking}
          isFormValid={isFormValid()}
        />
      </CardContent>
    </Card>
  );
};
