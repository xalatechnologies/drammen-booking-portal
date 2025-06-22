import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "@/core/localization/hooks/useLocalization";

/**
 * BookingPageHeader Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface BookingPageHeaderProps {
  facilityId: string | undefined;
  facilityName: string;
}

/**
 * BookingPageHeader Component
 * 
 * Responsible for displaying the header section of the booking page with navigation breadcrumbs
 * Following Single Responsibility Principle by focusing only on header presentation
 */
export function BookingPageHeader({ facilityId, facilityName }: BookingPageHeaderProps) {
  const navigate = useNavigate();
  const { translate } = useLocalization();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm py-3">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4 mr-1" />
            {translate('common.home')}
          </Button>
          <span className="text-gray-400">/</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
            onClick={() => navigate(`/facilities/${facilityId}`)}
          >
            {facilityName}
          </Button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{translate('booking.newReservation')}</span>
        </nav>

        {/* Page Header */}
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {translate('booking.reserve')} {facilityName}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            {translate('booking.formInstructions')}
          </p>
        </div>
      </div>
    </div>
  );
}
