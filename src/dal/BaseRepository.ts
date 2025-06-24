
export interface SimpleResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code?: string };
}

export interface BaseRepository<T = any> {
  getAll(): Promise<SimpleResponse<T[]>>;
  getById(id: string): Promise<SimpleResponse<T>>;
  create(data: Partial<T>): Promise<SimpleResponse<T>>;
  update(id: string, data: Partial<T>): Promise<SimpleResponse<T>>;
  delete(id: string): Promise<SimpleResponse<void>>;
}
