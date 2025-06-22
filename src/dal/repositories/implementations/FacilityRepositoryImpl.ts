/**
 * Facility Repository Implementation
 * 
 * Extends BaseRepository and implements IFacilityRepository interface 
 * following SOLID principles with localization support.
 */

import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { FacilityFilterBuilder } from '@/core/database/interfaces/FilterBuilder';
import { BaseRepository } from '@/core/repositories/BaseRepository';
import { IFacilityRepository } from '../interfaces/IFacilityRepository';
import { Facility } from '@/types/facility';
import { FacilityFilters } from '@/types/facility';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Result, ErrorType } from '@/core/utils/result';

// Define facility DTO types here for database operations
export interface FacilityDTO {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  type: Record<string, string>;
  capacity?: number;
  area?: string;
  price_per_hour?: number;
  amenities?: string[];
  images?: any[];
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  address_country?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  has_auto_approval?: boolean;
  time_slot_duration?: number;
  accessibility_features?: string[];
  allowed_booking_types?: string[];
  rules?: Record<string, string>;
  contact_email?: string;
  contact_phone?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export type CreateFacilityRequest = Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFacilityRequest = Partial<Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Map facility DTO from database to domain model
 */
export function mapFacilityFromDTO(dto: FacilityDTO): Facility {
  return {
    id: dto.id,
    name: dto.name || {},
    description: dto.description || {},
    type: dto.type || {},
    capacity: dto.capacity,
    area: dto.area,
    pricePerHour: dto.price_per_hour,
    amenities: dto.amenities || [],
    images: dto.images?.map(img => ({
      image_url: img.image_url,
      alt_text: img.alt_text || '',
      caption: img.caption,
      display_order: img.display_order,
      is_featured: img.is_featured,
      uploaded_at: img.uploaded_at
    })) || [],
    address: dto.address_street ? {
      street: dto.address_street,
      city: dto.address_city || '',
      postalCode: dto.address_postal_code || '',
      country: dto.address_country || ''
    } : undefined,
    location: (dto.latitude && dto.longitude) ? {
      latitude: dto.latitude,
      longitude: dto.longitude
    } : undefined,
    status: dto.status,
    hasAutoApproval: dto.has_auto_approval,
    timeSlotDuration: dto.time_slot_duration,
    accessibilityFeatures: dto.accessibility_features || [],
    allowedBookingTypes: dto.allowed_booking_types || [],
    rules: dto.rules || {},
    contact: {
      email: dto.contact_email,
      phone: dto.contact_phone
    },
    createdAt: dto.created_at,
    updatedAt: dto.updated_at
  };
}

/**
 * Map facility domain model to DTO for database operations
 */
export function mapFacilityToDTO(entity: Facility): FacilityDTO {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    type: entity.type,
    capacity: entity.capacity,
    area: entity.area,
    price_per_hour: entity.pricePerHour,
    amenities: entity.amenities,
    images: entity.images,
    address_street: entity.address?.street,
    address_city: entity.address?.city,
    address_postal_code: entity.address?.postalCode,
    address_country: entity.address?.country,
    latitude: entity.location?.latitude,
    longitude: entity.location?.longitude,
    status: entity.status,
    has_auto_approval: entity.hasAutoApproval,
    time_slot_duration: entity.timeSlotDuration,
    accessibility_features: entity.accessibilityFeatures,
    allowed_booking_types: entity.allowedBookingTypes,
    rules: entity.rules,
    contact_email: entity.contact?.email,
    contact_phone: entity.contact?.phone,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt
  };
}

/**
 * Repository implementation for facility data access
 * Following SOLID principles:
 * - Single Responsibility: Only handles facility data access
 * - Open/Closed: Extends BaseRepository without modifying it
 * - Liskov Substitution: Can be used anywhere BaseRepository is expected
 * - Interface Segregation: Implements focused IFacilityRepository interface
 * - Dependency Inversion: Depends on abstractions (IDatabaseClient, ILocalizationService)
 */
export class FacilityRepository extends BaseRepository<Facility, FacilityDTO, string, CreateFacilityRequest, UpdateFacilityRequest, FacilityFilters> implements IFacilityRepository {
  /**
   * Constructor with dependency injection for database client and localization service
   * following Dependency Inversion Principle
   */
  constructor(
    protected readonly databaseClient: IDatabaseClient,
    private readonly localizationService?: ILocalizationService
  ) {
    super(databaseClient, 'facility'); // Use singular form for consistent naming
  }
  
