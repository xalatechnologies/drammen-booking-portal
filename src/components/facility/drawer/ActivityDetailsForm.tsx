
import React from 'react';
import { Trophy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

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
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-slate-600" />
            Type aktivitet *
          </Label>
          <Select value={activityType} onValueChange={onActivityTypeChange}>
            <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
              <SelectValue placeholder="Velg" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              <SelectItem value="velg">Velg</SelectItem>
              <SelectItem value="møter-foredrag">Møter, foredrag eller liknende</SelectItem>
              <SelectItem value="øving">Øving (kor, korps, teater eller liknende)</SelectItem>
              <SelectItem value="konsert-forestilling">Konsert eller forestilling</SelectItem>
              <SelectItem value="annen-aktivitet">Annen aktivitet - beskriv under</SelectItem>
            </SelectContent>
          </Select>
          {activityType.length === 0 && (
            <p className="text-sm text-red-600">Dette feltet er påkrevd</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            Antall personer *
          </Label>
          <Input
            type="number"
            value={attendees}
            onChange={(e) => onAttendeesChange(Number(e.target.value))}
            min="1"
            max="1000"
            className="h-11 border-gray-300 focus:border-slate-700"
            placeholder="Antall deltakere"
          />
          {attendees <= 0 && (
            <p className="text-sm text-red-600">Minimum 1 person</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
