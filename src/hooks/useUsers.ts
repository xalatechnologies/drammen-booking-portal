
import { useQuery } from '@tanstack/react-query';
import { userRepository } from '@/dal/UserRepository';
import { UserService } from '@/services/UserService';
import { PaginationParams } from '@/types/api';

export function useUsers(pagination: PaginationParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', pagination],
    queryFn: async () => {
      const result = await UserService.getUsers(pagination);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch users');
      }
      return result.data;
    }
  });

  return {
    users: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch
  };
}

export function useUser(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const result = await UserService.getUserById(id);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch user');
      }
      return result.data;
    },
    enabled: !!id
  });

  return {
    user: data,
    isLoading,
    error,
    refetch
  };
}

export function useUsersByRole(role: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'role', role],
    queryFn: async () => {
      const result = await userRepository.findByRole(role);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!role
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch
  };
}

export function useUpdateUser() {
  return {
    updateUser: async (id: string, data: any) => {
      const result = await UserService.updateUser(id, data);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update user');
      }
      return result.data;
    }
  };
}
