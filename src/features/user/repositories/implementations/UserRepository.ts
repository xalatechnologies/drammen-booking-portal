/**
 * User Repository Implementation
 *
 * Implements IUserRepository interface following SOLID principles
 * Single Responsibility: Handles only user data access operations
 * Open/Closed: Open for extension but closed for modification
 * Liskov Substitution: Properly implements the interface contract
 * Interface Segregation: Uses focused interfaces
 * Dependency Inversion: Depends on abstractions (IDatabaseClient)
 */
import { IUserRepository } from '../interfaces/IUserRepository';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest, UserProfileFilters } from '../../types/user';
import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Result } from '@/core/utils/result';
import { ErrorType } from '@/core/utils/error-handling';

export class UserRepository implements IUserRepository {
  private readonly tableName = 'user_profiles';
  
  constructor(
    private readonly databaseClient: IDatabaseClient,
    private readonly localizationService: ILocalizationService
  ) {}
  
  /**
   * Create a new user profile
   */
  async createUserProfile(request: CreateUserProfileRequest): Promise<Result<UserProfile>> {
    try {
      const data = this.mapToDbModel(request);
      
      const result = await this.databaseClient.insert(this.tableName, data);
      
      if (!result) {
        return Result.fail({
          type: ErrorType.DATABASE_ERROR,
          message: this.localizationService.translate('errors:userProfileCreateFailed')
        });
      }
      
      return Result.success(this.mapToDomainModel(result));
    } catch (error) {
      console.error('Error creating user profile:', error);
      return Result.fail({
        type: ErrorType.DATABASE_ERROR,
        message: this.localizationService.translate('errors:userProfileCreateFailed')
      });
    }
  }
  
  /**
   * Get a user profile by ID
   */
  async getUserProfileById(id: string): Promise<Result<UserProfile>> {
    try {
      const result = await this.databaseClient.getById(this.tableName, id);
      
      if (!result) {
        return Result.fail({
          type: ErrorType.NOT_FOUND,
          message: this.localizationService.translate('errors:userProfileNotFound', { id })
        });
      }
      
      return Result.success(this.mapToDomainModel(result));
    } catch (error) {
      console.error('Error getting user profile:', error);
      return Result.fail({
        type: ErrorType.DATABASE_ERROR,
        message: this.localizationService.translate('errors:userProfileGetFailed', { id })
      });
    }
  }
  
  /**
   * Get user profile by user ID (auth ID)
   */
  async getUserProfileByUserId(userId: string): Promise<Result<UserProfile>> {
    try {
      const filters = { user_id: userId };
      
      const results = await this.databaseClient.getMany(
        this.tableName,
        { filters }
      );
      
      if (!results || results.length === 0) {
        return Result.fail({
          type: ErrorType.NOT_FOUND,
          message: this.localizationService.translate('errors:userProfileNotFoundByUserId', { userId })
        });
      }
      
      return Result.success(this.mapToDomainModel(results[0]));
    } catch (error) {
      console.error('Error getting user profile by user ID:', error);
      return Result.fail({
        type: ErrorType.DATABASE_ERROR,
        message: this.localizationService.translate('errors:userProfileGetFailed')
      });
    }
  }
  
  /**
   * Update an existing user profile
   */
  async updateUserProfile(id: string, request: UpdateUserProfileRequest): Promise<Result<UserProfile>> {
    try {
      const data = this.mapUpdateToDbModel(request);
      
      const result = await this.databaseClient.update(this.tableName, id, data);
      
      if (!result) {
        return Result.fail({
          type: ErrorType.NOT_FOUND,
          message: this.localizationService.translate('errors:userProfileUpdateFailed', { id })
        });
      }
      
      return Result.success(this.mapToDomainModel(result));
    } catch (error) {
      console.error('Error updating user profile:', error);
      return Result.fail({
        type: ErrorType.DATABASE_ERROR,
        message: this.localizationService.translate('errors:userProfileUpdateFailed', { id })
      });
    }
  }
  
  /**
   * Delete a user profile
   */
  async deleteUserProfile(id: string): Promise<Result<void>> {
    try {
      const result = await this.databaseClient.delete(this.tableName, id);
      
      if (!result) {
        return Result.fail({
          type: ErrorType.NOT_FOUND,
          message: this.localizationService.translate('errors:userProfileNotFound', { id })
        });
      }
      
      return Result.success(undefined);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return Result.fail({
        type: ErrorType.DATABASE_ERROR,
        message: this.localizationService.translate('errors:userProfileDeleteFailed', { id })
      });
    }
  }
  
  /**
   * Get all user profiles matching the provided filters
   */
  async getAllUserProfiles(filters: UserProfileFilters): Promise<Result<UserProfile[]>> {
    try {
      const dbFilters = this.mapFiltersToDbFilters(filters);
      
      const results = await this.databaseClient.getMany(
        this.tableName,
        { filters: dbFilters }
      );
      
      const userProfiles = results.map(result => this.mapToDomainModel(result));
      
      return Result.success(userProfiles);
    } catch (error) {
      console.error('Error getting user profiles:', error);
      return Result.fail({
        type: ErrorType.DATABASE_ERROR,
        message: this.localizationService.translate('errors:userProfilesGetFailed')
      });
    }
  }
  
  /**
   * Map domain model to database model
   */
  private mapToDbModel(user: CreateUserProfileRequest): Record<string, any> {
    return {
      user_id: user.userId,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone_number: user.phoneNumber,
      preferences: user.preferences ? JSON.stringify(user.preferences) : null
    };
  }
  
  /**
   * Map update request to database model
   */
  private mapUpdateToDbModel(update: UpdateUserProfileRequest): Record<string, any> {
    const result: Record<string, any> = {};
    
    if (update.firstName !== undefined) {
      result.first_name = update.firstName;
    }
    
    if (update.lastName !== undefined) {
      result.last_name = update.lastName;
    }
    
    if (update.email !== undefined) {
      result.email = update.email;
    }
    
    if (update.phoneNumber !== undefined) {
      result.phone_number = update.phoneNumber;
    }
    
    if (update.preferences !== undefined) {
      result.preferences = JSON.stringify(update.preferences);
    }
    
    return result;
  }
  
  /**
   * Map database model to domain model
   */
  private mapToDomainModel(data: Record<string, any>): UserProfile {
    return {
      id: data.id,
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phoneNumber: data.phone_number,
      preferences: data.preferences ? JSON.parse(data.preferences) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
  
  /**
   * Map domain filters to database filters
   */
  private mapFiltersToDbFilters(filters: UserProfileFilters): Record<string, any> {
    const result: Record<string, any> = {};
    
    if (filters.email) {
      result.email = { contains: filters.email };
    }
    
    if (filters.userId) {
      result.user_id = filters.userId;
    }
    
    if (filters.name) {
      result.OR = [
        { first_name: { contains: filters.name } },
        { last_name: { contains: filters.name } }
      ];
    }
    
    return result;
  }
}
