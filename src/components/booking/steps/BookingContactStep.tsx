
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

interface BookingContactStepProps {
  form: UseFormReturn<BookingFormValues>;
}

export function BookingContactStep({ form }: BookingContactStepProps) {
  return (
    <div className="space-y-6" role="group" aria-labelledby="contact-heading">
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
        <p className="text-navy-800 text-sm leading-relaxed">
          <strong>Kontaktinformasjon:</strong> Denne informasjonen brukes for bekreftelser og viktige oppdateringer om din reservasjon. Alle felt merket med * er obligatoriske.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-slate-600" />
                Fullt navn *
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Skriv inn ditt fulle navn" 
                  {...field} 
                  className="h-11 border-gray-300 focus:border-slate-700 text-base"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-slate-600" />
                E-postadresse *
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="din.epost@eksempel.no" 
                  {...field} 
                  className="h-11 border-gray-300 focus:border-slate-700 text-base"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
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
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5 text-slate-600" />
                Telefonnummer *
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="99 99 99 99" 
                  {...field} 
                  className="h-11 border-gray-300 focus:border-slate-700 text-base"
                  aria-required="true"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-slate-600" />
                Organisasjon/Firma
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Organisasjonsnavn (valgfritt)" 
                  {...field} 
                  className="h-11 border-gray-300 focus:border-slate-700 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
