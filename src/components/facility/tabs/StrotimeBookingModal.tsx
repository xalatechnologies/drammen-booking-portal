
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Euro } from 'lucide-react';
import { StrøtimeSlot } from '@/types/booking/strøtimer';

interface StrotimeBookingModalProps {
  slot: StrøtimeSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: (bookingData: any) => void;
}

interface BookingFormData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  participants: number;
  specialRequirements: string;
}

export function StrotimeBookingModal({ 
  slot, 
  isOpen, 
  onClose, 
  onBookingComplete 
}: StrotimeBookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    participants: 1,
    specialRequirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slot) return;

    setIsSubmitting(true);
    
    try {
      // Simulate booking process - replace with actual Supabase call
      const bookingData = {
        strøtimeSlotId: slot.id,
        ...formData,
        totalPrice: slot.pricePerSlot,
        bookedAt: new Date().toISOString()
      };

      console.log('Booking strøtime slot:', bookingData);
      
      // Call the completion callback
      if (onBookingComplete) {
        onBookingComplete(bookingData);
      }
      
      // Close modal and reset form
      onClose();
      setFormData({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        participants: 1,
        specialRequirements: ''
      });
      
    } catch (error) {
      console.error('Error booking strøtime slot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!slot) return null;

  const isFormValid = formData.contactName.trim() && 
                     formData.contactEmail.trim() && 
                     formData.contactPhone.trim() &&
                     formData.participants > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Strøtime</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Slot Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Slot Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Facility:</span>
                <span className="font-medium">{slot.facilityName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Zone:</span>
                <Badge variant="outline">{slot.zoneName}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="font-medium">
                  {slot.date.toLocaleDateString('no-NO')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="font-medium">{slot.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price:</span>
                <div className="flex items-center gap-1 font-bold text-green-600">
                  <Euro className="h-4 w-4" />
                  <span>{slot.pricePerSlot} kr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Participants *
              </Label>
              <Input
                id="participants"
                type="number"
                min="1"
                value={formData.participants}
                onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Booking...' : `Book for ${slot.pricePerSlot} kr`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
