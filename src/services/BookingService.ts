
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/pricing';
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { Zone } from '@/components/booking/types';

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
  termsAccepted: boolean;
}

export interface BookingServiceParams {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  formData: BookingFormData;
}

export class BookingService {
  static validateBookingData(params: BookingServiceParams): boolean {
    const { selectedSlots, formData } = params;
    
    return formData.purpose.trim() && 
           formData.attendees > 0 && 
           formData.activityType && 
           formData.actorType &&
           formData.termsAccepted &&
           selectedSlots.length > 0;
  }

  static calculateTotalPricing(selectedSlots: SelectedTimeSlot[], zones: Zone[] = []): {
    totalDuration: number;
    averagePricePerHour: number;
    baseFacilityPrice: number;
  } {
    const totalDuration = selectedSlots.reduce((total, slot) => total + (slot.duration || 2), 0);
    const averagePricePerHour = zones.length > 0 ? 
      selectedSlots.reduce((total, slot) => {
        const zone = zones.find(z => z.id === slot.zoneId);
        return total + (zone?.pricePerHour || 450);
      }, 0) / selectedSlots.length : 450;

    const baseFacilityPrice = averagePricePerHour * totalDuration;

    return {
      totalDuration,
      averagePricePerHour,
      baseFacilityPrice
    };
  }

  static async addToCart(params: BookingServiceParams): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.validateBookingData(params)) {
        return {
          success: false,
          message: "Manglende informasjon - vennligst fyll ut alle påkrevde felt"
        };
      }

      const { selectedSlots, facilityId, facilityName, zones, formData } = params;
      const { totalDuration, averagePricePerHour, baseFacilityPrice } = this.calculateTotalPricing(selectedSlots, zones);

      // Get cart store
      const { addToCart } = useCartStore.getState();

      // Create a single cart item with all selected slots
      addToCart({
        facilityId,
        facilityName,
        zoneId: selectedSlots[0].zoneId, // Primary zone for backward compatibility
        date: selectedSlots[0].date, // Primary date for backward compatibility
        timeSlot: selectedSlots[0].timeSlot, // Primary time slot for backward compatibility
        duration: totalDuration,
        pricePerHour: averagePricePerHour,
        purpose: formData.purpose,
        expectedAttendees: formData.attendees,
        organizationType: formData.actorType === 'private-person' ? 'private' : 
                        formData.actorType === 'lag-foreninger' ? 'organization' : 'business',
        additionalServices: [],
        timeSlots: selectedSlots, // All selected slots in one reservation
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        },
        pricing: {
          baseFacilityPrice,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: baseFacilityPrice
        }
      });

      return {
        success: true,
        message: `Reservasjon med ${selectedSlots.length} tidspunkt er lagt til i handlekurven`
      };
    } catch (error) {
      console.error('BookingService: Error adding to cart:', error);
      return {
        success: false,
        message: "Kunne ikke legge til i handlekurv. Prøv igjen."
      };
    }
  }

  static async completeBooking(params: BookingServiceParams): Promise<{ success: boolean; message: string }> {
    try {
      const addToCartResult = await this.addToCart(params);
      
      if (!addToCartResult.success) {
        return addToCartResult;
      }

      // Navigate to checkout would be handled by the calling component
      return {
        success: true,
        message: "Reservasjon opprettet - videresendt til checkout"
      };
    } catch (error) {
      console.error('BookingService: Error completing booking:', error);
      return {
        success: false,
        message: "Kunne ikke fullføre reservasjonen. Prøv igjen."
      };
    }
  }
}
