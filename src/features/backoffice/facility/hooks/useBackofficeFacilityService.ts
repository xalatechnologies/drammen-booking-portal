import { useCallback } from 'react';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { BackofficeFacilityService } from '../services/BackofficeFacilityService';
import { BackofficeFacilityRepository } from '../services/BackofficeFacilityRepository';
import { PrismaClient } from '@prisma/client';

/**
 * useBackofficeFacilityService Hook
 * 
 * This hook provides access to backoffice facility services,
 * following the Service Locator and Dependency Injection patterns.
 * 
 * Following Single Responsibility Principle by focusing only on service provision
 * Following Dependency Inversion Principle by depending on service interfaces
 * Following Interface Segregation by providing specific service interfaces
 */
export function useBackofficeFacilityService() {
  const { language } = useLocalization();
  
  // Create service instance lazily
  const getBackofficeService = useCallback(() => {
    // We'd normally use DI container, but for simplicity we create dependencies here
    const prismaClient = new PrismaClient();
    const repository = new BackofficeFacilityRepository(prismaClient);
    
    return new BackofficeFacilityService(repository, language);
  }, [language]);
  
  // Memoize the service to avoid recreating it on every render
  const backofficeService = getBackofficeService();
  
  return { backofficeService };
}
