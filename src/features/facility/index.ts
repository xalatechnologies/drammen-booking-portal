/**
 * Facility Feature Exports
 * 
 * Centralized exports for the facility feature.
 * Following SOLID principles for clean organization and dependency management.
 */

// Export types and interfaces
export * from './types/facility';
export * from './types/facilityDTO';

// Export repository interfaces
export * from './repositories/interfaces/IFacilityRepository';

// Export service interfaces
export * from './services/interfaces/IFacilityService';

// Export hooks
export * from './hooks';

// Export context
export * from './context/FacilityContext';
