
import React from "react";
import { Calendar } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

export const CalendarHeader: React.FC = () => {
  return (
    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
      <CardTitle className="text-xl font-semibold flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        Lokaler og tilgjengelighet
      </CardTitle>
    </CardHeader>
  );
};
