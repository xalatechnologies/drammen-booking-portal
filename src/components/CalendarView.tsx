
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarViewProps {
  date?: Date;
  facilityType: string;
  location: string;
  accessibility?: string;
  capacity?: number[];
}

const CalendarView: React.FC<CalendarViewProps> = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Kalenderen lastes inn...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
