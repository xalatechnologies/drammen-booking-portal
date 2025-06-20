
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrganizationService, Organization } from '@/services/OrganizationService';
import { PaginationParams } from '@/types/api';
import { toast } from 'sonner';

interface OrganizationFilters {
  type?: string;
  status?: string;
  search?: string;
}

export function useOrganizations(
  pagination?: PaginationParams,
  filters?: OrganizationFilters
) {
  return useQuery({
    queryKey: ['organizations', pagination, filters],
    queryFn: async () => {
      const result = await OrganizationService.getOrganizations(pagination, filters);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const result = await OrganizationService.getOrganizationById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUserOrganizations(userId?: string) {
  return useQuery({
    queryKey: ['user-organizations', userId],
    queryFn: async () => {
      const result = await OrganizationService.getUserOrganizations(userId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organizationData: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'status' | 'verification_level' | 'is_active'>) => {
      const result = await OrganizationService.createOrganization(organizationData);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      toast.success('Organization created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Organization> }) => {
      const result = await OrganizationService.updateOrganization(id, updates);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      toast.success('Organization updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update organization: ${error.message}`);
    },
  });
}
