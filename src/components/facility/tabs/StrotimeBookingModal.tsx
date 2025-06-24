
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StrotimeService, StrotimeSlot } from '@/services/StrotimeService';
import { toast } from 'sonner';

interface StrotimeBookingModalProps {
  isOpen: boolean;
  strøtime: StrotimeSlot;
  onClose: () => void;
  onBookingSuccess: (booking: any) => void;
}

export function StrotimeBookingModal({ 
  isOpen, 
  strøtime, 
  onClose, 
  onBookingSuccess 
}: StrotimeBookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequirements: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await StrotimeService.bookStrøtime(strøtime.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      if (response.success) {
        toast.success('Strøtime booked successfully!');
        onBookingSuccess(response.data);
      } else {
        const errorMessage = response.error?.message || 'Failed to book strøtime';
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book strøtime';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Strøtime</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-900">
              {strøtime.start_time} - {strøtime.end_time}
            </h3>
            <p className="text-orange-700">
              Zone {strøtime.zone_id} • {strøtime.duration_minutes} minutes
            </p>
            <p className="text-lg font-bold text-orange-600">
              {strøtime.price_per_slot} kr
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Any special requirements or notes..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? 'Booking...' : 'Book Now'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
