
import { GenericSupabaseRepository } from '../GenericSupabaseRepository';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type DatabaseAdditionalService = Database['public']['Tables']['additional_services']['Row'];
type DatabaseAdditionalServiceInsert = Database['public']['Tables']['additional_services']['Insert'];

export class AdditionalServiceRepository extends GenericSupabaseRepository<AdditionalService, DatabaseAdditionalService> {
  protected tableName = 'additional_services';

  protected mapFromDatabase(dbRecord: DatabaseAdditionalService): AdditionalService {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      category: dbRecord.category as AdditionalService['category'],
      description: dbRecord.description || '',
      facilityIds: [], // This would need to be populated from a separate table if needed
      pricing: {
        basePrice: Number(dbRecord.base_price),
        currency: 'NOK',
        pricingType: dbRecord.pricing_model === 'per-hour' ? 'hourly' : dbRecord.pricing_model as 'flat' | 'per-person' | 'hourly' | 'daily' | 'per-item',
        actorTypeMultipliers: {
          'private-person': 1,
          'lag-foreninger': 1,
          'paraply': 1,
          'private-firma': 1,
          'kommunale-enheter': 1
        }
      },
      availability: {
        isAlwaysAvailable: !dbRecord.advance_booking_required,
        leadTimeHours: dbRecord.advance_booking_hours || 0,
        maxAdvanceBookingDays: 365,
        blackoutPeriods: []
      },
      requirements: {
        requiresMainBooking: true,
        equipmentProvided: [],
        equipmentRequired: dbRecord.equipment_required || []
      },
      metadata: {
        tags: []
      },
      isActive: dbRecord.is_active,
      createdAt: new Date(dbRecord.created_at),
      updatedAt: new Date(dbRecord.updated_at)
    };
  }

  protected mapToDatabase(frontendRecord: Partial<AdditionalService>): Partial<DatabaseAdditionalServiceInsert> {
    return {
      name: frontendRecord.name,
      category: frontendRecord.category as any,
      description: frontendRecord.description,
      base_price: frontendRecord.pricing?.basePrice || 0,
      pricing_model: frontendRecord.pricing?.pricingType === 'hourly' ? 'per-hour' : (frontendRecord.pricing?.pricingType || 'fixed'),
      advance_booking_required: frontendRecord.availability ? !frontendRecord.availability.isAlwaysAvailable : false,
      advance_booking_hours: frontendRecord.availability?.leadTimeHours,
      equipment_required: frontendRecord.requirements?.equipmentRequired,
      is_active: frontendRecord.isActive,
      staff_required: false,
      minimum_quantity: 1
    };
  }

  // Override findAll to add filtering support
  async findAllWithFilters(
    pagination?: PaginationParams,
    filters?: ServiceFilters
  ): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*');

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }
      if (filters?.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      const mappedData = (data || []).map(record => this.mapFromDatabase(record as DatabaseAdditionalService));

      return {
        data: mappedData,
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getAllByCategory(category: string): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      const { data, error } = await supabase
        .from('additional_services')
        .select('*')
        .eq('category', category)
        .eq('is_active', true);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      const mappedData = (data || []).map(record => this.mapFromDatabase(record as DatabaseAdditionalService));

      return {
        data: mappedData,
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const additionalServiceRepository = new AdditionalServiceRepository();
