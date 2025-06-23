
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityUtils } from '@/utils/supabase';
import { toast } from 'sonner';

export function useFacilities() {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: facilityUtils.getFacilities,
  });
}

export function useFacility(id: string) {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: () => facilityUtils.getFacilityById(id),
    enabled: !!id,
  });
}

export function useFacilityMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: facilityUtils.createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating facility: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      facilityUtils.updateFacility(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facility'] });
      toast.success('Facility updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating facility: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: facilityUtils.deleteFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting facility: ${error.message}`);
    },
  });

  return {
    createFacility: createMutation.mutate,
    updateFacility: updateMutation.mutate,
    deleteFacility: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
