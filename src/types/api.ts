
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}

// Repository response types - simplified for direct data access
export interface RepositoryResponse<T> {
  data: T;
  error?: string;
}

// Service price calculation response type
export interface ServicePriceCalculation {
  basePrice: number;
  finalPrice: number;
  totalPrice: number;
  breakdown: {
    baseAmount: number;
    multiplierAmount: number;
    discountAmount: number;
    taxAmount: number;
  };
}

// Helper function to extract data from repository responses
export function extractData<T>(response: ApiResponse<PaginatedResponse<T[]>>): T[] {
  if (response.success && response.data) {
    return response.data.data;
  }
  return [];
}

export function extractPaginatedData<T>(response: ApiResponse<PaginatedResponse<T[]>>): PaginatedResponse<T[]> | null {
  if (response.success && response.data) {
    return response.data;
  }
  return null;
}
