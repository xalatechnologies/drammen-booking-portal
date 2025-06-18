
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookingsHeaderProps {
  totalBookings: number;
}

export function BookingsHeader({ totalBookings }: BookingsHeaderProps) {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      title: "Mine reservasjoner",
      description: "Oversikt over alle dine aktive og tidligere reservasjoner",
      newReservation: "+ Ny reservasjon"
    },
    EN: {
      title: "My reservations",
      description: "Overview of all your active and previous reservations",
      newReservation: "+ New reservation"
    }
  };

  const t = translations[language];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t.title}
        </h1>
        <p className="text-gray-600">
          {t.description}
        </p>
      </div>
      <Button 
        className="bg-[#0B3D91] hover:bg-blue-700 text-white mt-4 md:mt-0"
        onClick={() => window.location.href = "/"}
      >
        {t.newReservation}
      </Button>
    </div>
  );
}
