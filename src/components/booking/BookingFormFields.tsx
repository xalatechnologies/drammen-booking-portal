
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Users } from 'lucide-react';
import { ActorType } from '@/types/pricing';

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
}

interface BookingFormFieldsProps {
  formData: BookingFormData;
  onUpdateFormData: (updates: Partial<BookingFormData>) => void;
}

const activityTypes = [
  'Møte',
  'Konferanse', 
  'Workshop',
  'Trening',
  'Sosial aktivitet',
  'Kurs',
  'Presentasjon',
  'Annet'
];

const actorTypes = [
  { value: 'private-person', label: 'Privatperson' },
  { value: 'lag-foreninger', label: 'Lag og foreninger' },
  { value: 'paraply', label: 'Paraplyorganisasjoner' },
  { value: 'private-firma', label: 'Private firma' },
  { value: 'kommunale-enheter', label: 'Kommunale enheter' }
];

export function BookingFormFields({
  formData,
  onUpdateFormData
}: BookingFormFieldsProps) {
  const handleAttendeesChange = (change: number) => {
    const newValue = Math.max(1, formData.attendees + change);
    onUpdateFormData({ attendees: newValue });
  };

  return (
    <div className="space-y-4">
      {/* Purpose */}
      <Textarea
        placeholder="Beskriv formålet med reservasjonen... *"
        value={formData.purpose}
        onChange={(e) => onUpdateFormData({ purpose: e.target.value })}
        className="min-h-[80px] resize-none"
        required
      />

      {/* Number of Attendees - Special Design */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">Antall deltakere</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAttendeesChange(-1)}
              disabled={formData.attendees <= 1}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 min-w-[60px] text-center font-semibold text-lg">
              {formData.attendees}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAttendeesChange(1)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Type */}
      <Select
        value={formData.activityType}
        onValueChange={(value) => onUpdateFormData({ activityType: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Velg type aktivitet *" />
        </SelectTrigger>
        <SelectContent>
          {activityTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Additional Information */}
      <Textarea
        placeholder="Tilleggsinformasjon om reservasjonen (valgfritt)..."
        value={formData.additionalInfo}
        onChange={(e) => onUpdateFormData({ additionalInfo: e.target.value })}
        className="min-h-[60px] resize-none"
      />

      {/* Actor Type */}
      <Select
        value={formData.actorType}
        onValueChange={(value: ActorType) => onUpdateFormData({ actorType: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Velg aktør type *" />
        </SelectTrigger>
        <SelectContent>
          {actorTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
