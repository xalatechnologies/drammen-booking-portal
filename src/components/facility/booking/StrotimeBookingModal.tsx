
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface StrotimeSlot {
  id: string;
  facilityId: number;
  zoneId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  pricePerSlot: number;
  maxParticipants: number;
  currentParticipants: number;
}

interface StrotimeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: StrotimeSlot | null;
  onConfirm: (bookingData: any) => void;
}

export function StrotimeBookingModal({
  isOpen,
  onClose,
  slot,
  onConfirm
}: StrotimeBookingModalProps) {
  const { t } = useTranslation();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [participants, setParticipants] = useState(1);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slot) return;

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        strotimeSlotId: slot.id,
        contactName,
        contactEmail,
        contactPhone,
        participants,
        specialRequirements,
        totalPrice: slot.pricePerSlot
      };

      await onConfirm(bookingData);
      onClose();
      
      // Reset form
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setParticipants(1);
      setSpecialRequirements('');
    } catch (error) {
      console.error('Error booking strotime slot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!slot) return null;

  const availableSpots = slot.maxParticipants - slot.currentParticipants;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('booking.strotime.title', 'Book Strotime Slot')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('booking.date', 'Date')}</Label>
              <div className="text-sm font-medium">{slot.slotDate}</div>
            </div>
            <div>
              <Label>{t('booking.time', 'Time')}</Label>
              <div className="text-sm font-medium">
                {slot.startTime} - {slot.endTime}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('booking.price', 'Price')}</Label>
              <div className="text-sm font-medium">{slot.pricePerSlot} NOK</div>
            </div>
            <div>
              <Label>{t('booking.availableSpots', 'Available Spots')}</Label>
              <div className="text-sm font-medium">{availableSpots}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">
              {t('booking.contactName', 'Contact Name')} *
            </Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              {t('booking.contactEmail', 'Email')} *
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">
              {t('booking.contactPhone', 'Phone Number')}
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">
              {t('booking.participants', 'Number of Participants')}
            </Label>
            <Input
              id="participants"
              type="number"
              min="1"
              max={availableSpots}
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements">
              {t('booking.specialRequirements', 'Special Requirements')}
            </Label>
            <Textarea
              id="specialRequirements"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {t('booking.total', 'Total Price')}:
              </span>
              <span className="text-lg font-bold">
                {slot.pricePerSlot} NOK
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? t('booking.processing', 'Processing...') 
                : t('booking.confirm', 'Confirm Booking')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
