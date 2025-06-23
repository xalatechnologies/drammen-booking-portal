import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, DollarSign } from "lucide-react";
import { FacilityFormData } from "../FacilityFormSchema";
import { PricingService } from "@/services/PricingService";

interface FacilityPricingSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityPricingSection: React.FC<FacilityPricingSectionProps> = ({
  form
}) => {
  const [pricingRules, setPricingRules] = useState<any[]>([]);

  useEffect(() => {
    const rules = PricingService.getPricingRules();
    setPricingRules(rules);
  }, []);

  const addPricingRule = () => {
    const newRule = {
      id: Date.now().toString(),
      type: 'base',
      value: 0,
      conditions: []
    };
    setPricingRules([...pricingRules, newRule]);
  };

  const removePricingRule = (id: string) => {
    setPricingRules(pricingRules.filter(rule => rule.id !== id));
  };

  const updatePricingRule = (id: string, updates: any) => {
    setPricingRules(pricingRules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Pricing Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_per_hour">Base Price per Hour (NOK)</Label>
            <Input
              id="price_per_hour"
              type="number"
              min="0"
              step="50"
              {...form.register("price_per_hour", { valueAsNumber: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time_slot_duration">Time Slot Duration (hours)</Label>
            <Select
              value={form.watch("time_slot_duration")?.toString()}
              onValueChange={(value) => form.setValue("time_slot_duration", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Pricing Rules</h4>
            <Button type="button" onClick={addPricingRule} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {pricingRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No pricing rules configured</p>
              <p className="text-sm">Add rules to customize pricing based on conditions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pricingRules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Rule Type</Label>
                        <Select
                          value={rule.type}
                          onValueChange={(value) => updatePricingRule(rule.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="base">Base Price</SelectItem>
                            <SelectItem value="discount">Discount</SelectItem>
                            <SelectItem value="surcharge">Surcharge</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={rule.value}
                          onChange={(e) => updatePricingRule(rule.id, { value: parseFloat(e.target.value) })}
                          placeholder="Enter value"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Badge variant={rule.active ? 'default' : 'secondary'}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePricingRule(rule.id)}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Pricing Preview</h5>
          <div className="text-sm text-blue-700">
            <p>Base price: {form.watch("price_per_hour") || 450} NOK/hour</p>
            <p>Slot duration: {form.watch("time_slot_duration") || 1} hour(s)</p>
            <p className="font-medium">Price per slot: {(form.watch("price_per_hour") || 450) * (form.watch("time_slot_duration") || 1)} NOK</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
