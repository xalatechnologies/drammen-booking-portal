import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../_shared/database.types.ts'

type Facility = Database['public']['Tables']['facilities']['Row']
type FacilityInsert = Database['public']['Tables']['facilities']['Insert']
type FacilityUpdate = Database['public']['Tables']['facilities']['Update']

export interface FacilityFilters {
  searchTerm?: string
  facilityType?: string
  location?: string
  accessibility?: string
  availableNow?: boolean
  page?: number
  limit?: number
}

export class FacilityRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async findAll(filters: FacilityFilters = {}) {
    const { page = 1, limit = 20, ...otherFilters } = filters
    const from = (page - 1) * limit
    const to = from + limit - 1

    console.log('FacilityRepository.findAll - Starting query with filters:', otherFilters);

    let query = this.supabase
      .from('facilities')
      .select(`
        *,
        facility_opening_hours(day_of_week, open_time, close_time, is_open),
        zones(id, name, type, capacity, bookable_independently),
        facility_images(id, image_url, alt_text, is_featured, display_order)
      `, { count: 'exact' })
      .eq('status', 'active')
      .range(from, to)
      .order('name')

    // Apply search filter
    if (otherFilters.searchTerm) {
      query = query.or(`name.ilike.%${otherFilters.searchTerm}%,description.ilike.%${otherFilters.searchTerm}%,type.ilike.%${otherFilters.searchTerm}%`)
    }

    // Apply facility type filter
    if (otherFilters.facilityType) {
      query = query.eq('type', otherFilters.facilityType)
    }

    // Apply location filter
    if (otherFilters.location) {
      query = query.or(`address_city.ilike.%${otherFilters.location}%,area.ilike.%${otherFilters.location}%`)
    }

    // Apply accessibility filter
    if (otherFilters.accessibility) {
      query = query.contains('accessibility_features', [otherFilters.accessibility])
    }

    const result = await query

    if (result.error) {
      console.error('FacilityRepository.findAll - Database error:', result.error)
      return result
    }

    console.log('FacilityRepository.findAll - Raw database result:', result.data?.[0]);

    // Transform the data to include featured image and images array
    const transformedData = result.data?.map(facility => {
      const images = facility.facility_images || []
      const featuredImage = images.find(img => img.is_featured === true) || null
      
      console.log(`FacilityRepository.findAll - Processing facility ${facility.id}:`, {
        name: facility.name,
        address_street: facility.address_street,
        address_city: facility.address_city,
        address_postal_code: facility.address_postal_code,
        imagesCount: images.length,
        featuredImage: featuredImage ? { id: featuredImage.id, is_featured: featuredImage.is_featured, image_url: featuredImage.image_url } : null,
        rawFacility: facility
      });
      
      return {
        ...facility,
        featuredImage,
        images: images.sort((a, b) => a.display_order - b.display_order),
        // Remove the facility_images property to avoid confusion
        facility_images: undefined
      }
    })

    console.log('FacilityRepository.findAll - Transformed result sample:', transformedData?.[0]);

    return {
      ...result,
      data: transformedData
    }
  }

  async findById(id: number) {
    console.log('FacilityRepository.findById - Starting query for ID:', id);

    const result = await this.supabase
      .from('facilities')
      .select(`
        *,
        facility_opening_hours(day_of_week, open_time, close_time, is_open),
        zones(
          id, name, type, capacity, description, 
          bookable_independently, equipment, accessibility_features,
          status, area_sqm
        ),
        facility_images(id, image_url, alt_text, is_featured, display_order, caption)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (result.error) {
      console.error('FacilityRepository.findById - Database error:', result.error)
      return result
    }

    console.log('FacilityRepository.findById - Raw database result:', result.data);

    // Transform the data to include featured image
    const facility = result.data
    const images = facility.facility_images || []
    const featuredImage = images.find(img => img.is_featured === true) || null
    
    console.log(`FacilityRepository.findById - Processing facility ${facility.id}:`, {
      name: facility.name,
      address_street: facility.address_street,
      address_city: facility.address_city,
      address_postal_code: facility.address_postal_code,
      imagesCount: images.length,
      featuredImage: featuredImage ? { id: featuredImage.id, is_featured: featuredImage.is_featured, image_url: featuredImage.image_url } : null,
      rawFacility: facility
    });
    
    return {
      ...result,
      data: {
        ...facility,
        featuredImage,
        images: images.sort((a, b) => a.display_order - b.display_order),
        // Remove the facility_images property to avoid confusion
        facility_images: undefined
      }
    }
  }

  async findByType(type: string) {
    return this.supabase
      .from('facilities')
      .select('*')
      .eq('type', type)
      .eq('status', 'active')
      .order('name')
  }

  async findByArea(area: string) {
    return this.supabase
      .from('facilities')
      .select('*')
      .ilike('area', `%${area}%`)
      .eq('status', 'active')
      .order('name')
  }

  async create(facilityData: FacilityInsert) {
    return this.supabase
      .from('facilities')
      .insert(facilityData)
      .select()
      .single()
  }

  async update(id: number, facilityData: FacilityUpdate) {
    return this.supabase
      .from('facilities')
      .update({ ...facilityData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  }

  async delete(id: number) {
    return this.supabase
      .from('facilities')
      .update({ status: 'inactive', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  }

  async getFacilityZones(facilityId: number) {
    return this.supabase
      .from('zones')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('status', 'active')
      .order('name')
  }

  async getFacilityOpeningHours(facilityId: number) {
    return this.supabase
      .from('facility_opening_hours')
      .select('*')
      .eq('facility_id', facilityId)
      .order('day_of_week')
  }
}
