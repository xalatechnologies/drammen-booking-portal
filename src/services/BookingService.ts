
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { useCartStore } from '@/stores/useCartStore';
import { ActorType as CartActorType } from '@/types/cart';
import { ActorType as PricingActorType } from '@/types/pricing';
import { EventType } from '@/types/booking';

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: PricingActorType;
  termsAccepted: boolean;
}

interface BookingRequest {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  formData: BookingFormData;
}

// Helper function to convert between ActorType formats
const convertActorType = (pricingType: PricingActorType): CartActorType => {
  switch (pricingType) {
    case 'private-person': return 'private';
    case 'lag-foreninger': return 'lag-foreninger';
    case 'paraply': return 'paraply';
    case 'private-firma': return 'business';
    case 'kommunale-enheter': return 'organization';
    default: return 'private';
  }
};

// Helper function to convert activity type to event type
const convertActivityToEventType = (activityType: string): EventType => {
  switch (activityType) {
    case 'sport':
    case 'sports': return 'sport';
    case 'kultur':
    case 'cultural': return 'cultural';
    case 'møte':
    case 'meeting': return 'meeting';
    case 'trening':
    case 'training': return 'training';
    case 'konkurranse':
    case 'competition': return 'competition';
    default: return 'other';
  }
};

export class BookingService {
  static async addToCart({ selectedSlots, facilityId, facilityName, zones, formData }: BookingRequest) {
    try {
      console.log('BookingService: Adding to cart with form data:', formData);
      
      const { addToCart } = useCartStore.getState();
      
      // Process each selected slot
      for (const slot of selectedSlots) {
        const pricePerHour = 225; // Default price, should come from facility data
        const duration = slot.duration || 2;
        
        addToCart({
          facilityId,
          facilityName,
          zoneId: slot.zoneId,
          date: slot.date,
          timeSlot: slot.timeSlot,
          duration,
          pricePerHour,
          purpose: formData.purpose,
          eventType: convertActivityToEventType(formData.activityType),
          expectedAttendees: formData.attendees,
          organizationType: convertActorType(formData.actorType),
          specialRequirements: formData.additionalInfo || undefined,
          additionalServices: [],
          timeSlots: [slot],
          customerInfo: {
            name: '', // Will be filled later in checkout
            email: '',
            phone: '',
            organization: ''
          },
          pricing: {
            baseFacilityPrice: pricePerHour * duration,
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: pricePerHour * duration
          }
        });
      }

      return {
        success: true,
        message: `${selectedSlots.length} tidspunkt lagt til i handlekurv`
      };

    } catch (error) {
      console.error('BookingService: Error adding to cart:', error);
      return {
        success: false,
        message: 'Kunne ikke legge til i handlekurv'
      };
    }
  }

  static async completeBooking({ selectedSlots, facilityId, facilityName, zones, formData }: BookingRequest) {
    try {
      console.log('BookingService: Completing booking with form data:', formData);
      
      // This would normally submit to a booking API
      // For now, we'll just return success
      
      return {
        success: true,
        message: `Booking opprettet for ${selectedSlots.length} tidspunkt`
      };

    } catch (error) {
      console.error('BookingService: Error completing booking:', error);
      return {
        success: false,
        message: 'Kunne ikke opprette booking'
      };
    }
  }
}
