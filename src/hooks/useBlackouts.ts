
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blackoutUtils } from '@/utils/supabase';
import { toast } from 'sonner';

export function useBlackouts(facilityId: number) {
  return useQuery({
    queryKey: ['blackouts', facilityId],
    queryFn: () => blackoutUtils.getBlackoutsByFacility(facilityId),
    enabled: !!facilityId,
  });
}

export function useBlackoutMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: blackoutUtils.createBlackout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blackouts'] });
      toast.success('Blackout period created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating blackout period: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blackoutUtils.deleteBlackout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blackouts'] });
      toast.success('Blackout period deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting blackout period: ${error.message}`);
    },
  });

  return {
    createBlackout: createMutation.mutate,
    deleteBlackout: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
