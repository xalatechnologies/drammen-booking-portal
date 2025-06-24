
import { ServiceBooking, AdditionalService, ServiceCategory } from '@/types/serviceBooking';
import { serviceCategories } from '@/data/additionalServices/serviceCategories';

export class AdditionalServicesService {
  static async getServiceCategories(): Promise<ServiceCategory[]> {
    // Return mock data for now
    return serviceCategories;
  }

  static async getServicesByCategory(categoryId: string): Promise<AdditionalService[]> {
    const category = serviceCategories.find(c => c.id === categoryId);
    return category?.services || [];
  }

  static async createServiceBooking(booking: Omit<ServiceBooking, 'id' | 'createdAt'>): Promise<ServiceBooking> {
    // Mock implementation - would integrate with Supabase
    const serviceBooking: ServiceBooking = {
      ...booking,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    return serviceBooking;
  }
}
