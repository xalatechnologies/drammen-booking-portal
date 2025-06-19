
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Users, AlertTriangle } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingFormValues } from '../types';
import { EnumSelect } from '@/components/common/EnumSelect';
import { useModelTranslation } from '@/hooks/useModelTranslation';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface CustomerTypeSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export function CustomerTypeSection({ form }: CustomerTypeSectionProps) {
  const { getFieldLabel, getFieldDescription, getFieldPlaceholder } = useModelTranslation();
  const { t } = useTranslation();
  const watchedValue = form.watch('customerType');

  // Check if booking requires approval
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(watchedValue);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="customerType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              {getFieldLabel('booking', 'customerType')}
            </FormLabel>
            <FormControl>
              <EnumSelect
                enumType="ActorType"
                value={field.value}
                onValueChange={field.onChange}
                label=""
                description={getFieldDescription('booking', 'customerType')}
                placeholder={getFieldPlaceholder('booking', 'customerType')}
                required
                showDescription={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {requiresApproval && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-medium mb-1">
              {t('booking.approval.required', {}, 'Krever godkjenning')}
            </div>
            <div className="text-sm">
              {t('booking.approval.description', {}, 'Denne bookingen krever godkjenning fra kommunen på grunn av aktørtype eller spesielle betingelser. Du vil motta en bekreftelse når bookingen er behandlet.')}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
