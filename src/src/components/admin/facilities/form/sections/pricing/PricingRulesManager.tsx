
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Trash2, Edit, Copy } from "lucide-react";
import { ACTOR_TYPES, BOOKING_TYPES } from "../../FacilityFormSchema";

interface PricingRule {
  id: string;
  name: string;
  actorType: string;
  bookingType: string;
  timeSlot: 'morning' | 'day' | 'evening' | 'night' | 'all';
  dayType: 'weekday' | 'weekend' | 'holiday' | 'all';
  basePrice: number;
  multiplier: number;
  seasonalMultiplier: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

interface PricingRulesManagerProps {
  basePrice: number;
  onRulesChange: (rules: PricingRule[]) => void;
}

export const PricingRulesManager: React.FC<PricingRulesManagerProps> = ({
  basePrice,
  onRulesChange
}) => {
  const { tSync } = useTranslation();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  const createNewRule = (): PricingRule => ({
    id: Date.now().toString(),
    name: '',
    actorType: 'private-person',
    bookingType: 'engangs',
    timeSlot: 'all',
    dayType: 'all',
    basePrice: basePrice || 450,
    multiplier: 1,
    seasonalMultiplier: 1,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    isActive: true
  });

  const addRule = () => {
    const newRule = createNewRule();
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onRulesChange(updatedRules);
    setIsAddingRule(false);
  };

  const updateRule = (id: string, updates: Partial<PricingRule>) => {
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    );
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const removeRule = (id: string) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const duplicateRule = (rule: PricingRule) => {
    const duplicated = { ...rule, id: Date.now().toString(), name: `${rule.name} (Copy)` };
    const updatedRules = [...rules, duplicated];
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const getActorTypeLabel = (type: string) => {
    const actorType = ACTOR_TYPES.find(a => a.value === type);
    return actorType ? actorType.label : type;
  };

  const getBookingTypeLabel = (type: string) => {
    const bookingType = BOOKING_TYPES.find(b => b.value === type);
    return bookingType ? bookingType.label : type;
  };

  const calculateFinalPrice = (rule: PricingRule) => {
    return rule.basePrice * rule.multiplier * rule.seasonalMultiplier;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">
          {tSync("admin.facilities.form.pricing.advancedRules", "Advanced Pricing Rules")}
        </h3>
        <Button 
          type="button" 
          onClick={() => setIsAddingRule(true)} 
          size="sm" 
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-1" />
          {tSync("admin.facilities.form.pricing.addRule", "Add Rule")}
        </Button>
      </div>

      {rules.length === 0 && !isAddingRule ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            <div className="text-sm">
              {tSync("admin.facilities.form.pricing.noRules", "No advanced pricing rules configured")}
            </div>
            <div className="text-xs mt-1">
              {tSync("admin.facilities.form.pricing.noRulesHint", "Add rules for actor-specific, time-based, or seasonal pricing")}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} className={!rule.isActive ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{rule.name || 'Unnamed Rule'}</h4>
                    {!rule.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => duplicateRule(rule)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingRule(rule.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRule(rule.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Actor:</span>
                    <Badge variant="outline" className="ml-1">
                      {getActorTypeLabel(rule.actorType)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Booking:</span>
                    <Badge variant="outline" className="ml-1">
                      {getBookingTypeLabel(rule.bookingType)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Time:</span>
                    <Badge variant="outline" className="ml-1">
                      {rule.timeSlot} / {rule.dayType}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Final Price:</span>
                    <span className="ml-1 font-mono text-green-600">
                      {calculateFinalPrice(rule).toFixed(2)} NOK/hour
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Base: {rule.basePrice} × Multiplier: {rule.multiplier} × Seasonal: {rule.seasonalMultiplier}
                  {rule.validFrom && ` | Valid: ${rule.validFrom} - ${rule.validTo || 'ongoing'}`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAddingRule && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Pricing Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Rule Name *</label>
                <Input placeholder="e.g., Weekend Premium for Organizations" />
              </div>
              <div>
                <label className="text-sm font-medium">Actor Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select actor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTOR_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} (×{type.multiplier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addRule} size="sm">
                Add Rule
              </Button>
              <Button 
                onClick={() => setIsAddingRule(false)} 
                size="sm" 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
