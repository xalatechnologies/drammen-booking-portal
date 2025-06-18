
import { BaseRepository } from './BaseRepository';
import { User, UserFilters, UserCreateRequest, UserUpdateRequest } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';

export class UserRepository extends BaseRepository<User, UserFilters, UserCreateRequest, UserUpdateRequest> {
  constructor() {
    super(mockUsers);
  }

  protected getId(user: User): string {
    return user.id;
  }

  protected applyFilters(users: User[], filters: UserFilters): User[] {
    return users.filter(user => {
      // Role filter
      if (filters.role && user.role !== filters.role) {
        return false;
      }

      // Organization filter
      if (filters.organizationId && user.organizationId !== filters.organizationId) {
        return false;
      }

      // Active status filter
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          user.firstName,
          user.lastName,
          user.email,
          user.phone || ''
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchLower)) {
          return false;
        }
      }

      // Created after filter
      if (filters.createdAfter && user.createdAt < filters.createdAfter) {
        return false;
      }

      return true;
    });
  }

  protected createEntity(request: UserCreateRequest): User {
    const now = this.getCurrentTimestamp();
    
    return {
      id: this.generateId(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      role: request.role,
      organizationId: request.organizationId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      permissions: request.permissions || [],
      profile: {
        preferredLanguage: 'NO',
        notifications: {
          email: true,
          sms: false,
          push: true,
          bookingReminders: true,
          approvalUpdates: true,
          marketingEmails: false
        },
        bookingPreferences: {
          defaultDuration: 120,
          preferredTimeSlots: [],
          frequentFacilities: [],
          autoRebook: false
        }
      }
    };
  }

  protected updateEntity(existing: User, request: UserUpdateRequest): User {
    return {
      ...existing,
      ...request,
      updatedAt: this.getCurrentTimestamp(),
      profile: request.profile ? { ...existing.profile, ...request.profile } : existing.profile
    };
  }

  // User-specific methods
  async findByEmail(email: string) {
    const user = this.data.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { success: true, data: user } : { success: false, error: { message: 'User not found', code: 'NOT_FOUND' } };
  }

  async findByRole(role: string) {
    const users = this.data.filter(u => u.role === role);
    return { success: true, data: users };
  }

  async updateLastLogin(id: string) {
    const index = this.data.findIndex(u => u.id === id);
    if (index !== -1) {
      this.data[index].lastLoginAt = this.getCurrentTimestamp();
      return { success: true, data: this.data[index] };
    }
    return { success: false, error: { message: 'User not found', code: 'NOT_FOUND' } };
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
