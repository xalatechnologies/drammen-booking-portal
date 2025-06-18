
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { userService } from "@/services/UserService";
import { User, UserFilters, UserCreateRequest, UserUpdateRequest, UserRole } from "@/types/user";
import { PaginationParams } from "@/types/api";

interface UseUsersParams {
  pagination?: PaginationParams;
  filters?: UserFilters;
  sortField?: keyof User;
  sortDirection?: 'asc' | 'desc';
  enabled?: boolean;
}

export function useUsers({ 
  pagination, 
  filters, 
  sortField, 
  sortDirection = 'asc',
  enabled = true 
}: UseUsersParams) {
  const queryKey = useMemo(() => [
    'users',
    pagination,
    filters,
    sortField,
    sortDirection
  ], [pagination, filters, sortField, sortDirection]);

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => userService.getUsers(pagination, filters, sortField, sortDirection),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    users: response?.success ? response.data?.data || [] : [],
    pagination: response?.success ? response.data?.pagination : null,
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}

export function useUser(id: string, enabled: boolean = true) {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    user: response?.success ? response.data : null,
    isLoading,
    error: response?.success === false ? response.error : error,
    notFound: response?.success === false && response.error?.code === 'NOT_FOUND',
    refetch,
  };
}

export function useUsersByRole(role: UserRole, enabled: boolean = true) {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', 'by-role', role],
    queryFn: () => userService.getUsersByRole(role),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    users: response?.success ? response.data || [] : [],
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}

export function useUserStatistics(enabled: boolean = true) {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', 'statistics'],
    queryFn: () => userService.getUserStatistics(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    statistics: response?.success ? response.data : null,
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UserCreateRequest) => userService.createUser(request),
    onSuccess: () => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UserUpdateRequest }) =>
      userService.updateUser(id, request),
    onSuccess: (result, { id }) => {
      // Invalidate users queries and specific user query
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newRole, permissions }: { 
      userId: string; 
      newRole: UserRole; 
      permissions?: any[] 
    }) => userService.changeUserRole(userId, newRole, permissions),
    onSuccess: (result, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      userService.deactivateUser(userId, reason),
    onSuccess: (result, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}

export function useUsersPagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const pagination: PaginationParams = { page, limit };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));

  return {
    pagination,
    page,
    limit,
    goToPage,
    changeLimit,
    nextPage,
    prevPage,
  };
}
