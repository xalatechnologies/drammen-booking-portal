import React, { useState } from 'react';
import { ArrowLeft, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType as PricingActorType, BookingType } from '@/types/pricing';
import { ActorType as CartActorType } from '@/types/cart';
import { Zone } from '@/components/booking/types';
import { BookingOverviewCard } from './BookingOverviewCard';
import { CustomerTypeSection } from './CustomerTypeSection';
import { IntegratedPriceCalculation } from '@/components/booking/IntegratedPriceCalculation';
import { LoginSelectionModal } from '@/components/auth/LoginSelectionModal';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBookingStore } from '@/stores/useBookingStore';

interface BookingPricingStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  actorType: PricingActorType;
  onActorTypeChange: (type: PricingActorType) => void;
  bookingType: BookingType;
  onBack: () => void;
  onComplete: () => void;
  onAddToCart: () => void;
}

// Helper function to convert between ActorType formats
const convertActorType = (pricingType: PricingActorType): CartActorType => {
  switch (pricingType) {
    case 'private-person': return 'private';
    case 'lag-foreninger': return 'organization';
    case 'paraply': return 'organization';
    case 'private-firma': return 'business';
    case 'kommunale-enheter': return 'organization';
    default: return 'private';
  }
};

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
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setFacilityContext } = useBookingStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if booking requires approval
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(actorType);

  const handleAddToCart = () => {
    try {
      console.log('BookingPricingStep: Adding to cart, selectedSlots:', selectedSlots);
      
      // Set facility context in booking store
      setFacilityContext(facilityId, facilityName);
      
      // Convert actor type for cart
      const cartActorType = convertActorType(actorType);

      // Add selected slots to cart with complete cart item structure
      selectedSlots.forEach(slot => {
        const zone = zones.find(z => z.id === slot.zoneId);
        const pricePerHour = zone?.pricePerHour || 450;
        const duration = slot.duration || 2;
        
        console.log('BookingPricingStep: Adding slot to cart:', {
          facilityId,
          facilityName,
          slot,
          pricePerHour,
          duration,
          cartActorType
        });
        
        addToCart({
          facilityId,
          facilityName,
          zoneId: slot.zoneId,
          date: slot.date,
          timeSlot: slot.timeSlot,
          duration,
          pricePerHour,
          purpose: 'Generell booking',
          expectedAttendees: 1,
          organizationType: cartActorType,
          additionalServices: [],
          timeSlots: [slot],
          customerInfo: {
            name: '',
            email: '',
            phone: ''
          },
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

      // Call the parent's onAddToCart to reset state ONLY after successful addition
      onAddToCart();
    } catch (error) {
      console.error('BookingPricingStep: Error adding to cart:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke legge til i handlekurv. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    console.log('BookingPricingStep: handleComplete called, isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('BookingPricingStep: User not authenticated, showing login modal');
      setShowLoginModal(true);
      return;
    }

    console.log('BookingPricingStep: User authenticated, proceeding with booking completion');
    // User is logged in, proceed with booking completion
    onComplete();
  };

  const handleLoginMethodSelect = (method: 'id-porten' | 'feide' | 'municipal') => {
    console.log('BookingPricingStep: Login method selected:', method);
    setShowLoginModal(false);
    
    // Store current booking state for post-login redirect
    const bookingState = {
      selectedSlots,
      facilityId,
      facilityName,
      actorType: convertActorType(actorType),
      bookingType
    };
    
    console.log('BookingPricingStep: Storing booking state:', bookingState);
    sessionStorage.setItem('pending_booking', JSON.stringify(bookingState));
    
    // For now, simulate login by showing a toast and then completing the booking
    // In a real app, this would redirect to the actual login provider
    toast({
      title: "Simulert innlogging",
      description: `Simulerer innlogging med ${method}. I en ekte app ville dette redirecte til innloggingsleverandøren.`,
    });

    // Simulate successful login after a short delay
    setTimeout(() => {
      // In a real app, this would be handled by the login callback
      toast({
        title: "Innlogging vellykket",
        description: "Du kan nå fullføre bookingen.",
      });
      
      // Complete the booking after simulated login
      onComplete();
    }, 1500);
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

      {/* Login Selection Modal */}
      <LoginSelectionModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginMethodSelect={handleLoginMethodSelect}
      />
    </>
  );
}
