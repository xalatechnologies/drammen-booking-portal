export interface RepositoryResponse<T> {
  data: T;
  error: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Update RepositoryResponse to include pagination
export interface RepositoryResponse<T> {
  data: T;
  error: string | null;
  pagination?: PaginationResponse;
}
