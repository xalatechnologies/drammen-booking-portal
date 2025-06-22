/**
 * User Repository Interface
 *
 * Defines the contract for user data access operations
 * following Interface Segregation and Dependency Inversion principles.
 */
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest, UserProfileFilters } from '../../types/user';
import { Result } from '@/core/utils/result';

export interface IUserRepository {
  /**
   * Create a new user profile
   */
  createUserProfile(request: CreateUserProfileRequest): Promise<Result<UserProfile>>;
  
  /**
   * Get a user profile by ID
   */
  getUserProfileById(id: string): Promise<Result<UserProfile>>;
  
  /**
   * Get user profile by user ID (auth ID)
   */
  getUserProfileByUserId(userId: string): Promise<Result<UserProfile>>;
  
  /**
   * Update an existing user profile
   */
  updateUserProfile(id: string, request: UpdateUserProfileRequest): Promise<Result<UserProfile>>;
  
  /**
   * Delete a user profile
   */
  deleteUserProfile(id: string): Promise<Result<void>>;
  
  /**
   * Get all user profiles matching the provided filters
   */
  getAllUserProfiles(filters: UserProfileFilters): Promise<Result<UserProfile[]>>;
}
