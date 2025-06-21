
import { Facility } from '@/types/facility';

export class FacilityDataUtils {
  /**
   * Computes the full address from individual address components
   */
  static computeAddress(facility: Pick<Facility, 'address_street' | 'address_city' | 'address_postal_code'>): string {
    const addressParts = [
      facility.address_street,
      facility.address_city,
      facility.address_postal_code
    ].filter(part => part && part.trim() !== '');
    
    return addressParts.length > 0 ? addressParts.join(', ') : '';
  }

  /**
   * Gets the best image URL from facility images or returns fallback
   */
  static getImageUrl(facilityImages?: any[]): string {
    const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
    
    if (!facilityImages || !Array.isArray(facilityImages) || facilityImages.length === 0) {
      return fallbackImage;
    }
    
    // Find featured image or use first one
    const featuredImage = facilityImages.find(img => img.is_featured);
    const imageToUse = featuredImage || facilityImages[0];
    
    return imageToUse?.image_url || fallbackImage;
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
}
