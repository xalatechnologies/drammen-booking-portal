
import { SupabaseRepository } from '../SupabaseRepository';
import { Facility, FacilityFilters, OpeningHours } from '@/types/facility';
import { supabaseFacilityRepository } from './SupabaseFacilityRepository';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';

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

export class FacilityRepository extends SupabaseRepository<Facility> {
  protected tableName = 'facilities';

  constructor() {
    super();
    console.log("FacilityRepository - Now using Supabase backend");
  }

  // Override all methods to use Supabase backend
  async getAll(pagination?: PaginationParams, filters?: FacilityFilters): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    console.log("FacilityRepository.getAll - Using Supabase backend", { pagination, filters });
    return supabaseFacilityRepository.getAll(pagination, filters);
  }

  async getById(id: string): Promise<ApiResponse<Facility>> {
    console.log("FacilityRepository.getById - Using Supabase backend", { id });
    return supabaseFacilityRepository.getById(id);
  }

  async createAsync(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    console.log("FacilityRepository.createAsync - Using Supabase backend", { facilityData });
    return supabaseFacilityRepository.createAsync(facilityData);
  }

  async updateAsync(id: string, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    console.log("FacilityRepository.updateAsync - Using Supabase backend", { id, facilityData });
    return supabaseFacilityRepository.updateAsync(id, facilityData);
  }

  async deleteAsync(id: string): Promise<ApiResponse<Facility>> {
    console.log("FacilityRepository.deleteAsync - Using Supabase backend", { id });
    return supabaseFacilityRepository.deleteAsync(id);
  }

  async getFacilitiesByType(type: string) {
    console.log("FacilityRepository.getFacilitiesByType - Using Supabase backend", { type });
    return supabaseFacilityRepository.getFacilitiesByType(type);
  }

  async getFacilitiesByArea(area: string) {
    console.log("FacilityRepository.getFacilitiesByArea - Using Supabase backend", { area });
    return supabaseFacilityRepository.getFacilitiesByArea(area);
  }

  async getFacilityZones(id: string) {
    console.log("FacilityRepository.getFacilityZones - Using Supabase backend", { id });
    return supabaseFacilityRepository.getFacilityZones(id);
  }
}

// Export singleton instance
export const facilityRepository = new FacilityRepository();
