
import React from "react";
import { Calendar } from "lucide-react";

export const CalendarEmptyState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium">Ingen lokaler funnet</p>
      <p className="text-sm text-gray-500">Prøv å justere filtrene dine</p>
    </div>
  );
};
