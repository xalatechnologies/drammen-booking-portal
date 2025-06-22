/**
 * Error handling utilities
 * 
 * This file provides standardized error handling across the application
 * following the Single Responsibility Principle.
 */

import { ServiceResponse, RepositoryResponse } from '../../types/api';

export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION = 'VALIDATION',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
  originalError?: Error;
}

/**
 * Create a standardized application error
 */
export function createError(
  type: ErrorType, 
  message: string, 
  details?: Record<string, any>, 
  originalError?: Error
): AppError {
  return {
    type,
    message,
    details,
    originalError
  };
}

/**
 * Create a failed repository response
 */
export function createRepositoryError<T>(
  error: AppError
): RepositoryResponse<T> {
  return {
    success: false,
    error
  };
}

/**
 * Create a failed service response
 */
export function createServiceError<T>(
  error: AppError
): ServiceResponse<T> {
  return {
    success: false,
    error
  };
}

/**
 * Create a successful repository response
 */
export function createRepositorySuccess<T>(
  data: T
): RepositoryResponse<T> {
  return {
    success: true,
    data
  };
}

/**
 * Create a successful service response
 */
export function createServiceSuccess<T>(
  data: T
): ServiceResponse<T> {
  return {
    success: true,
    data
  };
}

/**
 * Handle common errors and convert to AppError
 */
export function handleCommonError(error: any): AppError {
  // Handle Supabase errors
  if (error?.code === 'PGRST116') {
    return createError(
      ErrorType.NOT_FOUND,
      'Resource not found',
      { code: error.code },
      error
    );
  }
  
  // Handle authentication errors
  if (error?.status === 401 || error?.code === 'PGRST101') {
    return createError(
      ErrorType.UNAUTHORIZED,
      'Authentication required',
      { status: error.status },
      error
    );
  }
  
  // Handle permission errors
  if (error?.status === 403) {
    return createError(
      ErrorType.FORBIDDEN,
      'Permission denied',
      { status: error.status },
      error
    );
  }
  
  // Default to internal error
  return createError(
    ErrorType.INTERNAL,
    error?.message || 'An unexpected error occurred',
    {},
    error instanceof Error ? error : new Error(String(error))
  );
}
