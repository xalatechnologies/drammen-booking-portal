
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
    <div className="space-y-8" role="group" aria-labelledby="contact-heading">
      {/* Header with improved typography */}
      <div>
        <h2 id="contact-heading" className="text-2xl font-bold text-gray-900 mb-3">
          Kontaktinformasjon
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="region" aria-labelledby="contact-info">
          <p id="contact-info" className="text-blue-800 text-base leading-relaxed font-medium">
            <strong className="font-semibold">Viktig informasjon:</strong> Denne informasjonen brukes for bekreftelser og viktige oppdateringer om din reservasjon. Alle felt merket med stjerne (*) er obligatoriske og må fylles ut.
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
                  Fullt navn *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Skriv inn ditt fulle navn" 
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
                  E-postadresse *
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="din.epost@eksempel.no" 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-required="true"
                    aria-describedby="contactEmail-error contactEmail-help"
                  />
                </FormControl>
                <p id="contactEmail-help" className="text-sm text-gray-600 font-medium mt-1">
                  Vi sender bekreftelse og viktige oppdateringer til denne adressen
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
                  Telefonnummer *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="99 99 99 99" 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-required="true"
                    type="tel"
                    aria-describedby="contactPhone-error contactPhone-help"
                  />
                </FormControl>
                <p id="contactPhone-help" className="text-sm text-gray-600 font-medium mt-1">
                  Brukes for viktige varsler om din reservasjon
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
                  Organisasjon/Firma
                  <span className="text-sm font-normal text-gray-500">(valgfritt)</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Organisasjonsnavn (valgfritt)" 
                    {...field} 
                    className="h-12 border-2 border-gray-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 text-base font-medium rounded-md transition-colors"
                    aria-describedby="organization-help"
                  />
                </FormControl>
                <p id="organization-help" className="text-sm text-gray-600 font-medium mt-1">
                  Legg til hvis du representerer en organisasjon eller firma
                </p>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
