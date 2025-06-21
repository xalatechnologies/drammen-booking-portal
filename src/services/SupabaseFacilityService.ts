import { supabase } from '@/integrations/supabase/client';
import { Facility, FacilityFilters } from '@/types/facility';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';

export class SupabaseFacilityService {
  private static readonly BASE_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1';
  private static readonly ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGRvaWhveHpsaXZvdGhveXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mzk5MzksImV4cCI6MjA2NjAxNTkzOX0.4j3PYVkUpQZce-631weYhyICrUKfBk3LV5drs_tYExc';

  private static adaptDatabaseToFacility(dbFacility: any): Facility {
    console.log('SupabaseFacilityService - Raw facility from DB:', dbFacility);
    console.log('SupabaseFacilityService - Address fields from raw DB:', {
      street: dbFacility.address_street,
      city: dbFacility.address_city,
      postal: dbFacility.address_postal_code,
      country: dbFacility.address_country
    });
    
    // Get image from facility_images or fallback
    let image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
    
    if (dbFacility.facility_images && Array.isArray(dbFacility.facility_images) && dbFacility.facility_images.length > 0) {
      // Find featured image or use first one
      const featuredImage = dbFacility.facility_images.find(img => img.is_featured);
      const imageToUse = featuredImage || dbFacility.facility_images[0];
      if (imageToUse?.image_url) {
        image = imageToUse.image_url;
      }
    }

    console.log('SupabaseFacilityService - Using image:', image);

    // Direct mapping - keep all database fields as they are
    const facility: Facility = {
      // Database fields - keep exactly as they come from DB
      id: dbFacility.id,
      name: dbFacility.name || 'Unnamed Facility',
      address_street: dbFacility.address_street || '',
      address_city: dbFacility.address_city || '',
      address_postal_code: dbFacility.address_postal_code || '',
      address_country: dbFacility.address_country || 'Norway',
      type: dbFacility.type || '',
      area: dbFacility.area || '',
      status: dbFacility.status || 'active',
      capacity: dbFacility.capacity || 0,
      description: dbFacility.description || '',
      next_available: dbFacility.next_available,
      rating: dbFacility.rating,
      review_count: dbFacility.review_count || 0,
      price_per_hour: dbFacility.price_per_hour || 450,
      has_auto_approval: dbFacility.has_auto_approval || false,
      amenities: dbFacility.amenities || [],
      equipment: dbFacility.equipment || [],
      time_slot_duration: dbFacility.time_slot_duration || 1,
      latitude: dbFacility.latitude,
      longitude: dbFacility.longitude,
      accessibility_features: dbFacility.accessibility_features || [],
      allowed_booking_types: dbFacility.allowed_booking_types || ['engangs'],
      season_from: dbFacility.season_from,
      season_to: dbFacility.season_to,
      contact_name: dbFacility.contact_name,
      contact_email: dbFacility.contact_email,
      contact_phone: dbFacility.contact_phone,
      booking_lead_time_hours: dbFacility.booking_lead_time_hours || 2,
      max_advance_booking_days: dbFacility.max_advance_booking_days || 365,
      cancellation_deadline_hours: dbFacility.cancellation_deadline_hours || 24,
      is_featured: dbFacility.is_featured || false,
      created_at: dbFacility.created_at,
      updated_at: dbFacility.updated_at,
      area_sqm: dbFacility.area_sqm,
      image_url: image,

      // Computed/legacy fields for backward compatibility - use utility functions
      address: '', // Will be computed by utility
      image, // Direct assignment
      pricePerHour: dbFacility.price_per_hour || 450,
      accessibility: dbFacility.accessibility_features || [],
      suitableFor: [],
      hasAutoApproval: dbFacility.has_auto_approval || false,
      nextAvailable: dbFacility.next_available || 'Available now',
      openingHours: dbFacility.facility_opening_hours || [],
      zones: dbFacility.zones || [],
      featuredImage: dbFacility.facility_images?.find(img => img.is_featured),
      images: dbFacility.facility_images || [],
      timeSlotDuration: (dbFacility.time_slot_duration || 1) as 1 | 2,
      season: {
        from: dbFacility.season_from || '2024-01-01',
        to: dbFacility.season_to || '2024-12-31'
      },
      availableTimes: []
    };

    console.log('SupabaseFacilityService - Facility before address computation:', {
      id: facility.id,
      name: facility.name,
      address_street: facility.address_street,
      address_city: facility.address_city,
      address_postal_code: facility.address_postal_code,
      address_country: facility.address_country
    });

    // Compute address from individual fields
    const addressParts = [
      facility.address_street?.trim(),
      facility.address_city?.trim(),
      facility.address_postal_code?.trim()
    ].filter(part => part && part !== '');
    
    facility.address = addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
    
    console.log('SupabaseFacilityService - Final computed address:', facility.address);
    console.log('SupabaseFacilityService - Final adapted facility:', facility);
    return facility;
  }

  static async getFacilities(
    pagination?: PaginationParams,
    filters?: FacilityFilters,
    sort?: any
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      console.log('SupabaseFacilityService.getFacilities - Calling edge function with:', { pagination, filters, sort });

      const params = new URLSearchParams();
      
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      if (filters?.searchTerm) params.append('search', filters.searchTerm);
      if (filters?.facilityType) params.append('type', filters.facilityType);
      if (filters?.location) params.append('area', filters.location);
      if (sort?.field) params.append('sort_by', sort.field);
      if (sort?.direction) params.append('sort_direction', sort.direction);

      const url = `${this.BASE_URL}/facilities?${params.toString()}`;
      console.log('SupabaseFacilityService.getFacilities - Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilities - HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilities - Raw response:', result);

      if (result.success && result.data && Array.isArray(result.data.data)) {
        // Adapt database facilities to frontend format
        const adaptedFacilities = result.data.data.map((facility: any) => 
          this.adaptDatabaseToFacility(facility)
        );
        
        console.log('SupabaseFacilityService.getFacilities - Adapted facilities:', adaptedFacilities.slice(0, 2));

        return {
          success: true,
          data: {
            data: adaptedFacilities,
            pagination: result.data.pagination
          }
        };
      }

      return {
        success: false,
        error: { message: 'Invalid response format from facilities endpoint' }
      };
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilities - Error:', error);
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async getFacilityById(id: number): Promise<ApiResponse<Facility>> {
    try {
      console.log('SupabaseFacilityService.getFacilityById - Calling edge function with ID:', id);

      const url = `${this.BASE_URL}/facilities/${id}`;
      console.log('SupabaseFacilityService.getFacilityById - Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilityById - HTTP error:', response.status, response.statusText);
        
        if (response.status === 404) {
          return {
            success: false,
            error: { message: 'Facility not found' }
          };
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilityById - Raw response:', result);

      if (result.success && result.data) {
        // Adapt database facility to frontend format
        const adaptedFacility = this.adaptDatabaseToFacility(result.data);
        console.log('SupabaseFacilityService.getFacilityById - Adapted facility:', adaptedFacility);

        return {
          success: true,
          data: adaptedFacility
        };
      }

      return {
        success: false,
        error: result.error || { message: 'Invalid response format from facility endpoint' }
      };
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilityById - Error:', error);
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async createFacility(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: this.adaptDatabaseToFacility(result.data)
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async updateFacility(id: number, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: this.adaptDatabaseToFacility(result.data)
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async deleteFacility(id: number): Promise<ApiResponse<Facility>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async getFacilityZones(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities/${id}/zones`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }
}
