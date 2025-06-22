import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useFacilityZoneStore } from '@/stores/useFacilityZoneStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';

interface Zone {
  id: string; 
  name: string;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity: number;
  description: string;
  isMainZone: boolean;
  bookableIndependently: boolean;
  areaSqm: number;
  floor: string;
  equipment: string[];
  status: 'active' | 'maintenance' | 'inactive';
  priceMultiplier: number;
  minBookingDuration: number;
  maxBookingDuration: number;
}

const zoneSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  type: z.enum(['court', 'room', 'area', 'section', 'field']),
  capacity: z.coerce.number().int().positive({ message: 'Capacity must be a positive number.' }),
  description: z.string().optional().default(''),
  isMainZone: z.boolean().default(false),
  bookableIndependently: z.boolean().default(true),
  areaSqm: z.coerce.number().positive({ message: 'Area must be a positive number.' }),
  floor: z.string().optional().default(''),
  equipment: z.array(z.string()).default([]),
  status: z.enum(['active', 'maintenance', 'inactive']),
  priceMultiplier: z.coerce.number().min(0).default(1),
  minBookingDuration: z.coerce.number().int().positive().default(60),
  maxBookingDuration: z.coerce.number().int().positive().default(120),
});

type ZoneFormData = z.infer<typeof zoneSchema>;

interface ZoneFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: Zone; // Existing zone for editing
}

const equipmentOptions = [
    { value: 'projector', label: 'Projector' },
    { value: 'whiteboard', label: 'Whiteboard' },
    { value: 'sound_system', label: 'Sound System' },
    { value: 'microphone', label: 'Microphone' },
];

export const ZoneFormDialog: React.FC<ZoneFormDialogProps> = ({ isOpen, onClose, zone }) => {
  const { t } = useTranslation();
  const { addZone, updateZone } = useFacilityZoneStore((state) => state.actions);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: zone ? {
      ...zone,
      description: zone.description || '',
      floor: zone.floor || '',
    } : {
      name: '',
      type: 'room',
      capacity: 10,
      description: '',
      isMainZone: false,
      bookableIndependently: true,
      areaSqm: 25,
      floor: '',
      equipment: [],
      status: 'active',
      priceMultiplier: 1,
      minBookingDuration: 60,
      maxBookingDuration: 120,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(zone ? {
        ...zone,
        description: zone.description || '',
        floor: zone.floor || '',
      } : {
        name: '',
        type: 'room',
        capacity: 10,
        description: '',
        isMainZone: false,
        bookableIndependently: true,
        areaSqm: 25,
        floor: '',
        equipment: [],
        status: 'active',
        priceMultiplier: 1,
        minBookingDuration: 60,
        maxBookingDuration: 120,
      });
    }
  }, [isOpen, zone, reset]);

  const onSubmit = (data: ZoneFormData) => {
    if (zone) {
      updateZone(zone.id, data);
    } else {
      addZone(data as Omit<Zone, 'id'>);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{zone ? t('admin:zones.editTitle') : t('admin:zones.addTitle')}</DialogTitle>
          <DialogDescription>
            {t('admin:zones.dialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('forms:fields.name.label')}</Label>
                    <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} />} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">{t('forms:fields.type.label')}</Label>
                    <Controller name="type" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="court">Court</SelectItem>
                                <SelectItem value="room">Room</SelectItem>
                                <SelectItem value="area">Area</SelectItem>
                                <SelectItem value="section">Section</SelectItem>
                                <SelectItem value="field">Field</SelectItem>
                            </SelectContent>
                        </Select>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="capacity">{t('forms:fields.capacity.label')}</Label>
                    <Controller name="capacity" control={control} render={({ field }) => <Input id="capacity" type="number" {...field} />} />
                    {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="areaSqm">{t('forms:fields.areaSqm.label', undefined, 'Area (sqm)')}</Label>
                    <Controller name="areaSqm" control={control} render={({ field }) => <Input id="areaSqm" type="number" {...field} />} />
                    {errors.areaSqm && <p className="text-sm text-red-500">{errors.areaSqm.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="floor">{t('forms:fields.floor.label', undefined, 'Floor')}</Label>
                    <Controller name="floor" control={control} render={({ field }) => <Input id="floor" {...field} />} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">{t('forms:fields.status.label')}</Label>
                     <Controller name="status" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    )} />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">{t('forms:fields.description.label')}</Label>
                <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} />} />
            </div>

            <div className="space-y-2">
                 <Label htmlFor="equipment">{t('forms:fields.equipment.label', undefined, 'Equipment')}</Label>
                 <Controller name="equipment" control={control} render={({ field }) => (
                    <MultiSelect
                        options={equipmentOptions}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        className="w-full"
                    />
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="priceMultiplier">{t('forms:fields.priceMultiplier.label', undefined, 'Price Multiplier')}</Label>
                    <Controller name="priceMultiplier" control={control} render={({ field }) => <Input id="priceMultiplier" type="number" step="0.1" {...field} />} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minBookingDuration">{t('forms:fields.minBookingDuration.label', undefined, 'Min Booking (min)')}</Label>
                    <Controller name="minBookingDuration" control={control} render={({ field }) => <Input id="minBookingDuration" type="number" step="15" {...field} />} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="maxBookingDuration">{t('forms:fields.maxBookingDuration.label', undefined, 'Max Booking (min)')}</Label>
                    <Controller name="maxBookingDuration" control={control} render={({ field }) => <Input id="maxBookingDuration" type="number" step="15" {...field} />} />
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Controller name="isMainZone" control={control} render={({ field }) => <Switch id="isMainZone" checked={field.value} onCheckedChange={field.onChange} />} />
                    <Label htmlFor="isMainZone">{t('forms:fields.isMainZone.label', undefined, 'Is Main Zone')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Controller name="bookableIndependently" control={control} render={({ field }) => <Switch id="bookableIndependently" checked={field.value} onCheckedChange={field.onChange} />} />
                    <Label htmlFor="bookableIndependently">{t('forms:fields.bookableIndependently.label', undefined, 'Bookable Independently')}</Label>
                </div>
            </div>
            
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    {t('common:cancel')}
                </Button>
                <Button type="submit">{zone ? t('common:saveChanges') : t('common:create')}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 