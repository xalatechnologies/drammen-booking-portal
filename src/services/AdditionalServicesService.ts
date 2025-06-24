
import { ServiceBooking } from '@/types/serviceBooking';
import { ServiceCategoryInfo } from '@/data/additionalServices/serviceCategories';
import { serviceCategories } from '@/data/additionalServices/serviceCategories';

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: AdditionalService[];
}

export class AdditionalServicesService {
  static async getServiceCategories(): Promise<ServiceCategory[]> {
    // Transform ServiceCategoryInfo to ServiceCategory
    return serviceCategories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      services: category.items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.basePrice,
        unit: item.unit,
        category: category.id
      }))
    }));
  }

  static async getServices(): Promise<AdditionalService[]> {
    const categories = await this.getServiceCategories();
    return categories.reduce((acc, category) => {
      return acc.concat(category.services);
    }, [] as AdditionalService[]);
  }

  static async getServicesByCategory(categoryId: string): Promise<AdditionalService[]> {
    const categories = await this.getServiceCategories();
    const category = categories.find(c => c.id === categoryId);
    return category?.services || [];
  }

  static async getServiceById(id: string): Promise<AdditionalService | null> {
    const services = await this.getServices();
    return services.find(s => s.id === id) || null;
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

  static async calculateServicePrice(
    serviceId: string,
    quantity: number,
    actorType: string,
    attendees?: number,
    timeSlot?: string,
    date?: Date
  ): Promise<number> {
    const service = await this.getServiceById(serviceId);
    if (!service) return 0;
    
    let basePrice = service.price * quantity;
    
    // Apply actor type discounts
    switch (actorType) {
      case 'ORGANIZATION':
        basePrice *= 0.9; // 10% discount
        break;
      case 'PARAPLY':
        basePrice *= 0.8; // 20% discount
        break;
    }
    
    return basePrice;
  }
}
