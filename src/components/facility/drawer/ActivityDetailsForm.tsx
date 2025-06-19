
import React from 'react';
import { Trophy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EnumSelect } from '@/components/common/EnumSelect';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface ActivityDetailsFormProps {
  activityType: string;
  onActivityTypeChange: (type: string) => void;
  attendees: number;
  onAttendeesChange: (count: number) => void;
}

export function ActivityDetailsForm({
  activityType,
  onActivityTypeChange,
  attendees,
  onAttendeesChange
}: ActivityDetailsFormProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <EnumSelect
            enumType="EventType"
            value={activityType}
            onValueChange={onActivityTypeChange}
            label={t('forms.labels.activityType')}
            description={t('forms.descriptions.activityType')}
            placeholder={t('forms.placeholders.selectActivityType')}
            required
            showDescription={true}
          />
          {activityType.length === 0 && (
            <p className="text-sm text-red-600">{t('validation.messages.required')}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            {t('forms.labels.attendees')} *
          </Label>
          <Input
            type="number"
            value={attendees}
            onChange={(e) => onAttendeesChange(Number(e.target.value))}
            min="1"
            max="1000"
            className="h-11 border-gray-300 focus:border-slate-700"
            placeholder={t('forms.placeholders.attendees')}
          />
          {attendees <= 0 && (
            <p className="text-sm text-red-600">{t('validation.messages.attendeesMin')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
