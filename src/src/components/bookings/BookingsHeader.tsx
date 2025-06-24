
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface BookingsHeaderProps {
  totalBookings: number;
}

export function BookingsHeader({ totalBookings }: BookingsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('booking.myBookings', {}, 'Mine reservasjoner')}
        </h1>
        <p className="text-gray-600">
          {t('booking.myBookingsDescription', {}, 'Oversikt over alle dine aktive og tidligere reservasjoner')}
        </p>
      </div>
      <Button 
        className="bg-[#0B3D91] hover:bg-blue-700 text-white mt-4 md:mt-0"
        onClick={() => window.location.href = "/"}
      >
        {t('booking.newReservation', {}, '+ Ny reservasjon')}
      </Button>
    </div>
  );
}
