
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { ActorType } from '@/types/pricing';

interface BookingStepBasicInfoProps {
  formData: {
    purpose: string;
    attendees: number;
    activityType: string;
    additionalInfo: string;
    actorType: ActorType;
    termsAccepted: boolean;
  };
  updateFormData: (updates: any) => void;
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

export function BookingStepBasicInfo({ formData, updateFormData }: BookingStepBasicInfoProps) {
  const handleAttendeesChange = (change: number) => {
    const newValue = Math.max(1, formData.attendees + change);
    updateFormData({ attendees: newValue });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Grunnleggende informasjon
      </h3>

      {/* Purpose */}
      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-base font-medium">
          Formål <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="purpose"
          placeholder="Beskriv formålet med reservasjonen..."
          value={formData.purpose}
          onChange={(e) => updateFormData({ purpose: e.target.value })}
          className="min-h-[80px] text-base"
          required
        />
      </div>

      {/* Number of Attendees */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
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
            onChange={(e) => updateFormData({ attendees: parseInt(e.target.value) || 1 })}
            className="w-20 text-center text-base"
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
        <Label className="text-base font-medium">
          Type aktivitet <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.activityType}
          onValueChange={(value) => updateFormData({ activityType: value })}
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder="Velg type aktivitet" />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-base">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
