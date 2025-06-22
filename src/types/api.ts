
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Import error type from our error handling utilities
import { AppError } from '@/core/utils/localized-error-handling';

// Repository response type for data access layer
export interface RepositoryResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}

// Service response type for service layer
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}

export interface PaginationParams {
  page: number;
  limit: number;
  pageSize: number; // Adding pageSize property to fix lint errors
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
  order: 'asc' | 'desc'; // Adding order property as an alias to maintain compatibility
}

export interface ErrorDetails {
  field?: string;
  message: string;
  code?: string;
}

export interface ValidationError {
  message: string;
  errors: ErrorDetails[];
}

// Generic list response
export interface ListResponse<T> {
  success: boolean;
  data: T[]; // Fixed: Changed from T[][] to T[]
  pagination?: PaginationMeta;
  error?: {
    message: string;
    code?: string;
  };
}

// Status responses
export interface StatusResponse {
  success: boolean;
  message?: string;
  error?: {
    message: string;
    code?: string;
  };
}

// Search and filter interfaces
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortParams;
  pagination?: PaginationParams;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface FilterGroup {
  name: string;
  label: string;
  options: FilterOption[];
  type: 'select' | 'checkbox' | 'range' | 'date';
}
