
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Map } from "lucide-react";
import { BookingFormValues, Zone } from "../../types";
import { EnhancedZoneSelector } from "../../EnhancedZoneSelector";
import { useModelTranslation } from "@/hooks/useModelTranslation";

interface ZoneSelectionSectionProps {
  form: UseFormReturn<BookingFormValues>;
  zones: Zone[];
  selectedDate: Date;
  selectedTimeSlot: string;
}

export function ZoneSelectionSection({ form, zones, selectedDate, selectedTimeSlot }: ZoneSelectionSectionProps) {
  const { getSectionTitle } = useModelTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Map className="h-5 w-5 text-slate-600" />
        {getSectionTitle('booking', 'zoneSelection')}
      </h3>
      
      <EnhancedZoneSelector
        form={form}
        zones={zones}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
      />
    </div>
  );
}
