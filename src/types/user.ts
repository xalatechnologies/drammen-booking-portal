
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permission[];
  profile: UserProfile;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  preferredLanguage: 'NO' | 'EN';
  notifications: NotificationPreferences;
  bookingPreferences: BookingPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingReminders: boolean;
  approvalUpdates: boolean;
  marketingEmails: boolean;
}

export interface BookingPreferences {
  defaultDuration: number;
  preferredTimeSlots: string[];
  frequentFacilities: string[];
  autoRebook: boolean;
}

export type UserRole = 
  | 'system-admin'
  | 'facility-manager' 
  | 'caseworker'
  | 'municipal-staff'
  | 'organization-rep'
  | 'regular-user';

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve';
  scope?: string; // facility ID, organization ID, etc.
}

export interface UserFilters {
  role?: UserRole;
  organizationId?: string;
  isActive?: boolean;
  searchTerm?: string;
  createdAfter?: Date;
}

export interface UserCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  permissions?: Permission[];
}

export interface UserUpdateRequest extends Partial<UserCreateRequest> {
  isActive?: boolean;
  profile?: Partial<UserProfile>;
}
