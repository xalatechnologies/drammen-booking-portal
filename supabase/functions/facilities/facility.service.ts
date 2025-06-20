
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { FacilityRepository, FacilityFilters } from './facility.repository.ts'
import { Database } from '../_shared/database.types.ts'

type Facility = Database['public']['Tables']['facilities']['Row']
type FacilityInsert = Database['public']['Tables']['facilities']['Insert']
type FacilityUpdate = Database['public']['Tables']['facilities']['Update']

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class FacilityService {
  private repository: FacilityRepository

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new FacilityRepository(supabase)
  }

  async getFacilities(filters: FacilityFilters = {}): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      const { data, error, count } = await this.repository.findAll(filters)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facilities',
            details: error
          }
        }
      }

      const { page = 1, limit = 20 } = filters
      const totalPages = Math.ceil((count || 0) / limit)

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facilities',
          details: error
        }
      }
    }
  }

  async getFacilityById(id: number): Promise<ApiResponse<Facility>> {
    try {
      const { data, error } = await this.repository.findById(id)

      if (error || !data) {
        return {
          success: false,
          error: {
            message: 'Facility not found',
            code: 'FACILITY_NOT_FOUND'
          }
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility',
          details: error
        }
      }
    }
  }

  async getFacilitiesByType(type: string): Promise<ApiResponse<Facility[]>> {
    try {
      const { data, error } = await this.repository.findByType(type)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facilities by type',
            details: error
          }
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facilities by type',
          details: error
        }
      }
    }
  }

  async getFacilitiesByArea(area: string): Promise<ApiResponse<Facility[]>> {
    try {
      const { data, error } = await this.repository.findByArea(area)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facilities by area',
            details: error
          }
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facilities by area',
          details: error
        }
      }
    }
  }

  async createFacility(facilityData: FacilityInsert): Promise<ApiResponse<Facility>> {
    try {
      // Validate required fields
      if (!facilityData.name || !facilityData.type || !facilityData.area) {
        return {
          success: false,
          error: {
            message: 'Missing required fields: name, type, area',
            code: 'VALIDATION_ERROR'
          }
        }
      }

      const { data, error } = await this.repository.create(facilityData)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to create facility',
            details: error
          }
        }
      }

      return {
        success: true,
        data: data!
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create facility',
          details: error
        }
      }
    }
  }

  async updateFacility(id: number, facilityData: FacilityUpdate): Promise<ApiResponse<Facility>> {
    try {
      const { data, error } = await this.repository.update(id, facilityData)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to update facility',
            details: error
          }
        }
      }

      return {
        success: true,
        data: data!
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update facility',
          details: error
        }
      }
    }
  }

  async deleteFacility(id: number): Promise<ApiResponse<Facility>> {
    try {
      const { data, error } = await this.repository.delete(id)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to delete facility',
            details: error
          }
        }
      }

      return {
        success: true,
        data: data!
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to delete facility',
          details: error
        }
      }
    }
  }

  async getFacilityZones(facilityId: number): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await this.repository.getFacilityZones(facilityId)

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facility zones',
            details: error
          }
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility zones',
          details: error
        }
      }
    }
  }
}
