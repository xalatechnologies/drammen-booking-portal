
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, Profile } from '@/services/ProfileService';
import { toast } from 'sonner';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const result = await ProfileService.getCurrentProfile();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const result = await ProfileService.updateProfile(updates);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

export function useUserRoles(userId?: string) {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const result = await ProfileService.getUserRoles(userId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useHasRole(role: string, userId?: string) {
  return useQuery({
    queryKey: ['has-role', role, userId],
    queryFn: () => ProfileService.hasRole(role, userId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
