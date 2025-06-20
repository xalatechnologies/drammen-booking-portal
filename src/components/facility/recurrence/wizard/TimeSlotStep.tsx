
import React, { useState, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TimeSlotStepProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (timeSlot: string) => void;
}

const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
  '20:00-21:00', '21:00-22:00'
];

interface DragState {
  isDragging: boolean;
  startIndex: number | null;
  currentIndex: number | null;
  previewSlots: string[];
}

export function TimeSlotStep({ selectedTimeSlots, onTimeSlotToggle }: TimeSlotStepProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startIndex: null,
    currentIndex: null,
    previewSlots: []
  });

  const startDrag = useCallback((index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setDragState({
      isDragging: true,
      startIndex: index,
      currentIndex: index,
      previewSlots: [timeSlots[index]]
    });
  }, []);

  const updateDrag = useCallback((index: number) => {
    if (!dragState.isDragging || dragState.startIndex === null) return;

    const startIndex = dragState.startIndex;
    const endIndex = index;
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    
    const previewSlots = timeSlots.slice(minIndex, maxIndex + 1);
    
    setDragState(prev => ({
      ...prev,
      currentIndex: index,
      previewSlots
    }));
  }, [dragState.isDragging, dragState.startIndex]);

  const endDrag = useCallback(() => {
    if (dragState.previewSlots.length > 0) {
      // Toggle all preview slots
      dragState.previewSlots.forEach(slot => {
        if (!selectedTimeSlots.includes(slot)) {
          onTimeSlotToggle(slot);
        }
      });
    }
    
    setDragState({
      isDragging: false,
      startIndex: null,
      currentIndex: null,
      previewSlots: []
    });
  }, [dragState.previewSlots, selectedTimeSlots, onTimeSlotToggle]);

  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      startIndex: null,
      currentIndex: null,
      previewSlots: []
    });
  }, []);

  const handleClick = (slot: string, index: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (!dragState.isDragging) {
      onTimeSlotToggle(slot);
    }
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    startDrag(index, event);
  };

  const handleMouseEnter = (index: number) => {
    if (dragState.isDragging) {
      updateDrag(index);
    }
  };

  const handleMouseUp = () => {
    if (dragState.isDragging) {
      endDrag();
    }
  };

  const isSlotInPreview = (slot: string) => {
    return dragState.previewSlots.includes(slot);
  };

  const getSlotStyle = (slot: string, isSelected: boolean, isInPreview: boolean) => {
    if (isSelected) {
      return 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700';
    }
    
    if (isInPreview) {
      return 'bg-blue-200 hover:bg-blue-300 border-2 border-blue-400 text-blue-800';
    }
    
    return 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 cursor-pointer';
  };

  const uniqueSelectedSlots = [...new Set(selectedTimeSlots)];

  return (
    <div 
      className="space-y-8"
      onMouseLeave={cancelDrag}
      onMouseUp={handleMouseUp}
      style={{ userSelect: 'none' }}
    >
      <div className="text-center">
        <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hvilke tider?</h2>
        <p className="text-gray-600 text-lg mb-4">
          Velg hvilke tidspunkt du vil reservere. Klikk og dra for å velge flere timer.
        </p>
        {uniqueSelectedSlots.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {uniqueSelectedSlots.length} tidspunkt valgt
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot, index) => {
              const isSelected = uniqueSelectedSlots.includes(slot);
              const isInPreview = isSlotInPreview(slot);
              const slotStyle = getSlotStyle(slot, isSelected, isInPreview);
              
              return (
                <button
                  key={slot}
                  className={`
                    h-12 rounded-lg transition-all duration-200 text-sm font-medium select-none
                    transform hover:scale-105 ${slotStyle}
                  `}
                  onMouseDown={(e) => handleMouseDown(index, e)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={(e) => handleClick(slot, index, e)}
                  style={{ userSelect: 'none' }}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm font-medium">
                      {slot}
                    </span>
                    {isSelected && (
                      <span className="text-sm ml-1">✓</span>
                    )}
                    {isInPreview && !isSelected && (
                      <span className="text-sm ml-1">◯</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clear all button */}
          {uniqueSelectedSlots.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => uniqueSelectedSlots.forEach(slot => onTimeSlotToggle(slot))}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Fjern alle valgte tidspunkt
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Tips:</strong> Klikk på en time for å velge/fravelge den, eller klikk og dra for å velge flere timer på en gang.
        </p>
        {dragState.isDragging && (
          <p className="text-sm text-blue-600 mt-2">
            <strong>Velger:</strong> {dragState.previewSlots.length} tidspunkt
          </p>
        )}
      </div>
    </div>
  );
}
