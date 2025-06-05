
import React from "react";
import { User, Mail, Phone, Building } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "../types";

interface BookingContactStepProps {
  form: UseFormReturn<BookingFormValues>;
}

export function BookingContactStep({ form }: BookingContactStepProps) {
  return (
    <div className="space-y-6" role="group" aria-labelledby="contact-heading">
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
        <Info className="h-5 w-5 text-slate-700" aria-hidden="true" />
        <h2 id="contact-heading" className="text-lg font-medium text-gray-900">Kontaktinformasjon</h2>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <p className="text-slate-700 text-sm">
          Kontaktinformasjonen brukes for å sende bekreftelser og viktige oppdateringer om reservasjonen din. 
          Alle felt merket med * er påkrevd.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <User className="h-4 w-4 text-slate-700" aria-hidden="true" />
              Navn *
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ditt navn" 
                {...field} 
                className="h-11 border-gray-300 focus:border-slate-800 focus:ring-slate-800"
                aria-required="true"
                aria-describedby={`${field.name}-description`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Mail className="h-4 w-4 text-slate-700" aria-hidden="true" />
                E-post *
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="din.epost@eksempel.no" 
                  {...field} 
                  className="h-11 border-gray-300 focus:border-slate-800 focus:ring-slate-800"
                  aria-required="true"
                  aria-describedby="email-description"
                />
              </FormControl>
              <FormDescription id="email-description" className="text-xs text-gray-600">
                Du vil motta bekreftelse på denne e-postadressen
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Phone className="h-4 w-4 text-slate-700" aria-hidden="true" />
                Telefon *
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="99999999" 
                  {...field} 
                  className="h-11 border-gray-300 focus:border-slate-800 focus:ring-slate-800"
                  aria-required="true"
                  aria-describedby="phone-description"
                  type="tel"
                />
              </FormControl>
              <FormDescription id="phone-description" className="text-xs text-gray-600">
                For SMS-varsler og kontakt ved behov
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="organization"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Building className="h-4 w-4 text-slate-700" aria-hidden="true" />
              Organisasjon (valgfritt)
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Navn på organisasjon, lag eller forening" 
                {...field} 
                className="h-11 border-gray-300 focus:border-slate-800 focus:ring-slate-800"
                aria-describedby="organization-description"
              />
            </FormControl>
            <FormDescription id="organization-description" className="text-xs text-gray-600">
              Fyll ut hvis du representerer en organisasjon, lag eller forening
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
