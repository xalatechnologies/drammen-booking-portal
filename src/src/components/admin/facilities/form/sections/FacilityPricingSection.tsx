
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { DollarSign, Plus, Trash2, Clock, Calendar, Sun, Moon, Percent } from "lucide-react";

interface FacilityPricingSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

interface FacilityPricingSectionRef {
  saveData: () => Promise<boolean>;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'time_based' | 'day_based' | 'seasonal' | 'actor_based';
  condition: string;
  adjustment: number;
  adjustmentType: 'percentage' | 'fixed';
  isActive: boolean;
}

const RENTAL_TYPES = [
  { value: 'hourly', label: 'Hourly Rental', icon: <Clock className="w-4 h-4" /> },
  { value: 'daily', label: 'Daily Rental', icon: <Calendar className="w-4 h-4" /> },
  { value: 'fixed', label: 'Fixed Season Price', icon: <DollarSign className="w-4 h-4" /> }
];

const PRICING_RULE_TEMPLATES = [
  { type: 'time_based', name: 'Evening Premium', condition: '18:00-22:00', adjustment: 25, adjustmentType: 'percentage' },
  { type: 'time_based', name: 'Night Surcharge', condition: '22:00-06:00', adjustment: 50, adjustmentType: 'percentage' },
  { type: 'day_based', name: 'Weekend Premium', condition: 'Saturday-Sunday', adjustment: 30, adjustmentType: 'percentage' },
  { type: 'day_based', name: 'Holiday Surcharge', condition: 'Public Holidays', adjustment: 40, adjustmentType: 'percentage' },
  { type: 'seasonal', name: 'Summer Peak', condition: 'June-August', adjustment: 20, adjustmentType: 'percentage' },
  { type: 'actor_based', name: 'Organization Discount', condition: 'Organizations', adjustment: -15, adjustmentType: 'percentage' }
];

export const FacilityPricingSection = forwardRef<FacilityPricingSectionRef, FacilityPricingSectionProps>(({ form }, ref) => {
  const { tSync } = useTranslation();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [selectedRentalType, setSelectedRentalType] = useState<string>('hourly');

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      console.log('Saving pricing configuration:', {
        rentalType: selectedRentalType,
        pricingRules: pricingRules
      });
      
      try {
        // Here you would implement the actual API call to save pricing configuration
        console.log('Pricing configuration would be saved:', {
          rentalType: selectedRentalType,
          basePrice: form.watch('price_per_hour'),
          pricingRules: pricingRules
        });
        return true;
      } catch (error) {
        console.error('Failed to save pricing configuration:', error);
        return false;
      }
    }
  }), [selectedRentalType, pricingRules, form]);

  const addPricingRule = (template: any) => {
    const newRule: PricingRule = {
      id: Date.now().toString(),
      name: template.name,
      type: template.type,
      condition: template.condition,
      adjustment: template.adjustment,
      adjustmentType: template.adjustmentType,
      isActive: true
    };
    setPricingRules([...pricingRules, newRule]);
  };

  const removePricingRule = (id: string) => {
    setPricingRules(pricingRules.filter(rule => rule.id !== id));
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'time_based': return <Clock className="w-4 h-4" />;
      case 'day_based': return <Calendar className="w-4 h-4" />;
      case 'seasonal': return <Sun className="w-4 h-4" />;
      case 'actor_based': return <Percent className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getRuleBadgeColor = (type: string) => {
    switch (type) {
      case 'time_based': return 'bg-blue-100 text-blue-800';
      case 'day_based': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-yellow-100 text-yellow-800';
      case 'actor_based': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <Accordion type="multiple" defaultValue={["rental-type", "base-pricing"]} className="space-y-4">
          
          {/* Rental Type Selection */}
          <AccordionItem value="rental-type" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Rental Type</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {RENTAL_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={selectedRentalType === type.value ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setSelectedRentalType(type.value)}
                  >
                    {type.icon}
                    <span className="text-sm font-medium">{type.label}</span>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Choose how this facility can be rented: by the hour, by the day, or as a fixed seasonal package.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Base Pricing */}
          <AccordionItem value="base-pricing" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Base Pricing</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price_per_hour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {selectedRentalType === 'hourly' ? 'Price per Hour (NOK)' :
                         selectedRentalType === 'daily' ? 'Price per Day (NOK)' :
                         'Fixed Season Price (NOK)'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="450.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time_slot_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Booking Duration</FormLabel>
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
                          <SelectItem value="8">8 hours (1 day)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">Price Preview</div>
                    <div className="text-lg font-bold text-green-600">
                      {form.watch('price_per_hour') || 450} NOK/{selectedRentalType === 'hourly' ? 'hour' : selectedRentalType === 'daily' ? 'day' : 'season'}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pricing Rules */}
          <AccordionItem value="pricing-rules" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                <span className="font-medium">Dynamic Pricing Rules</span>
                <Badge variant="outline" className="ml-auto mr-8">
                  {pricingRules.length} active
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              
              {/* Rule Templates */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3">Quick Add Rules</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PRICING_RULE_TEMPLATES.map((template, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center gap-1 text-xs"
                      onClick={() => addPricingRule(template)}
                    >
                      {getRuleIcon(template.type)}
                      <span className="font-medium">{template.name}</span>
                      <span className="text-muted-foreground">
                        {template.adjustment > 0 ? '+' : ''}{template.adjustment}%
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active Rules */}
              {pricingRules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Active Rules</h4>
                  {pricingRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        {getRuleIcon(rule.type)}
                        <div>
                          <div className="font-medium text-sm">{rule.name}</div>
                          <div className="text-xs text-muted-foreground">{rule.condition}</div>
                        </div>
                        <Badge className={getRuleBadgeColor(rule.type)}>
                          {rule.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {rule.adjustment > 0 ? '+' : ''}{rule.adjustment}%
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePricingRule(rule.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pricingRules.length === 0 && (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Percent className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pricing rules configured</p>
                  <p className="text-xs">Add rules above to adjust pricing based on time, day, season, or customer type</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Payment Terms */}
          <AccordionItem value="payment-terms" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Payment Terms & Policies</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Payment Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Advance Payment:</span>
                      <span className="font-medium">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancellation Fee:</span>
                      <span className="font-medium">50% if &lt; 24h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Booking Fee:</span>
                      <span className="font-medium">25% if &lt; 2h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Available Discounts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Organization:</span>
                      <span className="font-medium text-green-600">-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recurring bookings:</span>
                      <span className="font-medium text-green-600">-10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Off-peak hours:</span>
                      <span className="font-medium text-green-600">-20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
});

FacilityPricingSection.displayName = "FacilityPricingSection";
