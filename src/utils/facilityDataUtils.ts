import { Facility, OpeningHours, Zone, FacilityImage } from '@/types/facility';

export class FacilityDataUtils {
  /**
   * Computes the full address from individual address components
   */
  static computeAddress(facility: Pick<Facility, 'address_street' | 'address_city' | 'address_postal_code'>): string {
    const addressParts = [
      facility.address_street?.trim(),
      facility.address_city?.trim(),
      facility.address_postal_code?.trim()
    ].filter(part => part && part !== '');
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  }

  /**
   * Gets the best image URL from facility images or returns fallback
   */
  static getImageUrl(facilityImages?: any[]): string {
    const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
    
    if (!facilityImages || !Array.isArray(facilityImages) || facilityImages.length === 0) {
      console.log('FacilityDataUtils.getImageUrl - No images available, using fallback');
      return fallbackImage;
    }
    
    // Find featured image or use first one
    const featuredImage = facilityImages.find(img => img.is_featured);
    const imageToUse = featuredImage || facilityImages[0];
    
    console.log('FacilityDataUtils.getImageUrl - Selected image:', imageToUse);
    
    if (!imageToUse?.image_url) {
      console.log('FacilityDataUtils.getImageUrl - No image URL, using fallback');
      return fallbackImage;
    }
    
    // Handle both absolute URLs and relative paths
    let imageUrl = imageToUse.image_url;
    
    // If it's a relative path starting with /bilder or /Bilder, make it absolute
    if (imageUrl.startsWith('/bilder/') || imageUrl.startsWith('/Bilder/')) {
      imageUrl = imageUrl; // Keep as-is, the browser will resolve it correctly
    }
    // If it's already an absolute URL, keep it as-is
    else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      imageUrl = imageToUse.image_url;
    }
    // If it's some other format, use fallback
    else if (!imageUrl.startsWith('/')) {
      console.warn('FacilityDataUtils.getImageUrl - Unexpected image URL format:', imageUrl);
      imageUrl = fallbackImage;
    }
    
    console.log('FacilityDataUtils.getImageUrl - Final image URL:', imageUrl);
    
    return imageUrl;
  }

  /**
   * Transforms database images to frontend FacilityImage format
   */
  static transformImages(facilityId: number, dbImages?: any[]): FacilityImage[] {
    if (!dbImages || !Array.isArray(dbImages)) {
      return [];
    }

    return dbImages.map(img => ({
      id: img.id || '',
      facility_id: facilityId,
      image_url: img.image_url || '',
      alt_text: img.alt_text || null,
      caption: img.caption || null,
      display_order: img.display_order || 0,
      is_featured: img.is_featured || false,
      file_size: img.file_size || null,
      uploaded_by: img.uploaded_by || null,
      uploaded_at: img.uploaded_at || new Date().toISOString(),
      created_at: img.created_at || new Date().toISOString()
    }));
  }

  /**
   * Formats the season date range
   */
  static formatSeason(seasonFrom?: string | null, seasonTo?: string | null): { from: string; to: string } {
    return {
      from: seasonFrom || '2024-01-01',
      to: seasonTo || '2024-12-31'
    };
  }

  /**
   * Formats price for display
   */
  static formatPrice(price: number, locale: string = 'nb-NO'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Transforms database opening hours to frontend format
   */
  static transformOpeningHours(dbOpeningHours?: any[]): OpeningHours[] {
    if (!dbOpeningHours || !Array.isArray(dbOpeningHours)) {
      return [];
    }

    return dbOpeningHours.map(hour => ({
      dayOfWeek: hour.day_of_week as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      opens: hour.open_time || '09:00',
      closes: hour.close_time || '17:00'
    }));
  }

  /**
   * Transforms database zones to frontend format
   */
  static transformZones(dbZones?: any[]): Zone[] {
    if (!dbZones || !Array.isArray(dbZones)) {
      return [];
    }

    return dbZones.map(zone => ({
      id: zone.id || '',
      name: zone.name || '',
      facility_id: zone.facility_id || 0,
      type: zone.type || 'room',
      capacity: zone.capacity || 0,
      description: zone.description || null,
      is_main_zone: zone.is_main_zone || false,
      parent_zone_id: zone.parent_zone_id || null,
      bookable_independently: zone.bookable_independently || false,
      area_sqm: zone.area_sqm || null,
      floor: zone.floor || null,
      coordinates_x: zone.coordinates_x || null,
      coordinates_y: zone.coordinates_y || null,
      coordinates_width: zone.coordinates_width || null,
      coordinates_height: zone.coordinates_height || null,
      equipment: zone.equipment || null,
      accessibility_features: zone.accessibility_features || null,
      status: zone.status || 'active',
      created_at: zone.created_at || new Date().toISOString(),
      updated_at: zone.updated_at || new Date().toISOString(),
      
      // Legacy fields for backwards compatibility
      facilityId: zone.facility_id?.toString() || '',
      bookableIndependently: zone.bookable_independently || false,
      conflictRules: [],
      dimensions: zone.area_sqm ? {
        width: Math.sqrt(zone.area_sqm),
        length: Math.sqrt(zone.area_sqm),
        height: 3
      } : undefined
    }));
  }
}
