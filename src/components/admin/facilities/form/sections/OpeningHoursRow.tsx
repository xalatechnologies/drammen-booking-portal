import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TimeSlot } from '@/stores/useOpeningHoursStore';
import { Day } from '@/types/schedule';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { PlusCircle, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HourSelect } from './HourSelect';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeSlotInputProps {
  slot: TimeSlot;
  onUpdate: (id: string, from: string, to: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const TimeSlotInput: React.FC<TimeSlotInputProps> = ({ slot, onUpdate, onRemove, disabled }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-muted rounded-md">
      <div className="w-[100px]">
        <HourSelect
          value={slot.from}
          onChange={(from) => onUpdate(slot.id, from, slot.to)}
          disabled={disabled}
        />
      </div>
      <span className="text-muted-foreground text-sm">-</span>
      <div className="w-[100px]">
        <HourSelect
          value={slot.to}
          onChange={(to) => onUpdate(slot.id, slot.from, to)}
          disabled={disabled}
        />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(slot.id)} disabled={disabled}>
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('common:actions.delete')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface OpeningHoursRowProps {
  day: Day;
  isOpen: boolean;
  slots: TimeSlot[];
  onToggle: (isOpen: boolean) => void;
  onAddSlot: () => void;
  onUpdateSlot: (id: string, from: string, to: string) => void;
  onRemoveSlot: (id: string) => void;
  onCopyToAll: () => void;
}

export const OpeningHoursRow: React.FC<OpeningHoursRowProps> = ({
  day,
  isOpen,
  slots,
  onToggle,
  onAddSlot,
  onUpdateSlot,
  onRemoveSlot,
  onCopyToAll,
}) => {
  const { t } = useTranslation();
  const dayKey = `weekdays.${day.toLowerCase()}`;

  return (
    <div className="grid grid-cols-[140px_130px_1fr_auto] items-center gap-x-6 py-4 border-b last:border-b-0">
      <div className="font-semibold text-base">{t(dayKey)}</div>

      <div className="flex items-center space-x-3">
        <Switch checked={isOpen} onCheckedChange={onToggle} id={`switch-${day}`} />
        <label htmlFor={`switch-${day}`} className="font-medium cursor-pointer text-sm">
          {isOpen ? t('admin.openingHours.open') : t('admin.openingHours.closed')}
        </label>
      </div>

      <div className={cn('flex items-center gap-x-2 flex-wrap gap-y-2', !isOpen && 'pointer-events-none opacity-50')}>
        {slots.map((slot) => (
          <TimeSlotInput
            key={slot.id}
            slot={slot}
            onUpdate={onUpdateSlot}
            onRemove={onRemoveSlot}
            disabled={!isOpen}
          />
        ))}
        {isOpen && (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onAddSlot}
                    disabled={!isOpen}
                    className="h-10 w-10 border-dashed rounded-full"
                >
                    <PlusCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">{t('admin.openingHours.addSlot')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('admin.openingHours.addSlot')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {slots.length === 0 && isOpen && (
          <div className="text-sm text-muted-foreground italic pl-2">
            {t('admin.openingHours.closed')}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onCopyToAll} disabled={!isOpen || slots.length === 0}>
                  <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('admin.openingHours.copy')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}; 