
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
    <div className="space-y-3" role="group" aria-labelledby="contact-heading">
      <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
        <p className="text-blue-800 text-xs leading-relaxed">
          <strong>Kontaktinformasjon:</strong> Brukes for bekreftelser og viktige oppdateringer. Alle felt med * er påkrevd.
        </p>
      </div>
      
      {/* Smart grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <User className="h-3.5 w-3.5 text-slate-600" />
                Navn *
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ditt navn" 
                  {...field} 
                  className="h-8 border-gray-300 focus:border-slate-700 text-sm"
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
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Mail className="h-3.5 w-3.5 text-slate-600" />
                E-post *
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="din.epost@eksempel.no" 
                  {...field} 
                  className="h-8 border-gray-300 focus:border-slate-700 text-sm"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Phone className="h-3.5 w-3.5 text-slate-600" />
                Telefon *
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="99999999" 
                  {...field} 
                  className="h-8 border-gray-300 focus:border-slate-700 text-sm"
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
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Building className="h-3.5 w-3.5 text-slate-600" />
                Organisasjon
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Organisasjon (valgfritt)" 
                  {...field} 
                  className="h-8 border-gray-300 focus:border-slate-700 text-sm"
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
