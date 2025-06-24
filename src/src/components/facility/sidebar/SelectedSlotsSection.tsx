
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, X, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

interface SelectedSlotsSectionProps {
  slotsByDate: Record<string, Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    zone?: string;
    price?: number;
  }>>;
  onSlotRemove: (slotId: string) => void;
}

export function SelectedSlotsSection({ slotsByDate, onSlotRemove }: SelectedSlotsSectionProps) {
  const formatDateString = (dateStr: string) => {
    try {
      // Check if it's already a Date object or a valid date string
      const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
      return format(date, 'EEEE d. MMMM', { locale: nb });
    } catch (error) {
      // Fallback for invalid date formats
      return dateStr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Valgte tider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(slotsByDate).map(([date, slots]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium text-sm capitalize">
                {formatDateString(date)}
              </h4>
            </div>
            
            <div className="space-y-2 ml-6">
              {slots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {slot.zone && (
                        <Badge variant="outline" className="text-xs">
                          {slot.zone}
                        </Badge>
                      )}
                    </div>
                    {slot.price && (
                      <p className="text-xs text-gray-600">
                        {slot.price.toLocaleString('nb-NO')} kr
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSlotRemove(slot.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {Object.keys(slotsByDate).length > 1 && (
              <Separator className="mt-3" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
