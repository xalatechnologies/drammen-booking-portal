
import React from "react";
import { User, Mail, Phone, Building } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "../types";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface BookingContactStepProps {
  form: UseFormReturn<BookingFormValues>;
}

export function BookingContactStep({ form }: BookingContactStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8" role="group" aria-labelledby="contact-heading">
      {/* Header with improved typography */}
      <div>
        <h2 id="contact-heading" className="text-2xl font-bold text-gray-900 mb-3">
          {t('forms.labels.contactDetails')}
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="region" aria-labelledby="contact-info">
          <p id="contact-info" className="text-blue-800 text-base leading-relaxed font-medium">
            <strong className="font-semibold">{t('accessibility.labels.contactInfo')}:</strong> {t('accessibility.descriptions.importantInfo')}
          </p>
        </div>
      </div>
      
      {/* Form fields with improved spacing and typography */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  {t('forms.labels.fullName')} *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('forms.placeholders.enterFullName')} 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-required="true"
                    aria-describedby="contactName-error"
                  />
                </FormControl>
                <FormMessage id="contactName-error" className="text-base font-medium" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  {t('forms.labels.email')} *
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder={t('forms.placeholders.emailExample')} 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-required="true"
                    aria-describedby="contactEmail-error contactEmail-help"
                  />
                </FormControl>
                <p id="contactEmail-help" className="text-sm text-gray-600 font-medium mt-1">
                  {t('forms.descriptions.emailConfirmation')}
                </p>
                <FormMessage id="contactEmail-error" className="text-base font-medium" />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  {t('forms.labels.phone')} *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('forms.placeholders.phoneExample')} 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-required="true"
                    type="tel"
                    aria-describedby="contactPhone-error contactPhone-help"
                  />
                </FormControl>
                <p id="contactPhone-help" className="text-sm text-gray-600 font-medium mt-1">
                  {t('forms.descriptions.phoneNotifications')}
                </p>
                <FormMessage id="contactPhone-error" className="text-base font-medium" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  {t('forms.labels.organization')}
                  <span className="text-sm font-normal text-gray-500">({t('forms.optional')})</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('forms.placeholders.organizationOptional')} 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-describedby="organization-help"
                  />
                </FormControl>
                <p id="organization-help" className="text-sm text-gray-600 font-medium mt-1">
                  {t('forms.descriptions.organizationOptional')}
                </p>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
