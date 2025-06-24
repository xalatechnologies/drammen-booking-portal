
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActorType } from '@/types/pricing';

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
}

interface BookingFormFieldsProps {
  formData: BookingFormData;
  onUpdateFormData: (updates: Partial<BookingFormData>) => void;
}

// Separate data for purpose (formål) and activity type (aktivitet)
const purposeOptions = [
  { value: 'sport', label: 'Sport og trening' },
  { value: 'meeting', label: 'Møte' },
  { value: 'course', label: 'Kurs/opplæring' },
  { value: 'event', label: 'Arrangement/fest' },
  { value: 'conference', label: 'Konferanse' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'presentation', label: 'Presentasjon' },
  { value: 'other', label: 'Annet' }
];

const activityTypeOptions = [
  { value: 'fotball', label: 'Fotball' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'handball', label: 'Håndball' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'dans', label: 'Dans' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'aerobic', label: 'Aerobic' },
  { value: 'styrketrening', label: 'Styrketrening' },
  { value: 'kampsport', label: 'Kampsport' },
  { value: 'gymnastikk', label: 'Gymnastikk' },
  { value: 'annet-sport', label: 'Annen sport' }
];

export function BookingFormFields({ formData, onUpdateFormData }: BookingFormFieldsProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        {/* Purpose Selection */}
        <Select 
          value={formData.purpose} 
          onValueChange={(value) => onUpdateFormData({ purpose: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Velg formål med bookingen" />
          </SelectTrigger>
          <SelectContent>
            {purposeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Activity Type Selection */}
        <Select 
          value={formData.activityType} 
          onValueChange={(value) => onUpdateFormData({ activityType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Velg type aktivitet" />
          </SelectTrigger>
          <SelectContent>
            {activityTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Number of Attendees */}
        <Input
          type="number"
          min="1"
          value={formData.attendees}
          onChange={(e) => onUpdateFormData({ attendees: parseInt(e.target.value) || 1 })}
          placeholder="Antall deltakere"
          className="w-full"
        />

        {/* Additional Information */}
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => onUpdateFormData({ additionalInfo: e.target.value })}
          placeholder="Tilleggsinformasjon (spesielle behov, utstyr som trengs, etc.)"
          rows={2}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
