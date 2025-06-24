
import { SupabaseRepository } from '../SupabaseRepository';
import { Facility, FacilityFilters, OpeningHours } from '@/types/facility';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface FacilityCreateRequest {
  name: string;
  address: string;
  type: string;
  area: string;
  description: string;
  capacity: number;
  accessibility: string[];
  suitableFor: string[];
  equipment: string[];
  openingHours: OpeningHours[];
  image: string;
}

interface FacilityUpdateRequest extends Partial<FacilityCreateRequest> {
  nextAvailable?: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  amenities?: string[];
  hasAutoApproval?: boolean;
}

const getLocalizedText = (value: any, fallback: string = 'Unknown'): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    return value.no || value.en || value.nb || fallback;
  }
  return fallback;
};

const normalizeStatus = (status: string): 'active' | 'maintenance' | 'inactive' => {
  const validStatuses: ('active' | 'maintenance' | 'inactive')[] = ['active', 'maintenance', 'inactive'];
  return validStatuses.includes(status as any) ? status as any : 'active';
};

const normalizeBookingTypes = (types: string[]): ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[] => {
  const validTypes: ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[] = ['engangs', 'fastlan', 'rammetid', 'strotimer'];
  return types.filter(type => validTypes.includes(type as any)) as any[] || ['engangs'];
};

export class FacilityRepository extends SupabaseRepository<Facility> {
  protected tableName = 'app_locations';

  constructor() {
    super();
    console.log("FacilityRepository - Using Supabase backend");
  }

  async getAll(pagination?: PaginationParams, filters?: FacilityFilters): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      let query = supabase
        .from('app_locations')
        .select(`
          *,
          app_location_images (
            id,
            image_url,
            alt_text,
            is_featured,
            display_order,
            uploaded_at,
            created_at
          )
        `, { count: 'exact' })
        .eq('is_published', true);

