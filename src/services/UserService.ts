
import { userRepository } from '@/dal/UserRepository';
import { User, UserFilters, UserCreateRequest, UserUpdateRequest, UserRole } from '@/types/user';
import { PaginationParams, ApiResponse, PaginatedResponse, RepositoryResponse } from '@/types/api';

export class UserService {
  
  async getUsers(
    pagination?: PaginationParams,
    filters?: UserFilters,
    sortField?: keyof User,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    // Add delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    const result = await userRepository.findAll(pagination, filters?.searchTerm, sortField);
    
    // Convert RepositoryResponse to ApiResponse
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: {
        data: result.data || [],
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: result.data?.length || 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    };
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const result = await userRepository.findById(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const result = await userRepository.findByEmail(email);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async createUser(request: UserCreateRequest): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate email uniqueness
    const existingUser = await userRepository.findByEmail(request.email);
    if (existingUser.data) {
      return {
        success: false,
        error: {
          message: 'User with this email already exists'
        }
      };
    }

    const userData = {
      ...request,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      last_login_at: null,
      permissions: [],
      preferred_language: 'NO' as const
    };

    const result = await userRepository.create(userData);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async updateUser(id: string, request: UserUpdateRequest): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // If email is being updated, check uniqueness
    if (request.email) {
      const existingUser = await userRepository.findByEmail(request.email);
      if (existingUser.data && existingUser.data.id !== id) {
        return {
          success: false,
          error: {
            message: 'User with this email already exists'
          }
        };
      }
    }

    const result = await userRepository.update(id, request);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const result = await userRepository.delete(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async getUsersByRole(role: UserRole): Promise<ApiResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const result = await userRepository.findByRole(role);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async updateLastLogin(id: string): Promise<ApiResponse<User>> {
    const result = await userRepository.updateLastLogin(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async authenticateUser(email: string, password: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate auth delay
    
    const userResult = await userRepository.findByEmail(email);
    if (userResult.error) {
      return {
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      };
    }

    const user = userResult.data!;
    if (!user.is_active) {
      return {
        success: false,
        error: {
          message: 'User account is inactive'
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
    
    const result = await userRepository.update(userId, {
      role: newRole,
      permissions: permissions || []
    });

    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async deactivateUser(userId: string, reason?: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const result = await userRepository.update(userId, {
      is_active: false
    });

    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  async reactivateUser(userId: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const result = await userRepository.update(userId, {
      is_active: true
    });

    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
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
    if (allUsersResult.error) {
      return {
        success: false,
        error: { message: allUsersResult.error }
      };
    }

    const users = allUsersResult.data || [];
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
        activeUsers: users.filter(u => u.is_active).length,
        usersByRole,
        recentlyActive: users.filter(u => 
          u.last_login_at && new Date(u.last_login_at) > weekAgo
        ).length
      }
    };
  }
}

// Export singleton instance
export const userService = new UserService();
