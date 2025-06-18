
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, User, Clock } from 'lucide-react';
import { BookingConflict } from '@/components/booking/types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ConflictTooltipProps {
  conflict: BookingConflict;
  children: React.ReactNode;
}

export function ConflictTooltip({ conflict, children }: ConflictTooltipProps) {
  const getConflictMessage = () => {
    switch (conflict.conflictType) {
      case 'zone-conflict':
        return `Booket av ${conflict.bookedBy}`;
      case 'whole-facility-conflict':
        return `Hele lokalet er booket av ${conflict.bookedBy}`;
      case 'sub-zone-conflict':
        return `${conflict.conflictingZoneName} er booket av ${conflict.bookedBy}`;
      default:
        return 'Ikke tilgjengelig';
    }
  };

  const getConflictIcon = () => {
    switch (conflict.conflictType) {
      case 'whole-facility-conflict':
        return <AlertTriangle className="h-3 w-3 text-orange-500" />;
      default:
        return <User className="h-3 w-3 text-red-500" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-64 font-inter">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              {getConflictIcon()}
              <span>Ikke tilgjengelig</span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>{format(conflict.date, 'EEEE dd.MM.yyyy', { locale: nb })} kl. {conflict.timeSlot}</span>
              </div>
              <div>{getConflictMessage()}</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
