
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
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-medium">Kontaktinformasjon</h3>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
        <p className="text-blue-700 text-sm">
          Kontaktinformasjonen brukes for å sende bekreftelser og viktige oppdateringer om reservasjonen din.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <User className="h-4 w-4 text-blue-600" />
              Navn
            </FormLabel>
            <FormControl>
              <Input placeholder="Ditt navn" {...field} className="h-10" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 mb-2">
                <Mail className="h-4 w-4 text-blue-600" />
                E-post
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="din.epost@eksempel.no" 
                  {...field} 
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 mb-2">
                <Phone className="h-4 w-4 text-blue-600" />
                Telefon
              </FormLabel>
              <FormControl>
                <Input placeholder="99999999" {...field} className="h-10" />
              </FormControl>
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
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <Building className="h-4 w-4 text-blue-600" />
              Organisasjon (valgfritt)
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Navn på organisasjon, lag eller forening" 
                {...field} 
                className="h-10"
              />
            </FormControl>
            <FormDescription>
              Fyll ut hvis du representerer en organisasjon.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
