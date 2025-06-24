
import { useQuery } from '@tanstack/react-query';
import { userRepository } from '@/dal/UserRepository';
import { PaginationParams } from '@/types/api';

export function useUsers(pagination: PaginationParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', pagination],
    queryFn: async () => {
      const result = await userRepository.findAll(pagination);
      if (result.error) {
        throw new Error(result.error);
      }
      return {
        data: result.data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: result.data.length,
          totalPages: Math.ceil(result.data.length / pagination.limit),
          hasNext: pagination.page * pagination.limit < result.data.length,
          hasPrev: pagination.page > 1
        }
      };
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
      const result = await userRepository.findById(id);
      if (result.error) {
        throw new Error(result.error);
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
      const result = await userRepository.update(id, data);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    }
  };
}
