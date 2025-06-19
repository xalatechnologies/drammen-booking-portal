
import React, { useState } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Clock, MapPin, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StrøtimeSlot } from '@/types/booking/strøtimer';
import { StrotimeService } from '@/services/StrotimeService';

interface StrotimeBookingModalProps {
  isOpen: boolean;
  strøtime: StrøtimeSlot;
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
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await StrotimeService.bookStrøtime(strøtime.id, formData);
      
      if (response.success) {
        onBookingSuccess(response.data);
      } else {
        setError(response.error?.message || 'Booking feilet');
      }
    } catch (err) {
      setError('En uventet feil oppstod');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Book strøtime
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Strøtime details */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="font-medium">
                {format(strøtime.date, 'EEEE dd.MM.yyyy', { locale: nb })}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Tid: {strøtime.startTime} - {strøtime.endTime} ({strøtime.duration} min)</div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {strøtime.facilityName} - {strøtime.zoneName}
              </div>
              <div className="font-semibold text-orange-600">
                Pris: {strøtime.pricePerSlot} kr
              </div>
            </div>
          </div>

          {/* Booking form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Navn *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Ditt fulle navn"
              />
            </div>

            <div>
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="din@epost.no"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                placeholder="12345678"
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Viktig:</strong> Strøtimer bekreftes umiddelbart og krever betaling ved oppmøte. 
                Du vil motta en bekreftelse på e-post.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Avbryt
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? 'Booker...' : 'Bekreft booking'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
