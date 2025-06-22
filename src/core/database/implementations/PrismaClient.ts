/**
 * Refactored Prisma Client Implementation
 * 
 * This class implements the IDatabaseClient interface using Prisma ORM.
 * Following SOLID principles:
 * - Single Responsibility: Each component has a single responsibility
 * - Open/Closed: Components can be extended without modifying existing code
 * - Liskov Substitution: Components can be substituted with different implementations
 * - Interface Segregation: Each component implements focused interfaces
 * - Dependency Inversion: Dependencies are injected and based on abstractions
 */

import { IDatabaseClient } from '../interfaces/IDatabaseClient';
import { QueryOptions, FilterOperator } from '@/types/database';
import { PrismaClient as PrismaORM } from '@prisma/client';
import { Result, ErrorType } from '@/core/utils/result';

// Import specialized components that follow Single Responsibility Principle
import { 
  PrismaModelNameMapper,
  PrismaDataTransformer,
  PrismaQueryBuilder 
} from './prisma';

export class PrismaClient implements IDatabaseClient {
  private prisma: PrismaORM;
  private modelNameMapper: PrismaModelNameMapper;
  private dataTransformer: PrismaDataTransformer;
  private queryBuilder: PrismaQueryBuilder;

  /**
   * Constructor that supports dependency injection
   * Default implementations are provided to maintain backward compatibility
   */
  constructor(
    prisma?: PrismaORM, 
    modelNameMapper?: PrismaModelNameMapper, 
    dataTransformer?: PrismaDataTransformer, 
    queryBuilder?: PrismaQueryBuilder
  ) {
    this.prisma = prisma || new PrismaORM();
    this.modelNameMapper = modelNameMapper || new PrismaModelNameMapper();
    this.dataTransformer = dataTransformer || new PrismaDataTransformer();
    this.queryBuilder = queryBuilder || new PrismaQueryBuilder();
  }
  
  /**
   * Static factory method to create a fully configured PrismaClient
   * Follows the Factory design pattern for easier instantiation
   */
  public static create(): PrismaClient {
    const prisma = new PrismaORM();
    const modelNameMapper = new PrismaModelNameMapper();
    const dataTransformer = new PrismaDataTransformer();
    const queryBuilder = new PrismaQueryBuilder();
    
    return new PrismaClient(prisma, modelNameMapper, dataTransformer, queryBuilder);
  }

