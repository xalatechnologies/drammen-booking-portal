
import { PaginationParams, RepositoryResponse } from '@/types/api';

export abstract class BaseRepository<T extends Record<string, any>> {
  protected data: T[];

  constructor(initialData: T[] = []) {
    this.data = [...initialData];
  }

  async findAll(
    pagination?: PaginationParams,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<T[]>> {
    try {
      let filteredData = [...this.data];

      // Apply sorting if specified
      if (orderBy) {
        filteredData.sort((a, b) => {
          const aValue = a[orderBy];
          const bValue = b[orderBy];
          
          if (aValue < bValue) return orderDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return orderDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination if specified
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit;
        filteredData = filteredData.slice(from, to);
      }

      return {
        data: filteredData
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    try {
      const item = this.data.find(item => this.getId(item) === id);
      return {
        data: item || null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    try {
      const newItem = this.createEntity(data);
      this.data.push(newItem);
      return {
        data: newItem
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    try {
      const index = this.data.findIndex(item => this.getId(item) === id);
      if (index === -1) {
        return {
          data: null,
          error: 'Item not found'
        };
      }

      const updatedItem = this.updateEntity(this.data[index], data);
      this.data[index] = updatedItem;
      
      return {
        data: updatedItem
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const index = this.data.findIndex(item => this.getId(item) === id);
      if (index === -1) {
        return {
          data: false,
          error: 'Item not found'
        };
      }

      this.data.splice(index, 1);
      return {
        data: true
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }

  // Abstract methods that must be implemented by subclasses
  protected abstract getId(item: T): string;
  protected abstract createEntity(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): T;
  protected abstract updateEntity(existing: T, data: Partial<Omit<T, 'id' | 'created_at'>>): T;

  // Utility methods for subclasses
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected getCurrentTimestamp(): Date {
    return new Date();
  }
}
