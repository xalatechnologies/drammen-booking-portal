
import React from "react";
import { Calendar, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";

interface SelectedSlotsSectionProps {
  selectedSlots: SelectedTimeSlot[];
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onRemoveSlot: (zoneId: string, date: string, timeSlot: string) => void;
  onBookSlots: () => void;
  onClearSlots: () => void;
  totalPrice: number;
  requiresApproval: boolean;
  canProceed: boolean;
}

export function SelectedSlotsSection({
  selectedSlots,
  isOpen,
  onToggle,
  onRemoveSlot,
  onBookSlots,
  onClearSlots,
  totalPrice,
  requiresApproval,
  canProceed
}: SelectedSlotsSectionProps) {
  if (selectedSlots.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Valgte tidspunkt ({selectedSlots.length})
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Aktiv
              </Badge>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {selectedSlots.map((slot, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      {format(new Date(slot.date), 'dd.MM.yyyy')}
                    </p>
                    <p className="text-sm text-blue-700">{slot.timeSlot}</p>
                    <p className="text-xs text-blue-600">{slot.zoneId}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Estimert pris:</span>
                <span className="font-bold text-green-800">{totalPrice} kr</span>
              </div>
              {requiresApproval && (
                <p className="text-xs text-green-600 mt-1">Krever godkjenning</p>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={onBookSlots}
                className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                disabled={!canProceed}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Book valgte tidspunkt
              </Button>
              <Button
                variant="outline"
                onClick={onClearSlots}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
