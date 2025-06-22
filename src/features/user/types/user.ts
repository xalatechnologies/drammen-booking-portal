/**
 * User Domain Types
 * 
 * Core user domain types that represent the business entities
 * following Single Responsibility Principle by focusing only on domain model.
 */

// Core user profile information
export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// User preferences structure
export interface UserPreferences {
  language: 'NO' | 'EN';
  notifications: NotificationPreferences;
  accessibility?: string[];
  theme?: 'light' | 'dark' | 'system';
}

// Notification preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  pushNotifications: boolean;
}

// Request object for creating a new user profile
export interface CreateUserProfileRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  preferences?: UserPreferences;
}

// Request object for updating a user profile
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  preferences?: Partial<UserPreferences>;
}

// Filter options for user queries
export interface UserProfileFilters {
  email?: string;
  name?: string;
  userId?: string;
}
