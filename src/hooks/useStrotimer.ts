
import { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { StrotimeService, StrotimeSlot } from '@/services/StrotimeService';

interface UseStrotimerProps {
  facilityId?: string;
  currentWeekStart: Date;
}

// Mock data for facility ID 2
const mockStrotimeSlots: StrotimeSlot[] = [
  {
    id: 'strotime-1',
    facility_id: 2,
    zone_id: 'zone-1',
    slot_date: '2025-06-24',
    start_time: '09:00',
    end_time: '10:00',
    duration_minutes: 60,
    price_per_slot: 150,
    max_participants: 5,
    current_participants: 2,
    is_available: true,
    published_at: '2025-06-20T10:00:00Z',
    published_by: 'admin-user-id',
    released_from_rammetid: true,
    original_booking_id: 'booking-123',
    created_at: '2025-06-20T10:00:00Z'
  },
  {
    id: 'strotime-2',
    facility_id: 2,
    zone_id: 'zone-1',
    slot_date: '2025-06-24',
    start_time: '18:00',
    end_time: '19:00',
    duration_minutes: 60,
    price_per_slot: 200,
    max_participants: 6,
    current_participants: 4,
    is_available: true,
    published_at: '2025-06-20T14:00:00Z',
    published_by: 'admin-user-id',
    released_from_rammetid: true,
    original_booking_id: 'booking-124',
    created_at: '2025-06-20T14:00:00Z'
  },
  {
    id: 'strotime-3',
    facility_id: 2,
    zone_id: 'zone-2',
    slot_date: '2025-06-25',
    start_time: '10:00',
    end_time: '11:00',
    duration_minutes: 60,
    price_per_slot: 150,
    max_participants: 5,
    current_participants: 5,
    is_available: false,
    published_at: '2025-06-21T09:00:00Z',
    published_by: 'admin-user-id',
    released_from_rammetid: true,
    original_booking_id: 'booking-125',
    created_at: '2025-06-21T09:00:00Z'
  },
  {
    id: 'strotime-4',
    facility_id: 2,
    zone_id: 'zone-1',
    slot_date: '2025-06-26',
    start_time: '15:00',
    end_time: '16:30',
    duration_minutes: 90,
    price_per_slot: 300,
    max_participants: 8,
    current_participants: 1,
    is_available: true,
    published_at: '2025-06-22T12:00:00Z',
    published_by: 'admin-user-id',
    released_from_rammetid: false,
    created_at: '2025-06-22T12:00:00Z'
  }
];

export function useStrotimer({ facilityId, currentWeekStart }: UseStrotimerProps) {
  const [strøtimer, setStrøtimer] = useState<StrotimeSlot[]>([]);
  const [loadingStrøtimer, setLoadingStrøtimer] = useState(false);

  // Fetch strøtimer for the current week
  useEffect(() => {
    const fetchStrøtimer = async () => {
      if (!facilityId) return;
      
      setLoadingStrøtimer(true);
      try {
        // Use mock data for facility ID 2, otherwise use service
        if (facilityId === '2') {
          // Filter mock data for current week
          const weekEnd = addDays(currentWeekStart, 6);
          const filteredSlots = mockStrotimeSlots.filter(slot => {
            const slotDate = new Date(slot.slot_date);
            return slotDate >= currentWeekStart && slotDate <= weekEnd;
          });
          setStrøtimer(filteredSlots);
        } else {
          const response = await StrotimeService.getAvailableStrøtimer({
            facilityId,
            startDate: currentWeekStart,
            endDate: addDays(currentWeekStart, 6)
          });
          
          if (response.success) {
            setStrøtimer(response.data || []);
          }
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
      if (facilityId === '2') {
        // For mock data, just simulate a booking by updating current_participants
        const updatedSlots = strøtimer.map(slot => {
          if (slot.id === booking.strotime_slot_id) {
            return {
              ...slot,
              current_participants: slot.current_participants + (booking.participants || 1),
              is_available: slot.current_participants + (booking.participants || 1) < slot.max_participants
            };
          }
          return slot;
        });
        setStrøtimer(updatedSlots);
      } else {
        const response = await StrotimeService.getAvailableStrøtimer({
          facilityId,
          startDate: currentWeekStart,
          endDate: addDays(currentWeekStart, 6)
        });
        
        if (response.success) {
          setStrøtimer(response.data || []);
        }
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
