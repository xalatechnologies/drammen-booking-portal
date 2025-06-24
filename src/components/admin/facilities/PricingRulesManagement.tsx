
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface PricingRulesManagementProps {
  selectedFacilityId?: number;
}

export const PricingRulesManagement: React.FC<PricingRulesManagementProps> = ({
  selectedFacilityId
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <DollarSign className="w-6 h-6 mr-2" />
          Pricing Rules Management
        </h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Pricing rules management coming soon...
            <br />
            This will include actor-type pricing, daypart modifiers, and seasonal pricing.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