      // Apply filters
      if (filters?.facilityType && filters.facilityType !== 'all') {
        query = query.eq('location_type', filters.facilityType);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      query = query.order('name');

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facilities',
            details: error
          }
        };
      }

      const facilities = (data || []).map((location: any): Facility => ({
        id: parseInt(location.id),
        name: getLocalizedText(location.name, 'Unknown Facility'),
        address_street: location.address || '',
        address_city: '',
        address_postal_code: '',
        address_country: 'Norway',
        type: location.location_type || 'facility',
        status: normalizeStatus(location.status || 'active'),
        image_url: location.app_location_images?.[0]?.image_url || null,
        capacity: location.capacity || 0,
        area: location.address || '',
        description: getLocalizedText(location.description, ''),
        next_available: location.next_available || null,
        rating: location.rating || null,
        review_count: location.review_count || 0,
        price_per_hour: location.price_per_hour || 450,
        has_auto_approval: location.has_auto_approval || false,
        amenities: location.amenities || [],
        time_slot_duration: location.time_slot_duration || 60,
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        accessibility_features: location.accessibility_features || [],
        equipment: location.equipment || [],
        allowed_booking_types: normalizeBookingTypes(location.allowed_booking_types || ['engangs']),
        season_from: location.season_from || null,
        season_to: location.season_to || null,
        contact_name: location.contact_name || null,  // This might be null in DB
        contact_email: location.contact_email || null,
        contact_phone: location.contact_phone || null,
        booking_lead_time_hours: location.booking_lead_time_hours || 2,
        max_advance_booking_days: location.max_advance_booking_days || 365,
        cancellation_deadline_hours: location.cancellation_deadline_hours || 24,
        is_featured: location.is_featured || false,
        created_at: location.created_at,
        updated_at: location.updated_at,
        area_sqm: location.area_sqm || null,
        // Computed/derived fields for backwards compatibility - all required to avoid conflicts
        address: location.address || '',
        image: location.app_location_images?.[0]?.image_url || '',
        pricePerHour: location.price_per_hour || 450,
        accessibility: location.accessibility_features || [],
        suitableFor: [],
        hasAutoApproval: location.has_auto_approval || false,
        nextAvailable: location.next_available || 'Available now',
        openingHours: [],
        zones: [],
        featuredImage: location.app_location_images?.find((img: any) => img.is_featured) ? {
          id: location.app_location_images.find((img: any) => img.is_featured).id,
          facility_id: parseInt(location.id),
          image_url: location.app_location_images.find((img: any) => img.is_featured).image_url,
          alt_text: location.app_location_images.find((img: any) => img.is_featured).alt_text || '',
          display_order: location.app_location_images.find((img: any) => img.is_featured).display_order || 0,
          is_featured: true,
          uploaded_at: location.app_location_images.find((img: any) => img.is_featured).uploaded_at || location.created_at,
          created_at: location.app_location_images.find((img: any) => img.is_featured).created_at || location.created_at
        } : undefined,
        images: (location.app_location_images || []).map((img: any) => ({
          id: img.id,
          facility_id: parseInt(location.id),
          image_url: img.image_url,
          alt_text: img.alt_text || '',
          display_order: img.display_order || 0,
          is_featured: img.is_featured || false,
          uploaded_at: img.uploaded_at || location.created_at,
          created_at: img.created_at || location.created_at
        })),
        timeSlotDuration: location.time_slot_duration === 60 ? 1 : 2,
        availableTimes: [],
        season: {
          from: location.season_from || '',
          to: location.season_to || ''
        }
      }));

      const totalPages = pagination ? Math.ceil((count || 0) / pagination.limit) : 1;

      return {
        success: true,
        data: {
          data: facilities,
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || facilities.length || 0,
            total: count || 0,
            totalPages,
            hasNext: pagination ? pagination.page < totalPages : false,
            hasPrev: pagination ? pagination.page > 1 : false
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facilities',
          details: error
        }
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<Facility>> {
    try {
      const { data, error } = await supabase
        .from('app_locations')
        .select(`
          *,
          app_location_images (
            id,
            image_url,
            alt_text,
            is_featured,
            display_order,
            uploaded_at,
            created_at
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facility',
            details: error
          }
        };
      }

      const facility: Facility = {
        id: parseInt(data.id),
        name: getLocalizedText(data.name, 'Unknown Facility'),
        address_street: data.address || '',
        address_city: '',
        address_postal_code: '',
        address_country: 'Norway',
        type: data.location_type || 'facility',
        status: normalizeStatus(data.status || 'active'),
        image_url: data.app_location_images?.[0]?.image_url || null,
        capacity: data.capacity || 0,
        area: data.address || '',
        description: getLocalizedText(data.description, ''),
        next_available: data.next_available || null,
        rating: data.rating || null,
        review_count: data.review_count || 0,
        price_per_hour: data.price_per_hour || 450,
        has_auto_approval: data.has_auto_approval || false,
        amenities: data.amenities || [],
        time_slot_duration: data.time_slot_duration || 60,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        accessibility_features: data.accessibility_features || [],
        equipment: data.equipment || [],
        allowed_booking_types: normalizeBookingTypes(data.allowed_booking_types || ['engangs']),
        season_from: data.season_from || null,
        season_to: data.season_to || null,
        contact_name: data.contact_name || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        booking_lead_time_hours: data.booking_lead_time_hours || 2,
        max_advance_booking_days: data.max_advance_booking_days || 365,
        cancellation_deadline_hours: data.cancellation_deadline_hours || 24,
        is_featured: data.is_featured || false,
        created_at: data.created_at,
        updated_at: data.updated_at,
        area_sqm: data.area_sqm || null,
        // Computed/derived fields for backwards compatibility - all required to avoid conflicts
        address: data.address || '',
        image: data.app_location_images?.[0]?.image_url || '',
        pricePerHour: data.price_per_hour || 450,
        accessibility: data.accessibility_features || [],
        suitableFor: [],
        hasAutoApproval: data.has_auto_approval || false,
        nextAvailable: data.next_available || 'Available now',
        openingHours: [],
        zones: [],
        featuredImage: data.app_location_images?.find((img: any) => img.is_featured) ? {
          id: data.app_location_images.find((img: any) => img.is_featured).id,
          facility_id: parseInt(data.id),
          image_url: data.app_location_images.find((img: any) => img.is_featured).image_url,
          alt_text: data.app_location_images.find((img: any) => img.is_featured).alt_text || '',
          display_order: data.app_location_images.find((img: any) => img.is_featured).display_order || 0,
          is_featured: true,
          uploaded_at: data.app_location_images.find((img: any) => img.is_featured).uploaded_at || data.created_at,
          created_at: data.app_location_images.find((img: any) => img.is_featured).created_at || data.created_at
        } : undefined,
        images: (data.app_location_images || []).map((img: any) => ({
          id: img.id,
          facility_id: parseInt(data.id),
          image_url: img.image_url,
          alt_text: img.alt_text || '',
          display_order: img.display_order || 0,
          is_featured: img.is_featured || false,
          uploaded_at: img.uploaded_at || data.created_at,
          created_at: img.created_at || data.created_at
        })),
        timeSlotDuration: data.time_slot_duration === 60 ? 1 : 2,
        availableTimes: [],
        season: {
          from: data.season_from || '',
          to: data.season_to || ''
        }
      };

      return {
        success: true,
        data: facility
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility',
          details: error
        }
      };
    }
  }

  async createAsync(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    // Implementation for creating facilities would go here
    return {
      success: false,
      error: {
        message: 'Create functionality not implemented yet'
      }
    };
  }

  async updateAsync(id: string, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    // Implementation for updating facilities would go here
    return {
      success: false,
      error: {
        message: 'Update functionality not implemented yet'
      }
    };
  }

  async deleteAsync(id: string): Promise<ApiResponse<Facility>> {
    // Implementation for deleting facilities would go here
    return {
      success: false,
      error: {
        message: 'Delete functionality not implemented yet'
      }
    };
  }

  async getFacilitiesByType(type: string) {
    return this.getAll(undefined, { facilityType: type });
  }

  async getFacilitiesByArea(area: string) {
    // Implementation for getting facilities by area would go here
    return {
      success: false,
      error: {
        message: 'Get by area functionality not implemented yet'
      }
    };
  }

  async getFacilityZones(id: string) {
    try {
      const { data, error } = await supabase
        .from('app_zones')
        .select('*')
        .eq('location_id', id)
        .eq('status', 'active');

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch zones',
            details: error
          }
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch zones',
          details: error
        }
      };
    }
  }
}

// Export singleton instance
export const facilityRepository = new FacilityRepository();
