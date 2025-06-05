
import React from "react";
import { Button } from "@/components/ui/button";

interface BookingsHeaderProps {
  totalBookings: number;
}

export function BookingsHeader({ totalBookings }: BookingsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mine reservasjoner
        </h1>
        <p className="text-gray-600">
          Oversikt over alle dine aktive og tidligere reservasjoner
        </p>
      </div>
      <Button 
        className="bg-[#0B3D91] hover:bg-blue-700 text-white mt-4 md:mt-0"
        onClick={() => window.location.href = "/"}
      >
        + Ny reservasjon
      </Button>
    </div>
  );
}
