import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalization } from "@/core/localization/hooks/useLocalization";

/**
 * BookingSuccessPage Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface BookingSuccessPageProps {
  bookingReference: string;
  facilityId: string | undefined;
}

/**
 * BookingSuccessPage Component
 * 
 * Responsible for displaying a success confirmation after booking completion
 * Following Single Responsibility Principle by focusing only on success confirmation presentation
 */
export function BookingSuccessPage({ bookingReference, facilityId }: BookingSuccessPageProps) {
  const navigate = useNavigate();
  const { translate } = useLocalization();

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {translate('booking.reservationCompleted')}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            {translate('booking.reservationReceived')} <strong>{bookingReference}</strong>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">{translate('booking.whatHappensNext')}</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• {translate('booking.emailConfirmationSent')}</li>
              <li>• {translate('booking.smsWhenApproved')}</li>
              <li>• {translate('booking.processingTime')}</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/bookings")}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {translate('booking.viewYourReservations')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/facilities/${facilityId}`)}
              size="lg"
            >
              {translate('booking.backToFacility')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
