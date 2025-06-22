/**
 * PrismaDataTransformer
 * 
 * Single Responsibility: Handle data transformations between domain entities and Prisma models
 */
export class PrismaDataTransformer {
  /**
   * Transform domain entity data to match Prisma schema model structure
   * Following Single Responsibility Principle by isolating data transformation
   */
  public transformDataForPrisma<T>(table: string, data: Partial<T>): any {
    if (!data) return null;
    
    // Make a deep copy to avoid modifying the original data object
    const transformedData: any = JSON.parse(JSON.stringify(data || {}));
    
    if (table === 'facility') {
      return this.transformFacilityForPrisma(transformedData);
    }
    
    // For other tables, return data as-is for now
    return transformedData;
  }
  
  /**
   * Transform Prisma model data back to domain entity format
   * Following Single Responsibility Principle by isolating data transformation
   */
  public transformPrismaToDomain<T>(table: string, data: any): T {
    if (!data) return {} as T;
    
    // Make a deep copy to avoid modifying the original data
    const domainData: any = JSON.parse(JSON.stringify(data));
    
    if (table === 'facility') {
      return this.transformFacilityToDomain(domainData);
    }
    
    // For other tables, return data as-is for now
    return domainData as T;
  }

  /**
   * Specifically handle facility data transformation for Prisma
   * Private method to encapsulate the implementation details
   */
  private transformFacilityForPrisma(transformedData: any): any {
    try {
      // Clean object to match Prisma schema fields
      const cleanedData: any = {};
      
      // Handle required ID field
      if (transformedData.id) {
        cleanedData.id = transformedData.id;
      }
      
      // Transform multilingual name field (required)
      if (transformedData.name) {
        cleanedData.nameEn = transformedData.name.EN;
        cleanedData.nameNo = transformedData.name.NO || transformedData.name.EN; // Fallback if NO not provided
      }
      
      // Handle type field (required)
      if (transformedData.type) {
        cleanedData.type = transformedData.type;
      } else {
        console.error('Required field type is missing in facility data');
        return null;
      }
      
      // Handle optional fields
      if (transformedData.area) cleanedData.area = transformedData.area;
      if (transformedData.status) cleanedData.status = transformedData.status;
      if (transformedData.capacity !== undefined) cleanedData.capacity = transformedData.capacity;
      
      // Handle price per hour (snake_case to camelCase)
      if (transformedData.price_per_hour !== undefined) {
        cleanedData.pricePerHour = transformedData.price_per_hour;
      } else if (transformedData.pricePerHour !== undefined) {
        cleanedData.pricePerHour = transformedData.pricePerHour;
      }
      
      // Handle time slot duration (snake_case to camelCase)
      if (transformedData.time_slot_duration !== undefined) {
        cleanedData.timeSlotDuration = transformedData.time_slot_duration;
      } else if (transformedData.timeSlotDuration !== undefined) {
        cleanedData.timeSlotDuration = transformedData.timeSlotDuration;
      }
      
      // Handle array fields
      if (transformedData.accessibility_features) {
        cleanedData.accessibilityFeatures = transformedData.accessibility_features;
      } else if (transformedData.accessibilityFeatures) {
        cleanedData.accessibilityFeatures = transformedData.accessibilityFeatures;
      }
      
      if (transformedData.allowed_booking_types) {
        cleanedData.allowedBookingTypes = transformedData.allowed_booking_types;
      } else if (transformedData.allowedBookingTypes) {
        cleanedData.allowedBookingTypes = transformedData.allowedBookingTypes;
      }
      
      if (transformedData.amenities) {
        cleanedData.amenities = transformedData.amenities;
      }
      
      // Handle JSON fields
      if (transformedData.description) cleanedData.description = transformedData.description;
      if (transformedData.location) cleanedData.location = transformedData.location;
      if (transformedData.openingHours) cleanedData.openingHours = transformedData.openingHours;
      
      // Ensure required fields are present
      if (!cleanedData.nameEn) {
        console.error('Required field nameEn is missing in facility data');
        return null; // Prevent database error by returning null
      }
      
      if (!cleanedData.nameNo) {
        cleanedData.nameNo = cleanedData.nameEn; // Use English as fallback
      }
      
      console.log('Transformed facility data:', cleanedData);
      return cleanedData;
    } catch (error) {
      console.error('Error transforming facility data for Prisma:', error);
      return null;
    }
  }

  /**
   * Specifically handle facility data transformation from Prisma to domain model
   * Private method to encapsulate the implementation details
   */
  private transformFacilityToDomain(domainData: any): any {
    try {
      // Transform flat fields back to multilingual nested objects
      if (domainData.nameEn !== undefined || domainData.nameNo !== undefined) {
        domainData.name = {
          EN: domainData.nameEn || '',
          NO: domainData.nameNo || domainData.nameEn || ''
        };
        delete domainData.nameEn;
        delete domainData.nameNo;
      }
      
      // Handle snake_case/camelCase conversion for consistency
      if (domainData.pricePerHour !== undefined) {
        domainData.price_per_hour = domainData.pricePerHour;
        delete domainData.pricePerHour;
      }
      
      if (domainData.timeSlotDuration !== undefined) {
        domainData.time_slot_duration = domainData.timeSlotDuration;
        delete domainData.timeSlotDuration;
      }
      
      if (domainData.accessibilityFeatures !== undefined) {
        domainData.accessibility_features = domainData.accessibilityFeatures;
        delete domainData.accessibilityFeatures;
      }
      
      if (domainData.allowedBookingTypes !== undefined) {
        domainData.allowed_booking_types = domainData.allowedBookingTypes;
        delete domainData.allowedBookingTypes;
      }
      
      // Handle potential date conversions if needed
      if (domainData.createdAt) {
        domainData.created_at = domainData.createdAt;
        delete domainData.createdAt;
      }
      
      if (domainData.updatedAt) {
        domainData.updated_at = domainData.updatedAt;
        delete domainData.updatedAt;
      }
      
      console.log('Transformed domain data:', domainData);
      return domainData;
    } catch (error) {
      console.error('Error transforming Prisma data to domain model:', error);
      // Return the original data as fallback
      return domainData;
    }
  }
}
