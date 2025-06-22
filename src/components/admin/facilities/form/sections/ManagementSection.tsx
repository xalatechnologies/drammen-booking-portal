import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FacilityStatus } from '@/features/facility/types/facility';

/**
 * Management Section Component
 * 
 * Handles facility management settings like status, auto-approval, and contact information.
 * This component follows Single Responsibility Principle by focusing only on management settings.
 */
export const ManagementSection: React.FC = () => {
  const { t } = useTranslation();
  const form = useFormContext();

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('facility.form.status')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || FacilityStatus.ACTIVE}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('facility.form.selectStatus')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={FacilityStatus.ACTIVE}>{t('facility.status.active')}</SelectItem>
                  <SelectItem value={FacilityStatus.INACTIVE}>{t('facility.status.inactive')}</SelectItem>
                  <SelectItem value={FacilityStatus.MAINTENANCE}>{t('facility.status.maintenance')}</SelectItem>
                  <SelectItem value={FacilityStatus.CLOSED}>{t('facility.status.closed')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasAutoApproval"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>{t('facility.form.autoApproval')}</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('facility.form.contactInfo')}</h3>
          
          <FormField
            control={form.control}
            name="contact.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.contactEmail')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('facility.form.contactPhone')}</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
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
