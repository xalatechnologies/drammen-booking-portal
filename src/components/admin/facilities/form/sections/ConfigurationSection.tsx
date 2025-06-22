import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MultiSelect } from '@/components/ui/multi-select';

/**
 * Configuration Section Component
 * 
 * Handles facility configuration settings like capacity, pricing, and features.
 * This component follows Single Responsibility Principle by focusing only on configuration settings.
 */
export const ConfigurationSection: React.FC = () => {
  const { t } = useTranslation();
  const form = useFormContext();

  // Predefined options for multi-select fields
  const accessibilityOptions = [
    { label: t('facility.features.wheelchair'), value: 'wheelchair' },
    { label: t('facility.features.elevator'), value: 'elevator' },
    { label: t('facility.features.audioGuide'), value: 'audioGuide' },
    { label: t('facility.features.brailleSignage'), value: 'brailleSignage' }
  ];
  
  const bookingTypeOptions = [
    { label: t('facility.bookingTypes.hourly'), value: 'hourly' },
    { label: t('facility.bookingTypes.daily'), value: 'daily' },
    { label: t('facility.bookingTypes.weekly'), value: 'weekly' },
    { label: t('facility.bookingTypes.monthly'), value: 'monthly' }
  ];
  
  const amenityOptions = [
    { label: t('facility.amenities.wifi'), value: 'wifi' },
    { label: t('facility.amenities.parking'), value: 'parking' },
    { label: t('facility.amenities.catering'), value: 'catering' },
    { label: t('facility.amenities.audioVisual'), value: 'audioVisual' },
    { label: t('facility.amenities.kitchen'), value: 'kitchen' }
  ];

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('facility.form.basicConfig')}</h3>
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.capacity')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.pricePerHour')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                    step="0.01" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeSlotDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.timeSlotDuration')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                    min="0.5"
                    step="0.5" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('facility.form.features')}</h3>
          
          <FormField
            control={form.control}
            name="accessibilityFeatures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.accessibilityFeatures')}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={accessibilityOptions}
                    defaultValue={field.value || []}
                    onValueChange={(values) => field.onChange(values)}
                    placeholder={t('facility.form.selectFeatures')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="allowedBookingTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.allowedBookingTypes')}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={bookingTypeOptions}
                    defaultValue={field.value || []}
                    onValueChange={(values) => field.onChange(values)}
                    placeholder={t('facility.form.selectBookingTypes')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.amenities')}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={amenityOptions}
                    defaultValue={field.value || []}
                    onValueChange={(values) => field.onChange(values)}
                    placeholder={t('facility.form.selectAmenities')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
