/**
 * Supabase Database Client Implementation
 * 
 * Concrete implementation of the IDatabaseClient interface using Supabase.
 * Following SOLID principles:
 * - Single Responsibility: Only handles database operations via Supabase
 * - Open/Closed: Extendable without modifying core functionality
 * - Liskov Substitution: Fully implements IDatabaseClient interface
 * - Interface Segregation: Only implements methods needed for database operations
 * - Dependency Inversion: High-level modules depend on IDatabaseClient, not this implementation
 */

import { createClient } from '@supabase/supabase-js';
import { IDatabaseClient, QueryOptions } from '../interfaces/IDatabaseClient';
import { config } from '../../config/implementations/Config';

export class SupabaseClient implements IDatabaseClient {
  private supabaseClient;

  constructor() {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
    const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';
    
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  async getById<T>(table: string, id: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error fetching ${table} by ID:`, error);
      return null;
    }
  }

  async getMany<T>(table: string, options?: QueryOptions): Promise<T[]> {
    try {
      let query = this.supabaseClient.from(table).select('*');

      // Apply filters if provided
      if (options?.filters) {
        // Process filters built with FilterBuilder
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Extract operator and field from the filter key
            if (key.includes(':')) {
              const [operator, field] = key.split(':', 2);
              
              // Handle different operators
              switch (operator) {
                case 'eq':
                  query = query.eq(field, value);
                  break;
                case 'neq':
                  query = query.neq(field, value);
                  break;
                case 'gt':
                  query = query.gt(field, value);
                  break;
                case 'gte':
                  query = query.gte(field, value);
                  break;
                case 'lt':
                  query = query.lt(field, value);
                  break;
                case 'lte':
                  query = query.lte(field, value);
                  break;
                case 'in':
                  query = query.in(field, value as any[]);
                  break;
                case 'contains':
                  query = query.contains(field, value as any[]);
                  break;
                case 'search':
                  query = query.ilike(field, `%${value}%`);
                  break;
                case 'multilingual':
                  // Special handling for multilingual fields
                  if (field === 'name') {
                    query = query.or(`name->>NO.ilike.%${value}%,name->>EN.ilike.%${value}%`);
                  }
                  break;
                default:
                  query = query.eq(field, value);
              }
            } else {
              // Default to equals for simple filters
              query = query.eq(key, value);
            }
          }
        });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      // Apply sorting
      if (options?.orderBy) {
        query = query.order(options.orderBy, {
          ascending: options.orderDirection !== 'desc'
        });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as T[];
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
  }

  async insert<T>(table: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await this.supabaseClient
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result as T;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await this.supabaseClient
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as T;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  }

  async delete(table: string, id: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }
  }

  async executeQuery<T>(query: string | object, params?: any[]): Promise<T[]> {
    try {
      // For Supabase, we need to use RPC for custom queries
      if (typeof query === 'string') {
        // This is a simplified version - in a real implementation
        // you might need to create stored procedures in Supabase
        const { data, error } = await this.supabaseClient.rpc(query, params ? params[0] : {});
        
        if (error) throw error;
        return data as T[];
      } else {
        throw new Error('Object queries not supported in Supabase client');
      }
    } catch (error) {
      console.error('Error executing custom query:', error);
      return [];
    }
  }
}
