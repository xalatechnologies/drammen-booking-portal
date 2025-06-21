
import React from 'react';
import { FileText, User, Calendar, Users, Info, Activity } from 'lucide-react';
import { CartItem } from '@/types/cart';

interface ReservationDetailsProps {
  reservation: CartItem;
}

const getActorTypeLabel = (actorType: string) => {
  switch (actorType) {
    case 'private': return 'Privatperson';
    case 'business': return 'Bedrift';
    case 'organization': return 'Organisasjon';
    case 'lag-foreninger': return 'Lag/Foreninger';
    case 'paraply': return 'Paraplyorganisasjon';
    default: return 'Ukjent';
  }
};

const getEventTypeLabel = (eventType?: string) => {
  switch (eventType) {
    case 'sport': return 'Sport';
    case 'cultural': return 'Kultur';
    case 'meeting': return 'Møte';
    case 'training': return 'Trening';
    case 'competition': return 'Konkurranse';
    case 'other': return 'Annet';
    default: return 'Ikke spesifisert';
  }
};

export function ReservationDetails({ reservation }: ReservationDetailsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-600" />
        Booking detaljer
      </h4>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700 block">Formål</span>
              <p className="text-gray-600 mt-1">{reservation.purpose}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700 block">Aktør type</span>
              <span className="text-gray-600">{getActorTypeLabel(reservation.organizationType)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700 block">Activity type</span>
              <span className="text-gray-600">{getEventTypeLabel(reservation.eventType)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700 block">Forventet deltakere</span>
              <span className="text-gray-600">{reservation.expectedAttendees}</span>
            </div>
          </div>
        </div>
      </div>

      {reservation.specialRequirements && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700 block">Tillegsopplysninger</span>
              <p className="text-gray-600 mt-1">{reservation.specialRequirements}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
