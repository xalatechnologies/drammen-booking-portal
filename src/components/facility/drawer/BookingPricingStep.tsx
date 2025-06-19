
import React from 'react';
import { ArrowLeft, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/cart';
import { BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { BookingOverviewCard } from './BookingOverviewCard';
import { CustomerTypeSection } from './CustomerTypeSection';
import { IntegratedPriceCalculation } from '@/components/booking/IntegratedPriceCalculation';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface BookingPricingStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  actorType: ActorType;
  onActorTypeChange: (type: ActorType) => void;
  bookingType: BookingType;
  onBack: () => void;
  onComplete: () => void;
  onAddToCart: () => void;
}

export function BookingPricingStep({
  selectedSlots,
  facilityId,
  facilityName,
  zones,
  actorType,
  onActorTypeChange,
  bookingType,
  onBack,
  onComplete,
  onAddToCart
}: BookingPricingStepProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Check if booking requires approval
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(actorType);

  const handleAddToCart = () => {
    try {
      // Add selected slots to cart with complete cart item structure
      selectedSlots.forEach(slot => {
        const zone = zones.find(z => z.id === slot.zoneId);
        const pricePerHour = zone?.pricePerHour || 450;
        const duration = slot.duration || 2;
        
        addToCart({
          facilityId,
          facilityName,
          zoneId: slot.zoneId,
          date: slot.date,
          timeSlot: slot.timeSlot,
          duration,
          pricePerHour,
          // Required new fields with defaults
          purpose: 'Generell booking',
          expectedAttendees: 1,
          organizationType: actorType,
          additionalServices: [],
          timeSlots: [slot],
          pricing: {
            baseFacilityPrice: pricePerHour * duration,
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: pricePerHour * duration
          }
        });
      });

      toast({
        title: "Lagt til i handlekurv",
        description: `${selectedSlots.length} tidspunkt er lagt til i handlekurven`,
      });

      // Call the parent's onAddToCart to reset state
      onAddToCart();
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke legge til i handlekurv. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    if (!isAuthenticated) {
      // Store current booking state for post-login redirect
      sessionStorage.setItem('pending_booking', JSON.stringify({
        selectedSlots,
        facilityId,
        facilityName,
        actorType,
        bookingType
      }));
      
      toast({
        title: "Logg inn påkrevd",
        description: "Du må logge inn for å fullføre reservasjonen",
      });
      
      navigate('/login-selection');
      return;
    }

    // User is logged in, proceed with booking completion
    onComplete();
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Aktørtype og pris</h2>
      </div>

      <BookingOverviewCard selectedSlots={selectedSlots} facilityName={facilityName} zones={zones} />

      <CustomerTypeSection value={actorType} onChange={onActorTypeChange} />

      <IntegratedPriceCalculation 
        selectedSlots={selectedSlots} 
        facilityId={facilityId}
        actorType={actorType} 
        bookingType={bookingType} 
      />

      <div className="flex gap-3">
        <Button 
          onClick={handleAddToCart} 
          variant="outline"
          className="flex-1 text-lg py-6" 
          size="lg"
        >
          {t('forms.buttons.addToCart', {}, 'Legg til handlekurv')}
        </Button>
        
        <Button 
          onClick={handleComplete} 
          className="flex-1 text-lg py-6" 
          size="lg"
        >
          {!isAuthenticated ? (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Logg inn og fullfør
            </>
          ) : requiresApproval ? (
            <>
              <User className="h-4 w-4 mr-2" />
              Send til godkjenning
            </>
          ) : (
            t('forms.buttons.complete', {}, 'Fullfør')
          )}
        </Button>
      </div>
    </>
  );
}
