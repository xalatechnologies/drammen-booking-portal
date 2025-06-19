
import React from 'react';
import { Trophy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface ActivityDetailsFormProps {
  activityType: string;
  onActivityTypeChange: (type: string) => void;
  attendees: number;
  onAttendeesChange: (count: number) => void;
}

// Common activity types for testing
const activityTypes = [
  { value: 'sports', label: 'Sport og trening' },
  { value: 'meeting', label: 'Møte og konferanse' },
  { value: 'celebration', label: 'Fest og feiring' },
  { value: 'competition', label: 'Konkurranse og turnering' },
  { value: 'course', label: 'Kurs og undervisning' },
  { value: 'rehearsal', label: 'Øving og repetisjon' },
  { value: 'performance', label: 'Opptreden og forestilling' },
  { value: 'other', label: 'Annet' }
];

export function ActivityDetailsForm({
  activityType,
  onActivityTypeChange,
  attendees,
  onAttendeesChange
}: ActivityDetailsFormProps) {
  const { t } = useTranslation();

  console.log('ActivityDetailsForm - Current values:', { activityType, attendees });

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-slate-600" />
            {t('forms.labels.activityType', {}, 'Type aktivitet')} *
          </Label>
          <Select value={activityType} onValueChange={onActivityTypeChange}>
            <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
              <SelectValue placeholder={t('forms.placeholders.selectActivityType', {}, 'Velg type aktivitet')} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-gray-50">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activityType.length === 0 && (
            <p className="text-sm text-red-600">{t('validation.messages.required', {}, 'Dette feltet er påkrevd')}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            {t('forms.labels.attendees', {}, 'Antall personer')} *
          </Label>
          <Input
            type="number"
            value={attendees}
            onChange={(e) => onAttendeesChange(Number(e.target.value))}
            min="1"
            max="1000"
            className="h-11 border-gray-300 focus:border-slate-700"
            placeholder={t('forms.placeholders.attendees', {}, 'Skriv antall personer')}
          />
          {attendees <= 0 && (
            <p className="text-sm text-red-600">{t('validation.messages.attendeesMin', {}, 'Minst 1 person påkrevd')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
