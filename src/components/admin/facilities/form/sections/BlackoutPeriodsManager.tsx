// temporary comment
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';

const blackoutPeriodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
});

const blackoutFormSchema = z.object({
  periods: z.array(blackoutPeriodSchema),
});

export type BlackoutFormValues = z.infer<typeof blackoutFormSchema>;

export const BlackoutPeriodsManager = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const methods = useForm<BlackoutFormValues>({
    resolver: zodResolver(blackoutFormSchema),
    defaultValues: {
      periods: [
        { name: 'Summer Holiday', startDate: new Date(2024, 6, 1), endDate: new Date(2024, 6, 31) },
        { name: 'Christmas', startDate: new Date(2024, 11, 23), endDate: new Date(2025, 0, 2) },
      ],
    },
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'periods',
  });

  const onSave = (data: BlackoutFormValues) => {
    console.log('Saving blackout periods:', data);
    // Here you would call your API to save the data
    setIsEditing(false);
  };
  
  const onCancel = () => {
    reset();
    setIsEditing(false);
  }

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('forms:blackout.title')}</CardTitle>
            <CardDescription>{t('forms:blackout.description')}</CardDescription>
          </div>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>{t('common:actions.edit')}</Button>}
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_180px_180px_auto] items-start gap-4 p-4 border rounded-lg">
                  <FormField
                    control={control}
                    name={`periods.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder={t('forms:blackout.namePlaceholder')} className="h-11 text-base" disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`periods.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t('forms:blackout.startDatePlaceholder')}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`periods.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                           <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t('forms:blackout.endDatePlaceholder')}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEditing && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-between items-center">
                <Button type="button" variant="link" onClick={() => append({ name: '', startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 1)) })} className="p-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('forms:blackout.addPeriod')}
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={onCancel}>
                    {t('common:actions.cancel')}
                  </Button>
                  <Button type="button" onClick={handleSubmit(onSave)}>{t('common:actions.save')}</Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </FormProvider>
  );
}; 