  /**
   * Map facility DTO to domain model
   * @param dto The facility DTO from database
   * @returns Facility domain entity
   */
  protected mapFromDTO(dto: FacilityDTO): Facility {
    return mapFacilityFromDTO(dto);
  }
  
  /**
   * Map facility domain model to DTO
   * @param entity The facility domain entity
   * @returns FacilityDTO for database operations
   */
  protected mapToDTO(entity: Facility): FacilityDTO {
    return mapFacilityToDTO(entity);
  }
  
  /**
   * Map create request to DTO
   * @param createRequest The facility creation request
   * @returns Partial FacilityDTO for database insert
   */
  protected mapCreateToDTO(createRequest: CreateFacilityRequest): Partial<FacilityDTO> {
    // Create a partial facility with default values
    const facility: Partial<Facility> = {
      ...createRequest,
      hasAutoApproval: createRequest.hasAutoApproval ?? false,
      timeSlotDuration: createRequest.timeSlotDuration ?? 1,
      accessibilityFeatures: createRequest.accessibilityFeatures ?? [],
      allowedBookingTypes: createRequest.allowedBookingTypes ?? [],
      amenities: createRequest.amenities ?? [],
      images: createRequest.images ?? [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Map to DTO for database operation
    return mapFacilityToDTO(facility as Facility);
  }
  
  /**
   * Map update request to DTO
   * @param updateRequest The facility update request
   * @returns Partial FacilityDTO for database update
   */
  protected mapUpdateToDTO(updateRequest: UpdateFacilityRequest): Partial<FacilityDTO> {
    // Only include properties that are defined in the update request
    const partialDTO: Partial<FacilityDTO> = {};
    
    // Map basic properties with type safety
    if (updateRequest.name !== undefined) partialDTO.name = updateRequest.name;
    if (updateRequest.description !== undefined) partialDTO.description = updateRequest.description;
    if (updateRequest.type !== undefined) partialDTO.type = updateRequest.type;
    if (updateRequest.area !== undefined) partialDTO.area = updateRequest.area;
    if (updateRequest.status !== undefined) partialDTO.status = updateRequest.status;
    
    // Map address fields if present
    if (updateRequest.address) {
      if (updateRequest.address.street !== undefined) partialDTO.address_street = updateRequest.address.street;
      if (updateRequest.address.city !== undefined) partialDTO.address_city = updateRequest.address.city;
      if (updateRequest.address.postalCode !== undefined) partialDTO.address_postal_code = updateRequest.address.postalCode;
      if (updateRequest.address.country !== undefined) partialDTO.address_country = updateRequest.address.country;
    }
    
    // Map location fields if present
    if (updateRequest.location) {
      if (updateRequest.location.latitude !== undefined) partialDTO.latitude = updateRequest.location.latitude;
      if (updateRequest.location.longitude !== undefined) partialDTO.longitude = updateRequest.location.longitude;
    }
    
    // Map capacity and booking settings
    if (updateRequest.capacity !== undefined) partialDTO.capacity = updateRequest.capacity;
    if (updateRequest.pricePerHour !== undefined) partialDTO.price_per_hour = updateRequest.pricePerHour;
    if (updateRequest.hasAutoApproval !== undefined) partialDTO.has_auto_approval = updateRequest.hasAutoApproval;
    if (updateRequest.timeSlotDuration !== undefined) partialDTO.time_slot_duration = updateRequest.timeSlotDuration;
    
    // Map array fields
    if (updateRequest.accessibilityFeatures !== undefined) partialDTO.accessibility_features = updateRequest.accessibilityFeatures;
    if (updateRequest.allowedBookingTypes !== undefined) partialDTO.allowed_booking_types = updateRequest.allowedBookingTypes;
    if (updateRequest.amenities !== undefined) partialDTO.amenities = updateRequest.amenities;
    
    // Map contact fields if present
    if (updateRequest.contact) {
      if (updateRequest.contact.email !== undefined) partialDTO.contact_email = updateRequest.contact.email;
      if (updateRequest.contact.phone !== undefined) partialDTO.contact_phone = updateRequest.contact.phone;
    }
    
    // Map images if present
    if (updateRequest.images !== undefined) partialDTO.images = updateRequest.images;
    
    // Map rules if present
    if (updateRequest.rules !== undefined) partialDTO.rules = updateRequest.rules;
    
    // Always set updated_at to now
    partialDTO.updated_at = new Date();
    
    return partialDTO;
  }
  
  /**
   * Apply facility filters to a database query
   * @param filters The facility filters to apply
   * @param query The database query to extend
   * @returns Modified database query with filters applied
   */
  protected applyFilters(filters: FacilityFilters): FacilityFilterBuilder {
    let query = this.databaseClient.from<FacilityDTO>(this.tableName);
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    
    // Filter by types
    if (filters.types && filters.types.length > 0) {
      // Filtering in localized JSON columns requires special handling based on DB
      // This is pseudo-code, actual implementation depends on database
      query = query.filter(filters.types, 'type');
    }
    
    // Filter by facility name search term (localized text search)
    if (filters.name) {
      query = query.textSearch('name', filters.name);
    }
    
    // Filter by general search term
    if (filters.search) {
      // Search across multiple columns - implementation depends on database type
      query = query.textSearch(['name', 'description', 'type'], filters.search);
    }
    
    // Filter by minimum capacity
    if (filters.minCapacity !== undefined) {
      query = query.gte('capacity', filters.minCapacity);
    }
    
    // Filter by amenities - any match
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.containsAny('amenities', filters.amenities);
    }
    
    // Filter by accessibility features - any match
    if (filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0) {
      query = query.containsAny('accessibility_features', filters.accessibilityFeatures);
    }
    
    // Filter by booking types - any match
    if (filters.allowedBookingTypes && filters.allowedBookingTypes.length > 0) {
      query = query.containsAny('allowed_booking_types', filters.allowedBookingTypes);
    }
    
    // Filter by price per hour
    if (filters.maxPricePerHour !== undefined) {
      query = query.lte('price_per_hour', filters.maxPricePerHour);
    }
    
    // Add support for areas if needed
    if (filters.areas && filters.areas.length > 0) {
      query = query.in('area_id', filters.areas); // Assuming there's an area_id column
    }
    
    return query;
  }

  /**
   * Get facility by ID with localization support
   * @param id Facility ID
   * @returns Result containing the facility or error
   */
  async getById(id: string): Promise<Result<Facility>> {
    try {
      const result = await this.databaseClient
        .from<FacilityDTO>(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (result.error) {
        return {
          success: false,
          error: {
            type: ErrorType.DATABASE_ERROR,
            message: result.error.message,
            details: result.error
          }
        };
      }
      
      if (!result.data) {
        return {
          success: false,
          error: {
            type: ErrorType.NOT_FOUND,
            message: `Facility with ID ${id} not found`
          }
        };
      }
      
      return {
        success: true,
        data: this.mapFromDTO(result.data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          type: ErrorType.UNKNOWN_ERROR,
          message: error.message || 'Unknown error occurred while fetching facility',
          details: error
        }
      };
    }
  }
  
  /**
   * Update facility status
   * @param id Facility ID
   * @param status New status
   * @returns Result containing updated facility or error
   */
  async updateStatus(id: string, status: string): Promise<Result<Facility>> {
    try {
      // First check if facility exists
      const existingResult = await this.getById(id);
      
      if (!existingResult.success) {
        return existingResult;
      }
      
      // Update the facility status
      const result = await this.databaseClient
        .from<FacilityDTO>(this.tableName)
        .update({ 
          status,
          updated_at: new Date()
        })
        .eq('id', id)
        .single();
      
      if (result.error) {
        return {
          success: false,
          error: {
            type: ErrorType.DATABASE_ERROR,
            message: result.error.message,
            details: result.error
          }
        };
      }
      
      // After updating, fetch the latest version
      return this.getById(id);
    } catch (error: any) {
      return {
        success: false,
        error: {
          type: ErrorType.UNKNOWN_ERROR,
          message: error.message || 'Unknown error occurred while updating facility status',
          details: error
        }
      };
    }
  }
}
