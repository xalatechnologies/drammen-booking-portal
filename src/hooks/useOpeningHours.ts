
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openingHoursUtils } from '@/utils/supabase';
import { toast } from 'sonner';

export function useOpeningHours(facilityId: number) {
  return useQuery({
    queryKey: ['opening-hours', facilityId],
    queryFn: () => openingHoursUtils.getOpeningHours(facilityId),
    enabled: !!facilityId,
  });
}

export function useOpeningHoursMutations() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: ({ facilityId, hours }: { facilityId: number; hours: any[] }) =>
      openingHoursUtils.saveOpeningHours(facilityId, hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opening-hours'] });
      toast.success('Opening hours updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating opening hours: ${error.message}`);
    },
  });

  return {
    saveOpeningHours: saveMutation.mutate,
    isSaving: saveMutation.isPending,
  };
}
