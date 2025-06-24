
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface QueryOptions {
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: PaginationParams;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface PaginationInfo extends PaginationParams {
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T extends any[] ? { data: T; pagination?: PaginationInfo } : T;
  error?: ApiError;
}

export interface BaseRepository<T = any> {
  getAll(options?: QueryOptions): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  create(data: Partial<T>): Promise<ApiResponse<T>>;
  update(id: string, data: Partial<T>): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<void>>;
}
