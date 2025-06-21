
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Trash2, DollarSign } from "lucide-react";

interface FacilityPricingSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

interface PricingRule {
  id: string;
  actorType: string;
  bookingType: string;
  timeSlot: string;
  dayType: string;
  basePrice: number;
  multiplier: number;
  validFrom: string;
  validTo: string;
}

export const FacilityPricingSection: React.FC<FacilityPricingSectionProps> = ({ form }) => {
  const { tSync } = useTranslation();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);

  const addPricingRule = () => {
    const newRule: PricingRule = {
      id: Date.now().toString(),
      actorType: 'individual',
      bookingType: 'engangs',
      timeSlot: 'all',
      dayType: 'all',
      basePrice: form.watch('price_per_hour') || 450,
      multiplier: 1,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: ''
    };
    setPricingRules([...pricingRules, newRule]);
  };

  const removePricingRule = (id: string) => {
    setPricingRules(pricingRules.filter(rule => rule.id !== id));
  };

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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold">{tSync("admin.facilities.form.pricing.advancedRules", "Advanced Pricing Rules")}</h3>
            <Button type="button" onClick={addPricingRule} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              {tSync("admin.facilities.form.pricing.addRule", "Add Rule")}
            </Button>
          </div>

          {pricingRules.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{tSync("admin.facilities.form.pricing.noRules", "No advanced pricing rules configured")}</p>
              <p className="text-xs">{tSync("admin.facilities.form.pricing.noRulesHint", "Add rules for actor-specific, time-based, or seasonal pricing")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pricingRules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Actor:</span>
                      <Badge variant="secondary" className="ml-1">{rule.actorType}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <Badge variant="secondary" className="ml-1">{rule.bookingType}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <span className="ml-1 font-mono">{rule.basePrice} × {rule.multiplier}</span>
                    </div>
                    <div>
                      <span className="font-medium">Period:</span>
                      <span className="ml-1 text-xs">{rule.validFrom} - {rule.validTo || 'ongoing'}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removePricingRule(rule.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

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
