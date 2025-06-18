
import { userRepository } from '@/dal/UserRepository';
import { User, UserFilters, UserCreateRequest, UserUpdateRequest, UserRole } from '@/types/user';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';

export class UserService {
  
  async getUsers(
    pagination?: PaginationParams,
    filters?: UserFilters,
    sortField?: keyof User,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    // Add delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return userRepository.findAll(pagination, filters, sortField, sortDirection);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return userRepository.findByEmail(email);
  }

  async createUser(request: UserCreateRequest): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate email uniqueness
    const existingUser = await userRepository.findByEmail(request.email);
    if (existingUser.success) {
      return {
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 'EMAIL_EXISTS'
        }
      };
    }

    return userRepository.create(request);
  }

  async updateUser(id: string, request: UserUpdateRequest): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // If email is being updated, check uniqueness
    if (request.email) {
      const existingUser = await userRepository.findByEmail(request.email);
      if (existingUser.success && existingUser.data?.id !== id) {
        return {
          success: false,
          error: {
            message: 'User with this email already exists',
            code: 'EMAIL_EXISTS'
          }
        };
      }
    }

    return userRepository.update(id, request);
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return userRepository.delete(id);
  }

  async getUsersByRole(role: UserRole): Promise<ApiResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return userRepository.findByRole(role);
  }

  async updateLastLogin(id: string): Promise<ApiResponse<User>> {
    return userRepository.updateLastLogin(id);
  }

  async authenticateUser(email: string, password: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate auth delay
    
    const userResult = await userRepository.findByEmail(email);
    if (!userResult.success) {
      return {
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'AUTHENTICATION_FAILED'
        }
      };
    }

    const user = userResult.data!;
    if (!user.isActive) {
      return {
        success: false,
        error: {
          message: 'User account is inactive',
          code: 'ACCOUNT_INACTIVE'
        }
      };
    }

    // In real implementation, verify password hash
    // For demo purposes, we'll accept any password
    
    // Update last login
    await this.updateLastLogin(user.id);
    
    return {
      success: true,
      data: user
    };
  }

  async changeUserRole(userId: string, newRole: UserRole, permissions?: any[]): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return userRepository.update(userId, {
      role: newRole,
      permissions: permissions || []
    });
  }

  async deactivateUser(userId: string, reason?: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return userRepository.update(userId, {
      isActive: false
    });
  }

  async reactivateUser(userId: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return userRepository.update(userId, {
      isActive: true
    });
  }

  // Statistics and reporting
  async getUserStatistics(): Promise<ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<UserRole, number>;
    recentlyActive: number;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allUsersResult = await userRepository.findAll();
    if (!allUsersResult.success) {
      return allUsersResult as any;
    }

    const users = allUsersResult.data!.data;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const usersByRole: Record<UserRole, number> = {
      'system-admin': 0,
      'facility-manager': 0,
      'caseworker': 0,
      'municipal-staff': 0,
      'organization-rep': 0,
      'regular-user': 0
    };

    users.forEach(user => {
      usersByRole[user.role]++;
    });

    return {
      success: true,
      data: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        usersByRole,
        recentlyActive: users.filter(u => 
          u.lastLoginAt && u.lastLoginAt > weekAgo
        ).length
      }
    };
  }
}

// Export singleton instance
export const userService = new UserService();
