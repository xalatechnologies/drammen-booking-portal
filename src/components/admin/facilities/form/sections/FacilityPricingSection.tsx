
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { DollarSign } from "lucide-react";
import { PricingRulesManager } from "./pricing/PricingRulesManager";

interface FacilityPricingSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityPricingSection: React.FC<FacilityPricingSectionProps> = ({ form }) => {
  const { tSync } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          {tSync("admin.facilities.form.pricing.title", "Pricing Management")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price_per_hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.pricing.basePrice", "Base Price per Hour (NOK)")}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="450.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  {tSync("admin.facilities.form.pricing.basePriceHint", "Default hourly rate for this facility")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time_slot_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.pricing.slotDuration", "Minimum Booking Duration")}</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end">
            <div className="text-sm text-muted-foreground">
              <div className="font-medium">{tSync("admin.facilities.form.pricing.preview", "Price Preview")}</div>
              <div className="text-lg font-bold text-green-600">
                {form.watch('price_per_hour') || 450} NOK/hour
              </div>
              <div className="text-xs">
                {((form.watch('price_per_hour') || 450) * (form.watch('time_slot_duration') || 1))} NOK minimum
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Pricing Rules */}
        <PricingRulesManager 
          basePrice={form.watch('price_per_hour') || 450}
          onRulesChange={(rules) => {
            console.log('Pricing rules updated:', rules);
            // Here you would typically save the rules to the form or send to API
          }}
        />

        {/* Payment & Billing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-3">
            <h4 className="font-medium">{tSync("admin.facilities.form.pricing.paymentTerms", "Payment Terms")}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{tSync("admin.facilities.form.pricing.advancePayment", "Advance Payment:")}</span>
                <span className="font-medium">Required</span>
              </div>
              <div className="flex justify-between">
                <span>{tSync("admin.facilities.form.pricing.cancellationFee", "Cancellation Fee:")}</span>
                <span className="font-medium">50% if &lt; 24h</span>
              </div>
              <div className="flex justify-between">
                <span>{tSync("admin.facilities.form.pricing.lateFee", "Late Booking Fee:")}</span>
                <span className="font-medium">25% if &lt; 2h</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">{tSync("admin.facilities.form.pricing.discounts", "Available Discounts")}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{tSync("admin.facilities.form.pricing.organizationDiscount", "Organization:")}</span>
                <span className="font-medium text-green-600">-15%</span>
              </div>
              <div className="flex justify-between">
                <span>{tSync("admin.facilities.form.pricing.recurringDiscount", "Recurring bookings:")}</span>
                <span className="font-medium text-green-600">-10%</span>
              </div>
              <div className="flex justify-between">
                <span>{tSync("admin.facilities.form.pricing.offPeakDiscount", "Off-peak hours:")}</span>
                <span className="font-medium text-green-600">-20%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
