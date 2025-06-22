/**
 * PrismaQueryBuilder
 * 
 * Single Responsibility: Build Prisma query structures from generic filters
 */

// Enum for filter operators - extracted for cleaner code
export enum FilterOperator {
  EQ = 'eq',
  NEQ = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  IN = 'in',
  CONTAINS = 'contains',
  SEARCH = 'search'
}

export class PrismaQueryBuilder {
  /**
   * Build a Prisma where clause from our generic filter structure
   * Maps repository field names to Prisma schema field names
   */
  public buildWhereClause(filters: Record<string, any>): any {
    const where: any = {};
    const orConditions: any[] = [];
    
    // Field mappings from repository/domain model to Prisma schema
    const fieldMappings: Record<string, string> = {
      'types': 'type', // Fix for the getAllFacilities test using 'types' instead of 'type'
      'price_per_hour': 'pricePerHour',
      'time_slot_duration': 'timeSlotDuration',
      'accessibility_features': 'accessibilityFeatures',
      'allowed_booking_types': 'allowedBookingTypes',
      'created_at': 'createdAt',
      'updated_at': 'updatedAt'
    };
    
    // Apply mappings and build where clause
    Object.entries(filters).forEach(([key, value]) => {
      // Map the key to its Prisma schema equivalent if it exists
      const mappedKey = fieldMappings[key] || key;
      
      // Special case for multilingual search
      if (key === 'multilingual:name') {
        orConditions.push(
          { nameEn: { contains: value, mode: 'insensitive' } },
          { nameNo: { contains: value, mode: 'insensitive' } }
        );
        return;
      }
      
      // Special case for 'name' to search in both nameEn and nameNo
      if (key === 'name' && typeof value === 'string') {
        orConditions.push(
          { nameEn: { contains: value, mode: 'insensitive' } },
          { nameNo: { contains: value, mode: 'insensitive' } }
        );
        return;
      }

      // Handle our operator syntax (e.g., "eq:fieldName")
      if (key.includes(':')) {
        const [operator, field] = key.split(':');
        // Map the field if needed
        const mappedField = fieldMappings[field] || field;
        
        switch (operator) {
          case FilterOperator.EQ:
            where[mappedField] = value;
            break;
          case FilterOperator.NEQ:
            where[mappedField] = { not: value };
            break;
          case FilterOperator.GT:
            where[mappedField] = { gt: value };
            break;
          case FilterOperator.GTE:
            where[mappedField] = { gte: value };
            break;
          case FilterOperator.LT:
            where[mappedField] = { lt: value };
            break;
          case FilterOperator.LTE:
            where[mappedField] = { lte: value };
            break;
          case FilterOperator.IN:
            where[mappedField] = { in: value };
            break;
          case FilterOperator.CONTAINS:
            if (Array.isArray(value)) {
              where[mappedField] = { hasEvery: value }; 
            } else {
              where[mappedField] = { contains: value, mode: 'insensitive' };
            }
            break;
          case FilterOperator.SEARCH:
            where[mappedField] = { contains: value, mode: 'insensitive' };
            break;
        }
      } else {
        // Simple equality filter with mapped key
        where[mappedKey] = value;
        
        // Special case for 'type' array check - handle if value is an array
        if (mappedKey === 'type' && Array.isArray(value)) {
          where[mappedKey] = { in: value };
        }
      }
    });
    
    console.log('Built where clause:', where);

    // Combine OR conditions if any exist
    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    return where;
  }
}
