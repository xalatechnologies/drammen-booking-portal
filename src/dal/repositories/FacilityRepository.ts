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

const computeAddress = (location: any): string => {
  const addressParts = [
    location.address_street,
    location.address_city,
    location.address_postal_code
  ].filter(part => part && part.trim() !== '');
  
  return addressParts.length > 0 ? addressParts.join(', ') : location.address || 'Address not available';
};

export class FacilityRepository extends SupabaseRepository<Facility> {
  protected tableName = 'app_locations';

  constructor() {
    super();
    console.log("FacilityRepository - Using Supabase backend");
  }

  async getAll(pagination?: PaginationParams, filters?: FacilityFilters): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      console.log("FacilityRepository.getAll - Starting query with filters:", filters);
      
      // Start with a simple query first to test connectivity
      let query = supabase
        .from('app_locations')
        .select('*', { count: 'exact' })
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

      console.log("FacilityRepository.getAll - Executing basic query");
      const { data, error, count } = await query;

      if (error) {
        console.error("FacilityRepository.getAll - Database error:", error);
        return {
          success: false,
          error: {
            message: 'Failed to fetch facilities',
            details: error
          }
        };
      }

      console.log("FacilityRepository.getAll - Raw data received:", data?.length || 0, "facilities");

      // Process facilities without trying to fetch images for now
      const facilities = (data || []).map((location: any): Facility => {
        // Generate a simple numeric ID from UUID for backwards compatibility
        const facilityId = Math.abs(location.id.split('-')[0].split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0));
        
        return {
          id: facilityId,
          name: getLocalizedText(location.name, 'Unknown Facility'),
          address_street: location.address_street || location.address || '',
          address_city: location.address_city || '',
          address_postal_code: location.address_postal_code || '',
          address_country: location.address_country || 'Norway',
          type: location.location_type || 'facility',
          status: normalizeStatus(location.status || 'active'),
          image_url: location.image || null,
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
          contact_name: location.contact_name || null,
          contact_email: location.contact_email || null,
          contact_phone: location.contact_phone || null,
          booking_lead_time_hours: location.booking_lead_time_hours || 2,
          max_advance_booking_days: location.max_advance_booking_days || 365,
          cancellation_deadline_hours: location.cancellation_deadline_hours || 24,
          is_featured: location.is_featured || false,
          created_at: location.created_at,
          updated_at: location.updated_at,
          area_sqm: location.area_sqm || null,
          // Computed/derived fields for backwards compatibility
          address: computeAddress(location),
          image: location.image || '',
          pricePerHour: location.price_per_hour || 450,
          accessibility: location.accessibility_features || [],
          suitableFor: [],
          hasAutoApproval: location.has_auto_approval || false,
          nextAvailable: location.next_available || 'Available now',
          openingHours: [],
          zones: [],
          featuredImage: undefined,
          images: [],
          timeSlotDuration: location.time_slot_duration === 60 ? 1 : 2,
          availableTimes: [],
          season: {
            from: location.season_from || '',
            to: location.season_to || ''
          }
        };
      });

      console.log("FacilityRepository.getAll - Processed facilities:", facilities.length);

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
      console.error("FacilityRepository.getAll - Catch error:", error);
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
      console.log("FacilityRepository.getById - Fetching facility with ID:", id);
      
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error("FacilityRepository.getById - Database error:", error);
        return {
          success: false,
          error: {
            message: 'Failed to fetch facility',
            details: error
          }
        };
      }

      // Generate a simple numeric ID from UUID for backwards compatibility
      const facilityId = Math.abs(data.id.split('-')[0].split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0));

      const facility: Facility = {
        id: facilityId,
        name: getLocalizedText(data.name, 'Unknown Facility'),
        address_street: data.address_street || data.address || '',
        address_city: data.address_city || '',
        address_postal_code: data.address_postal_code || '',
        address_country: data.address_country || 'Norway',
        type: data.location_type || 'facility',
        status: normalizeStatus(data.status || 'active'),
        image_url: data.image || null,
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
        // Computed/derived fields for backwards compatibility
        address: computeAddress(data),
        image: data.image || '',
        pricePerHour: data.price_per_hour || 450,
        accessibility: data.accessibility_features || [],
        suitableFor: [],
        hasAutoApproval: data.has_auto_approval || false,
        nextAvailable: data.next_available || 'Available now',
        openingHours: [],
        zones: [],
        featuredImage: undefined,
        images: [],
        timeSlotDuration: data.time_slot_duration === 60 ? 1 : 2,
        availableTimes: [],
        season: {
          from: data.season_from || '',
          to: data.season_to || ''
        }
      };

      console.log("FacilityRepository.getById - Processed facility:", facility);

      return {
        success: true,
        data: facility
      };
    } catch (error) {
      console.error("FacilityRepository.getById - Catch error:", error);
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
    return {
      success: false,
      error: {
        message: 'Create functionality not implemented yet'
      }
    };
  }

  async updateAsync(id: string, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    return {
      success: false,
      error: {
        message: 'Update functionality not implemented yet'
      }
    };
  }

  async deleteAsync(id: string): Promise<ApiResponse<Facility>> {
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

export const facilityRepository = new FacilityRepository();
