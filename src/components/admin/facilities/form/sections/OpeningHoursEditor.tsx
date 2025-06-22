import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOpeningHoursStore } from '@/stores/useOpeningHoursStore';
import { Day, DAYS_OF_WEEK } from '@/types/schedule';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { OpeningHoursRow } from './OpeningHoursRow';

// Mock fetch function - replace with your actual API call
const fetchOpeningHours = async (facilityId: string): Promise<Record<Day, any>> => {
  console.log('Fetching opening hours for', facilityId);
  // In a real app, you would fetch this from your backend
  return Promise.resolve({
    Monday: { isOpen: true, slots: [{ id: '1', from: '09:00', to: '17:00' }] },
    Tuesday: { isOpen: true, slots: [{ id: '2', from: '09:00', to: '17:00' }] },
    Wednesday: { isOpen: true, slots: [{ id: '3', from: '09:00', to: '17:00' }] },
    Thursday: { isOpen: true, slots: [{ id: '4', from: '09:00', to: '17:00' }] },
    Friday: { isOpen: true, slots: [{ id: '5', from: '09:00', to: '17:00' }] },
    Saturday: { isOpen: false, slots: [] },
    Sunday: { isOpen: false, slots: [] },
  });
};

interface OpeningHoursEditorProps {
  facilityId: string;
}

export const OpeningHoursEditor: React.FC<OpeningHoursEditorProps> = ({ facilityId }) => {
  const { t } = useTranslation();
  const schedule = useOpeningHoursStore((state) => state.schedule);
  const { initialize, toggleDay, addSlot, updateSlot, removeSlot, copyToAll } = useOpeningHoursStore((state) => state.actions);

  useEffect(() => {
    // Replace this with your actual data fetching logic
    // fetchOpeningHours(facilityId).then(initialize);
  }, [facilityId, initialize]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.openingHours.title')}</CardTitle>
        <CardDescription>{t('admin.openingHours.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {DAYS_OF_WEEK.map((day) => (
            <OpeningHoursRow
              key={day}
              day={day}
              isOpen={schedule[day].isOpen}
              slots={schedule[day].slots}
              onToggle={(isOpen) => toggleDay(day, isOpen)}
              onAddSlot={() => addSlot(day)}
              onUpdateSlot={(slotId, from, to) => updateSlot(day, slotId, from, to)}
              onRemoveSlot={(slotId) => removeSlot(day, slotId)}
              onCopyToAll={() => copyToAll(day)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 