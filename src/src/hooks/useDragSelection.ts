
import { useState, useCallback, useRef } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface DragState {
  isDragging: boolean;
  startSlot: { zoneId: string; date: Date; timeSlot: string } | null;
  currentSlot: { zoneId: string; date: Date; timeSlot: string } | null;
  previewSlots: SelectedTimeSlot[];
}

export function useDragSelection() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startSlot: null,
    currentSlot: null,
    previewSlots: []
  });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const startDrag = useCallback((zoneId: string, date: Date, timeSlot: string, event: React.MouseEvent) => {
    event.preventDefault();
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    
    setDragState({
      isDragging: true,
      startSlot: { zoneId, date, timeSlot },
      currentSlot: { zoneId, date, timeSlot },
      previewSlots: []
    });
  }, []);

  const updateDrag = useCallback((zoneId: string, date: Date, timeSlot: string, timeSlots: string[], weekDays: Date[], getAvailabilityStatus: Function) => {
    if (!dragState.isDragging || !dragState.startSlot) return;

    const startSlot = dragState.startSlot;
    const endSlot = { zoneId, date, timeSlot };

    // Calculate the selection rectangle
    const previewSlots: SelectedTimeSlot[] = [];
    
    // Find indices for start and end positions
    const startDayIndex = weekDays.findIndex(day => day.toDateString() === startSlot.date.toDateString());
    const endDayIndex = weekDays.findIndex(day => day.toDateString() === endSlot.date.toDateString());
    const startTimeIndex = timeSlots.findIndex(slot => slot === startSlot.timeSlot);
    const endTimeIndex = timeSlots.findIndex(slot => slot === endSlot.timeSlot);

    if (startDayIndex !== -1 && endDayIndex !== -1 && startTimeIndex !== -1 && endTimeIndex !== -1) {
      const minDayIndex = Math.min(startDayIndex, endDayIndex);
      const maxDayIndex = Math.max(startDayIndex, endDayIndex);
      const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
      const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);

      // Create selection rectangle
      for (let dayIndex = minDayIndex; dayIndex <= maxDayIndex; dayIndex++) {
        for (let timeIndex = minTimeIndex; timeIndex <= maxTimeIndex; timeIndex++) {
          const currentDay = weekDays[dayIndex];
          const currentTimeSlot = timeSlots[timeIndex];
          const { status } = getAvailabilityStatus(zoneId, currentDay, currentTimeSlot);
          
          // Only include available slots in the preview
          if (status === 'available') {
            previewSlots.push({
              zoneId,
              date: currentDay,
              timeSlot: currentTimeSlot,
              duration: 1
            });
          }
        }
      }
    }

    setDragState(prev => ({
      ...prev,
      currentSlot: endSlot,
      previewSlots
    }));
  }, [dragState.isDragging, dragState.startSlot]);

  const endDrag = useCallback(() => {
    const result = dragState.previewSlots;
    setDragState({
      isDragging: false,
      startSlot: null,
      currentSlot: null,
      previewSlots: []
    });
    dragStartRef.current = null;
    return result;
  }, [dragState.previewSlots]);

  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      startSlot: null,
      currentSlot: null,
      previewSlots: []
    });
    dragStartRef.current = null;
  }, []);

  const isSlotInPreview = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    return dragState.previewSlots.some(slot =>
      slot.zoneId === zoneId &&
      slot.date.toDateString() === date.toDateString() &&
      slot.timeSlot === timeSlot
    );
  }, [dragState.previewSlots]);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    isSlotInPreview
  };
}
