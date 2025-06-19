
import { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { StrøtimeSlot } from '@/types/booking/strøtimer';
import { StrotimeService } from '@/services/StrotimeService';

interface UseStrotimerProps {
  facilityId?: string;
  currentWeekStart: Date;
}

export function useStrotimer({ facilityId, currentWeekStart }: UseStrotimerProps) {
  const [strøtimer, setStrøtimer] = useState<StrøtimeSlot[]>([]);
  const [loadingStrøtimer, setLoadingStrøtimer] = useState(false);

  // Fetch strøtimer for the current week
  useEffect(() => {
    const fetchStrøtimer = async () => {
      if (!facilityId) return;
      
      setLoadingStrøtimer(true);
      try {
        const response = await StrotimeService.getAvailableStrøtimer({
          facilityId,
          startDate: currentWeekStart,
          endDate: addDays(currentWeekStart, 6)
        });
        
        if (response.success) {
          setStrøtimer(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch strøtimer:', error);
      } finally {
        setLoadingStrøtimer(false);
      }
    };

    fetchStrøtimer();
  }, [facilityId, currentWeekStart]);

  const handleStrøtimeBookingComplete = async (booking: any) => {
    // Refresh strøtimer after booking
    if (!facilityId) return;
    
    try {
      const response = await StrotimeService.getAvailableStrøtimer({
        facilityId,
        startDate: currentWeekStart,
        endDate: addDays(currentWeekStart, 6)
      });
      
      if (response.success) {
        setStrøtimer(response.data || []);
      }
    } catch (error) {
      console.error('Failed to refresh strøtimer:', error);
    }
  };

  return {
    strøtimer,
    loadingStrøtimer,
    handleStrøtimeBookingComplete
  };
}
