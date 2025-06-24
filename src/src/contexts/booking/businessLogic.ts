
import { BookingState } from './types';
import { isFormValid } from './validation';

export const createBusinessLogic = (state: BookingState) => ({
  isFormValid: (): boolean => isFormValid(state.formData, state.selectedSlots),
  
  canProceedToNextStep: (): boolean => {
    switch (state.currentStep) {
      case 'selection':
        return state.selectedSlots.length > 0;
      case 'booking':
        return isFormValid(state.formData, state.selectedSlots);
      case 'cart':
        return true;
      default:
        return false;
    }
  },
  
  requiresApproval: (): boolean => {
    return ['business', 'organization'].includes(state.formData.customerType);
  },
  
  calculateTotalPrice: (): number => {
    return state.selectedSlots.reduce((total, slot) => {
      const basePrice = 225; // Default price per hour
      const duration = 2; // Assuming 2-hour slots
      let price = basePrice * duration;
      
      // Apply customer type discounts
      switch (state.formData.customerType) {
        case 'organization':
          price *= 0.8; // 20% discount
          break;
        case 'business':
          price *= 0.9; // 10% discount
          break;
      }
      
      return total + price;
    }, 0);
  }
});
