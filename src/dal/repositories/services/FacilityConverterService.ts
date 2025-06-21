
import { Facility } from '@/types/facility';

export class FacilityConverterService {
  static convertToDisplayFormat(facility: any): Facility {
    // Compute the address from individual fields with proper fallbacks
    const addressParts = [
      facility.address_street,
      facility.address_city,
      facility.address_postal_code
    ].filter(part => part && part.trim() !== '');
    
    const computedAddress = addressParts.length > 0 
      ? addressParts.join(', ') 
      : 'Address not available';

    // Ensure proper image URL with fallback
    const imageUrl = facility.image_url || 
      facility.image || 
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';

    console.log('FacilityConverterService - Converting facility:', {
      id: facility.id,
      name: facility.name,
      address_street: facility.address_street,
      address_city: facility.address_city,
      address_postal_code: facility.address_postal_code,
      computedAddress,
      imageUrl
    });

    return {
      ...facility,
      // Computed fields for backward compatibility
      address: computedAddress,
      image: imageUrl,
      pricePerHour: facility.price_per_hour || facility.pricePerHour || 0,
      accessibility: facility.accessibility_features || facility.accessibility || [],
      suitableFor: this.inferSuitableFor(facility.type),
      hasAutoApproval: facility.has_auto_approval ?? facility.hasAutoApproval ?? false,
      nextAvailable: facility.next_available || facility.nextAvailable || 'Available now',
      timeSlotDuration: (facility.time_slot_duration || facility.timeSlotDuration || 1) as 1 | 2,
      openingHours: facility.openingHours || [],
      zones: facility.zones || [],
      season: {
        from: facility.season_from || facility.season?.from || '',
        to: facility.season_to || facility.season?.to || ''
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
