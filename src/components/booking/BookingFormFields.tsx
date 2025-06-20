
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';
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
    <div className="space-y-5">
      {/* Purpose */}
      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-lg font-medium">
          Formål <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="purpose"
          placeholder="Beskriv formålet med reservasjonen..."
          value={formData.purpose}
          onChange={(e) => onUpdateFormData({ purpose: e.target.value })}
          className="min-h-[80px] text-lg"
          required
        />
      </div>

      {/* Number of Attendees */}
      <div className="space-y-2">
        <Label className="text-lg font-medium">
          Antall deltakere <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAttendeesChange(-1)}
            disabled={formData.attendees <= 1}
            className="h-10 w-10 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={formData.attendees}
            onChange={(e) => onUpdateFormData({ attendees: parseInt(e.target.value) || 1 })}
            className="w-20 text-center text-lg"
            min="1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAttendeesChange(1)}
            className="h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Activity Type */}
      <div className="space-y-2">
        <Label className="text-lg font-medium">
          Type aktivitet <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.activityType}
          onValueChange={(value) => onUpdateFormData({ activityType: value })}
        >
          <SelectTrigger className="text-lg">
            <SelectValue placeholder="Velg type aktivitet" />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-lg">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Information */}
      <div className="space-y-2">
        <Label htmlFor="additionalInfo" className="text-lg font-medium">
          Tilleggsopplysninger
        </Label>
        <Textarea
          id="additionalInfo"
          placeholder="Tilleggsinformasjon om reservasjonen (valgfritt)..."
          value={formData.additionalInfo}
          onChange={(e) => onUpdateFormData({ additionalInfo: e.target.value })}
          className="min-h-[80px] text-lg"
        />
      </div>

      {/* Actor Type */}
      <div className="space-y-2">
        <Label className="text-lg font-medium">
          Aktør type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.actorType}
          onValueChange={(value: ActorType) => onUpdateFormData({ actorType: value })}
        >
          <SelectTrigger className="text-lg">
            <SelectValue placeholder="Velg aktør type" />
          </SelectTrigger>
          <SelectContent>
            {actorTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-lg">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
