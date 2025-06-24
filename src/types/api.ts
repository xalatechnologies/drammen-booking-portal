
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Add missing RepositoryResponse type
export interface RepositoryResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
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