  /**
   * Get a record by ID
   * Delegates to specialized components for model name mapping and data transformation
   */
  async getById<T>(table: string, id: string): Promise<Result<T>> {
    try {
      // Input validation
      if (!id || !table) {
        console.error('Invalid ID or table name provided');
        return Result.failure<T>({
          type: ErrorType.VALIDATION_ERROR,
          message: 'Invalid ID or table name provided'
        });
      }
      
      // Get Prisma model name using the specialized mapper component
      const modelName = this.modelNameMapper.getPrismaModelName(table);
      
      if (!modelName) {
        console.error(`Model for table ${table} does not exist in Prisma schema`);
        return Result.failure<T>({
          type: ErrorType.DATABASE_ERROR,
          message: `Model for table ${table} does not exist in Prisma schema`
        });
      }
      
      // Find record by ID
      const result = await this.prisma[modelName].findUnique({
        where: { id }
      });
      
      if (!result) {
        console.log(`No record found with ID ${id} in table ${table}`);
        return Result.notFound<T>(`No record found with ID ${id} in table ${table}`, { id });
      }
      
      // Transform Prisma model to domain model using the specialized transformer component
      const domainResult = this.dataTransformer.transformPrismaToDomain(table, result);
      
      return Result.success<T>(domainResult as unknown as T);
    } catch (error) {
      console.error(`Error in getById for table ${table}:`, error);
      return Result.failure<T>({
        type: ErrorType.DATABASE_ERROR,
        message: `Error retrieving record with ID ${id} from ${table}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Get many records with filtering
   * Delegates to specialized components for query building and data transformation
   */
  async getMany<T>(table: string, filters?: Record<string, any>, options?: QueryOptions): Promise<Result<T[]>> {
    try {
      // Get Prisma model name using the specialized mapper component
      const modelName = this.modelNameMapper.getPrismaModelName(table);
      
      if (!modelName) {
        console.error(`Model for table ${table} does not exist in Prisma schema`);
        return Result.failure<T[]>({
          type: ErrorType.DATABASE_ERROR,
          message: `Model for table ${table} does not exist in Prisma schema`
        });
      }
      
      // Build a where clause from filters using the specialized query builder component
      const whereClause = filters ? this.queryBuilder.buildWhereClause(filters) : {};
      
      // Apply options (pagination, sorting, etc.)
      const queryOptions: any = {
        where: whereClause
      };
      
      if (options) {
        if (options.limit) {
          queryOptions.take = options.limit;
        }
        
        if (options.offset) {
          queryOptions.skip = options.offset;
        }
        
        if (options.sortBy) {
          queryOptions.orderBy = {
            [options.sortBy]: options.sortDirection || 'asc'
          };
        }
      }
      
      console.log(`Finding records in ${modelName} with options:`, queryOptions);
      
      // Execute query
      const results = await this.prisma[modelName].findMany(queryOptions);
      
      // Transform results back to domain models
      const domainResults = results.map(result => 
        this.dataTransformer.transformPrismaToDomain(table, result)
      ) as unknown as T[];
      
      return Result.success<T[]>(domainResults);
    } catch (error) {
      console.error(`Error in getMany for table ${table}:`, error);
      return Result.failure<T[]>({
        type: ErrorType.DATABASE_ERROR,
        message: `Error retrieving records from ${table}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Insert a new record
   * Delegates to specialized components for data transformation
   */
  async insert<T>(table: string, data: Partial<T>): Promise<Result<T>> {
    try {
      // Input validation
      if (!data || Object.keys(data).length === 0) {
        console.error(`Invalid data provided for insert operation on table ${table}`);
        return Result.failure<T>({
          type: ErrorType.VALIDATION_ERROR,
          message: `Invalid data provided for insert operation`
        });
      }
      
      // Get Prisma model name using the specialized mapper component
      const modelName = this.modelNameMapper.getPrismaModelName(table);
      
      if (!modelName) {
        console.error(`Model for table ${table} does not exist in Prisma schema`);
        return Result.failure<T>({
          type: ErrorType.DATABASE_ERROR,
          message: `Model for table ${table} does not exist in Prisma schema`
        });
      }
      
      // Transform data from domain model to Prisma model using the specialized transformer component
      const transformedData = this.dataTransformer.transformDataForPrisma(table, data);
      
      if (!transformedData) {
        console.error(`Failed to transform data for insert operation on table ${table}`);
        return Result.failure<T>({
          type: ErrorType.VALIDATION_ERROR,
          message: `Failed to transform data for insert operation`
        });
      }
      
      console.log(`Creating new ${modelName} with transformed data:`, JSON.stringify(transformedData));
      
      // Create record using transformed data
      const result = await this.prisma[modelName].create({
        data: transformedData
      });
      
      // Transform back to domain model format using the specialized transformer component
      const domainResult = this.dataTransformer.transformPrismaToDomain(table, result);
      
      return Result.success<T>(domainResult as unknown as T);
    } catch (error) {
      console.error(`Error in insert for table ${table}:`, error);
      return Result.failure<T>({
        type: ErrorType.DATABASE_ERROR,
        message: `Error inserting record into ${table}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Update an existing record
   * Delegates to specialized components for data transformation
   */
  async update<T>(table: string, id: string, data: Partial<T>): Promise<Result<T>> {
    try {
      // Input validation
      if (!id) {
        console.error(`Invalid ID provided for update operation on table ${table}`);
        return Result.failure<T>({
          type: ErrorType.VALIDATION_ERROR,
          message: `Invalid ID provided for update operation`
        });
      }
      
      if (!data || Object.keys(data).length === 0) {
        console.error(`Invalid data provided for update operation on table ${table}`);
        return Result.failure<T>({
          type: ErrorType.VALIDATION_ERROR,
          message: `Invalid data provided for update operation`
        });
      }
      
      // Get Prisma model name using the specialized mapper component
      const modelName = this.modelNameMapper.getPrismaModelName(table);
      
      if (!modelName) {
        console.error(`Model for table ${table} does not exist in Prisma schema`);
        return Result.failure<T>({
          type: ErrorType.DATABASE_ERROR,
          message: `Model for table ${table} does not exist in Prisma schema`
        });
      }

      // Check if record exists before updating
      const existingRecord = await this.prisma[modelName].findUnique({
        where: { id }
      });
      
      if (!existingRecord) {
        console.error(`Record with ID ${id} not found in table ${table}`);
        return Result.notFound<T>(`Record with ID ${id} not found in table ${table}`, { id });
      }
      
      // Transform data from domain model to Prisma model using the specialized transformer component
      const transformedData = this.dataTransformer.transformDataForPrisma(table, data);
      
      if (!transformedData) {
        console.error(`Failed to transform data for update operation on table ${table}`);
        return Result.failure<T>({
          type: ErrorType.VALIDATION_ERROR,
          message: `Failed to transform data for update operation`
        });
      }
      
      // Update record using transformed data
      const result = await this.prisma[modelName].update({
        where: { id },
        data: transformedData
      });
      
      // Transform back to domain model format using the specialized transformer component
      const domainResult = this.dataTransformer.transformPrismaToDomain(table, result);
      
      return Result.success<T>(domainResult as unknown as T);
    } catch (error) {
      console.error(`Error in update for table ${table}:`, error);
      return Result.failure<T>({
        type: ErrorType.DATABASE_ERROR,
        message: `Error updating record with ID ${id} in ${table}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Delete a record by ID
   */
  async delete<T>(table: string, id: string): Promise<Result<boolean>> {
    try {
      // Input validation
      if (!id) {
        console.error(`Invalid ID provided for delete operation on table ${table}`);
        return Result.failure<boolean>({
          type: ErrorType.VALIDATION_ERROR,
          message: `Invalid ID provided for delete operation`
        });
      }
      
      // Get Prisma model name using the specialized mapper component
      const modelName = this.modelNameMapper.getPrismaModelName(table);
      
      if (!modelName) {
        console.error(`Model for table ${table} does not exist in Prisma schema`);
        return Result.failure<boolean>({
          type: ErrorType.DATABASE_ERROR,
          message: `Model for table ${table} does not exist in Prisma schema`
        });
      }
      
      // Check if record exists before deleting
      const existingRecord = await this.prisma[modelName].findUnique({
        where: { id }
      });
      
      if (!existingRecord) {
        console.error(`Record with ID ${id} not found in table ${table}`);
        return Result.notFound<boolean>(`Record with ID ${id} not found in table ${table}`, { id });
      }
      
      // Delete record
      await this.prisma[modelName].delete({
        where: { id }
      });
      
      return Result.success<boolean>(true);
    } catch (error) {
      console.error(`Error in delete for table ${table}:`, error);
      return Result.failure<boolean>({
        type: ErrorType.DATABASE_ERROR,
        message: `Error deleting record with ID ${id} from ${table}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Count records with filtering
   */
  async count(table: string, filters?: Record<string, any>): Promise<Result<number>> {
    try {
      // Get Prisma model name using the specialized mapper component
      const modelName = this.modelNameMapper.getPrismaModelName(table);
      
      if (!modelName) {
        console.error(`Model for table ${table} does not exist in Prisma schema`);
        return Result.failure<number>({
          type: ErrorType.DATABASE_ERROR,
          message: `Model for table ${table} does not exist in Prisma schema`
        });
      }
      
      // Build a where clause from filters using the specialized query builder component
      const whereClause = filters ? this.queryBuilder.buildWhereClause(filters) : {};
      
      // Count records
      const count = await this.prisma[modelName].count({
        where: whereClause
      });
      
      return Result.success<number>(count);
    } catch (error) {
      console.error(`Error in count for table ${table}:`, error);
      return Result.failure<number>({
        type: ErrorType.DATABASE_ERROR,
        message: `Error counting records in ${table}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  /**
   * Execute a raw SQL query
   * @param query The SQL query string or object
   * @param params Optional query parameters
   * @returns An array of results
   */
  async executeQuery<T>(query: string | object, params?: any[]): Promise<T[]> {
    try {
      if (typeof query === 'string') {
        // Execute raw SQL query
        const results = await this.prisma.$queryRawUnsafe<T[]>(query, ...(params || []));
        return results;
      } else {
        // Execute Prisma query object
        console.error('Object-based queries are not supported yet');
        return [];
      }
    } catch (error) {
      console.error(`Error executing raw query:`, error);
      return [];
    }
  }
}