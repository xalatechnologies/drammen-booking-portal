/**
 * Filter Builder Interface and Implementations
 * 
 * Provides a way to build complex filters for database queries
 * following the Builder pattern and SOLID principles.
 */

/**
 * Base interface for all filter builders
 */
export interface IFilterBuilder {
  /**
   * Build the filter object to be used in database queries
   */
  build(): Record<string, any>;
  
  /**
   * Add an equals condition
   */
  equals(field: string, value: any): IFilterBuilder;
  
  /**
   * Add a not equals condition
   */
  notEquals(field: string, value: any): IFilterBuilder;
  
  /**
   * Add a greater than condition
   */
  greaterThan(field: string, value: number): IFilterBuilder;
  
  /**
   * Add a greater than or equal condition
   */
  greaterThanOrEqual(field: string, value: number): IFilterBuilder;
  
  /**
   * Add a less than condition
   */
  lessThan(field: string, value: number): IFilterBuilder;
  
  /**
   * Add a less than or equal condition
   */
  lessThanOrEqual(field: string, value: number): IFilterBuilder;
  
  /**
   * Add an in condition (value is in array)
   */
  in(field: string, values: any[]): IFilterBuilder;
  
  /**
   * Add a contains condition (array contains values)
   */
  contains(field: string, values: any[]): IFilterBuilder;
  
  /**
   * Add a search condition (text search)
   */
  search(field: string, value: string): IFilterBuilder;
  
  /**
   * Add a raw filter condition (implementation specific)
   */
  raw(condition: Record<string, any>): IFilterBuilder;
}

/**
 * Base implementation of the filter builder
 */
export abstract class BaseFilterBuilder implements IFilterBuilder {
  protected filters: Record<string, any> = {};
  
  build(): Record<string, any> {
    return this.filters;
  }
  
  equals(field: string, value: any): IFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[`eq:${field}`] = value;
    }
    return this;
  }
  
  notEquals(field: string, value: any): IFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[`neq:${field}`] = value;
    }
    return this;
  }
  
  greaterThan(field: string, value: number): IFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[`gt:${field}`] = value;
    }
    return this;
  }
  
  greaterThanOrEqual(field: string, value: number): IFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[`gte:${field}`] = value;
    }
    return this;
  }
  
  lessThan(field: string, value: number): IFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[`lt:${field}`] = value;
    }
    return this;
  }
  
  lessThanOrEqual(field: string, value: number): IFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[`lte:${field}`] = value;
    }
    return this;
  }
  
  in(field: string, values: any[]): IFilterBuilder {
    if (values && values.length > 0) {
      this.filters[`in:${field}`] = values;
    }
    return this;
  }
  
  contains(field: string, values: any[]): IFilterBuilder {
    if (values && values.length > 0) {
      this.filters[`contains:${field}`] = values;
    }
    return this;
  }
  
  search(field: string, value: string): IFilterBuilder {
    if (value) {
      this.filters[`search:${field}`] = value;
    }
    return this;
  }
  
  raw(condition: Record<string, any>): IFilterBuilder {
    this.filters = { ...this.filters, ...condition };
    return this;
  }
}

/**
 * Facility filter builder for building facility-specific filters
 */
export class FacilityFilterBuilder extends BaseFilterBuilder {
  /**
   * Add a multilingual name search condition
   */
  searchMultilingualName(value: string): IFilterBuilder {
    if (value) {
      // Instead of implementing the logic directly,
      // we use the raw method to add the appropriate filter
      this.filters['multilingual:name'] = value;
    }
    return this;
  }
}
