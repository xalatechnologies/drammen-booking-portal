
import { PaginatedResponse, PaginationParams, ApiResponse } from '@/types/api';

export abstract class BaseRepository<T, TFilters = any, TCreateRequest = any, TUpdateRequest = any> {
  protected data: T[] = [];
  
  constructor(initialData: T[]) {
    this.data = [...initialData];
  }

  // Generic CRUD operations
  async findAll(
    pagination?: PaginationParams,
    filters?: TFilters,
    sortField?: keyof T,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      let filteredData = [...this.data];

      // Apply filters
      if (filters) {
        filteredData = this.applyFilters(filteredData, filters);
      }

      // Apply sorting
      if (sortField) {
        filteredData = this.applySorting(filteredData, sortField, sortDirection);
      }

      // Apply pagination
      if (pagination) {
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredData.length / pagination.limit);

        return {
          success: true,
          data: {
            data: paginatedData,
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              total: filteredData.length,
              totalPages,
              hasNext: pagination.page < totalPages,
              hasPrev: pagination.page > 1,
            },
          },
        };
      }

      return {
        success: true,
        data: {
          data: filteredData,
          pagination: {
            page: 1,
            limit: filteredData.length,
            total: filteredData.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch data',
          details: error,
        },
      };
    }
  }

  async findById(id: string): Promise<ApiResponse<T>> {
    try {
      const item = this.data.find(item => this.getId(item) === id);
      
      if (!item) {
        return {
          success: false,
          error: {
            message: 'Item not found',
            code: 'NOT_FOUND',
          },
        };
      }

      return {
        success: true,
        data: item,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch item',
          details: error,
        },
      };
    }
  }

  async create(createRequest: TCreateRequest): Promise<ApiResponse<T>> {
    try {
      const newItem = this.createEntity(createRequest);
      this.data.push(newItem);

      return {
        success: true,
        data: newItem,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create item',
          details: error,
        },
      };
    }
  }

  async update(id: string, updateRequest: TUpdateRequest): Promise<ApiResponse<T>> {
    try {
      const index = this.data.findIndex(item => this.getId(item) === id);
      
      if (index === -1) {
        return {
          success: false,
          error: {
            message: 'Item not found',
            code: 'NOT_FOUND',
          },
        };
      }

      const updatedItem = this.updateEntity(this.data[index], updateRequest);
      this.data[index] = updatedItem;

      return {
        success: true,
        data: updatedItem,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update item',
          details: error,
        },
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const index = this.data.findIndex(item => this.getId(item) === id);
      
      if (index === -1) {
        return {
          success: false,
          error: {
            message: 'Item not found',
            code: 'NOT_FOUND',
          },
        };
      }

      this.data.splice(index, 1);

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to delete item',
          details: error,
        },
      };
    }
  }

  // Abstract methods to be implemented by concrete repositories
  protected abstract getId(item: T): string;
  protected abstract applyFilters(data: T[], filters: TFilters): T[];
  protected abstract createEntity(createRequest: TCreateRequest): T;
  protected abstract updateEntity(existing: T, updateRequest: TUpdateRequest): T;

  // Default sorting implementation
  protected applySorting(data: T[], sortField: keyof T, sortDirection: 'asc' | 'desc'): T[] {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Utility methods
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  protected getCurrentTimestamp(): Date {
    return new Date();
  }
}
