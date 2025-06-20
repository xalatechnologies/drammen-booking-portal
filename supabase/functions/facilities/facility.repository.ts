
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

    let query = this.supabase
      .from('facilities')
      .select(`
        *,
        facility_opening_hours(day_of_week, open_time, close_time, is_open),
        zones(id, name, type, capacity, bookable_independently)
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

    return query
  }

  async findById(id: number) {
    return this.supabase
      .from('facilities')
      .select(`
        *,
        facility_opening_hours(day_of_week, open_time, close_time, is_open),
        zones(
          id, name, type, capacity, description, 
          bookable_independently, equipment, accessibility_features,
          status, area_sqm
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()
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
