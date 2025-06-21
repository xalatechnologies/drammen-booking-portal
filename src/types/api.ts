
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
  data: T;
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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
