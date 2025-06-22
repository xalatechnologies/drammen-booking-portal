/**
 * ServiceResponse Type
 * 
 * A standardized response format for service operations
 * following SOLID principles with clean separation of concerns.
 */

// Error structure for service operations
export interface AppError {
  code?: string;
  message: string;
  details?: Record<string, any>;
}

// Success response with data
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error response
export interface ErrorResponse {
  success: false;
  error: AppError;
}

// Combined response type
export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse;
