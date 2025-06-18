
import React from 'react';
import { Users, AlertTriangle, CheckCircle, Clock, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zone } from './types';
import { ExistingBooking } from '@/utils/zoneConflictManager';

interface ZoneCardProps {
  zone: Zone;
  isSelected: boolean;
  isAvailable: boolean;
  conflict?: ExistingBooking | null;
}

export function ZoneCard({ zone, isSelected, isAvailable, conflict }: ZoneCardProps) {
  const getStatusBadge = () => {
    if (!isAvailable) {
      if (conflict) {
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Opptatt
          </Badge>
        );
      }
      return (
        <Badge variant="secondary" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Ikke tilgjengelig
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Tilgjengelig
      </Badge>
    );
  };

  return (
    <Card className={`transition-all cursor-pointer ${
      isSelected 
        ? 'ring-2 ring-slate-700 border-slate-300 bg-slate-50' 
        : isAvailable
          ? 'hover:border-slate-300 hover:shadow-sm'
          : 'opacity-60'
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base">{zone.name}</h3>
              {zone.isMainZone && (
                <Badge variant="outline" className="bg-slate-100 text-slate-800 text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  Komplett
                </Badge>
              )}
            </div>
            
            {/* Compact info row */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{zone.capacity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Min {zone.bookingRules.minBookingDuration}t</span>
              </div>
              <div className="ml-auto">
                {getStatusBadge()}
              </div>
            </div>

            {/* Equipment preview */}
            {zone.equipment.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {zone.equipment.slice(0, 2).map((item, i) => (
                  <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">
                    {item}
                  </Badge>
                ))}
                {zone.equipment.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{zone.equipment.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Conflict warning */}
        {!isAvailable && conflict && (
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {conflict.conflictType === 'whole-facility-conflict' 
                ? `Hele lokalet er reservert av ${conflict.bookedBy}` 
                : `Reservert av ${conflict.bookedBy}`
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
