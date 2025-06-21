
import { Facility } from '@/types/facility';

export class FacilityConverterService {
  static convertToDisplayFormat(facility: any): Facility {
    // Compute the address from individual fields
    const addressParts = [
      facility.address_street,
      facility.address_city,
      facility.address_postal_code
    ].filter(Boolean);
    
    const computedAddress = addressParts.join(', ') || 'Address not available';

    return {
      ...facility,
      // Computed fields for backward compatibility
      address: computedAddress,
      image: facility.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop',
      pricePerHour: facility.price_per_hour,
      accessibility: facility.accessibility_features || [],
      suitableFor: this.inferSuitableFor(facility.type),
      hasAutoApproval: facility.has_auto_approval,
      nextAvailable: facility.next_available || 'Available now',
      timeSlotDuration: facility.time_slot_duration as 1 | 2,
      openingHours: [],
      zones: [],
      season: {
        from: facility.season_from || '',
        to: facility.season_to || ''
      }
    };
  }

  private static inferSuitableFor(type: string): string[] {
    const typeMap: Record<string, string[]> = {
      'Gymsal': ['Sport', 'Basketball', 'Volleyball', 'Handball'],
      'Aktivitetshall': ['Sport', 'Events', 'Meetings'],
      'Teater': ['Performances', 'Concerts', 'Cultural Events'],
      'Matesal': ['Dining', 'Events', 'Meetings'],
      'Svømmehall': ['Swimming', 'Water Sports', 'Aqua Fitness'],
      'Fotballhall': ['Football', 'Soccer', 'Sport'],
      'Meterom': ['Meetings', 'Conferences', 'Workshops'],
      'Kultursenter': ['Cultural Events', 'Concerts', 'Exhibitions'],
      'Museum': ['Exhibitions', 'Educational Events', 'Cultural Tours'],
      'Klasserom': ['Education', 'Workshops', 'Training'],
      'Idrettshall': ['Sport', 'Athletics', 'Fitness'],
      'Forsamlingsal': ['Meetings', 'Assemblies', 'Community Events']
    };

    return typeMap[type] || ['General Use'];
  }
}
