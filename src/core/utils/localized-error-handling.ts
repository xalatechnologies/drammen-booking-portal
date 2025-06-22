/**
 * Localized error handling utilities
 * 
 * This file provides standardized error handling with localization support
 * following the Single Responsibility Principle and extending the base error handling.
 */

import { ILocalizationService } from '../localization/interfaces/ILocalizationService';
import { RepositoryResponse, ServiceResponse } from '../../types/api';
import { ErrorType, AppError as BaseAppError, createError as baseCreateError } from './error-handling';

// Re-export ErrorType to maintain consistent import structure
export { ErrorType };

// Map error types to localization keys
const errorTypeToLocalizationKey: Record<ErrorType, string> = {
  [ErrorType.VALIDATION]: 'errors.validation',
  [ErrorType.NOT_FOUND]: 'errors.notFound',
  [ErrorType.UNAUTHORIZED]: 'errors.unauthorized',
  [ErrorType.FORBIDDEN]: 'errors.forbidden',
  [ErrorType.CONFLICT]: 'errors.conflict',
  [ErrorType.INTERNAL]: 'errors.internal',
  [ErrorType.EXTERNAL_SERVICE]: 'errors.externalService'
};

// Base error interface with localization key
export interface AppError extends Omit<BaseAppError, 'originalError'> {
  localizationKey?: string;
  parameters?: Record<string, any>;
  originalError?: Error | null;
}

// Create an application error with localization support
export function createError(
  type: ErrorType,
  message: string,
  details: Record<string, any> = {},
  originalError?: Error | null,
  localizationKey?: string,
  parameters?: Record<string, any>
): AppError {
  return {
    type,
    message,
    localizationKey: localizationKey || errorTypeToLocalizationKey[type],
    parameters,
    details,
    originalError
  };
}

// Repository response creation with error
export function createRepositoryError<T>(error: AppError): RepositoryResponse<T> {
  return {
    success: false,
    error
  };
}

// Repository response creation with success data
export function createRepositorySuccess<T>(data: T): RepositoryResponse<T> {
  return {
    success: true,
    data
  };
}

// Service response creation with error
export function createServiceError<T>(error: AppError): ServiceResponse<T> {
  return {
    success: false,
    error
  };
}

// Service response creation with success data
export function createServiceSuccess<T>(data: T): ServiceResponse<T> {
  return {
    success: true,
    data
  };
}

// Helper to get localized error message
export function getLocalizedErrorMessage(
  error: AppError,
  localizationService: ILocalizationService
): string {
  if (!error.localizationKey) {
    return error.message;
  }
  
  return localizationService.translate(error.localizationKey, error.parameters);
}

// Create validation error with field-specific messages
export function createValidationError(
  validationErrors: Record<string, string>,
  fieldLocalizationKeys?: Record<string, string>,
  message = 'Validation error occurred',
  localizationKey = 'errors.validationDetails'
): AppError {
  return createError(
    ErrorType.VALIDATION,
    message,
    { validationErrors },
    null,
    localizationKey,
    { fields: Object.keys(validationErrors).join(', ') }
  );
}

// Get localized validation errors for each field
export function getLocalizedValidationErrors(
  error: AppError,
  localizationService: ILocalizationService,
  fieldPrefix = 'validation.'
): Record<string, string> {
  if (error.type !== ErrorType.VALIDATION || !error.details?.validationErrors) {
    return {};
  }
  
  const validationErrors = error.details.validationErrors as Record<string, string>;
  const result: Record<string, string> = {};
  
  Object.entries(validationErrors).forEach(([field, message]) => {
    // Try to get localized message for this specific field error
    const fieldKey = `${fieldPrefix}${field}`;
    
    if (localizationService.hasTranslation(fieldKey)) {
      result[field] = localizationService.translate(fieldKey);
    } else {
      // Fallback to the original message
      result[field] = message;
    }
  });
  
  return result;
}
