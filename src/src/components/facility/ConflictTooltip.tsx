
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, User, Clock } from 'lucide-react';
import { BookingConflict } from '@/components/booking/types';
import { format, isValid } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ConflictTooltipProps {
  conflict: BookingConflict;
  children: React.ReactNode;
}

export function ConflictTooltip({ conflict, children }: ConflictTooltipProps) {
  const getConflictMessage = () => {
    switch (conflict.conflict_type) {
      case 'zone-conflict':
        return `Booket av bruker`;
      case 'whole-facility-conflict':
        return `Hele lokalet er booket av bruker`;
      case 'sub-zone-conflict':
        return `Sone er booket av bruker`;
      default:
        return 'Ikke tilgjengelig';
    }
  };

  const getConflictIcon = () => {
    switch (conflict.conflict_type) {
      case 'whole-facility-conflict':
        return <AlertTriangle className="h-3 w-3 text-orange-500" />;
      default:
        return <User className="h-3 w-3 text-red-500" />;
    }
  };

  // Safely format the date with validation
  const formatSafeDate = (dateString?: string) => {
    if (!dateString) {
      return 'Ugyldig dato';
    }
    const date = new Date(dateString);
    if (!isValid(date)) {
      console.warn('Invalid date passed to ConflictTooltip:', dateString);
      return 'Ugyldig dato';
    }
    try {
      return format(date, 'EEEE dd.MM.yyyy', { locale: nb });
    } catch (error) {
      console.error('Error formatting date in ConflictTooltip:', error, dateString);
      return 'Ugyldig dato';
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
                <span>{formatSafeDate(conflict.created_at)}</span>
              </div>
              <div>{getConflictMessage()}</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
