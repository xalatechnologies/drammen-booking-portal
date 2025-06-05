
import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingPageHeaderProps {
  facilityId: string | undefined;
  facilityName: string;
}

export function BookingPageHeader({ facilityId, facilityName }: BookingPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-1" />
              Hjem
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
            <span className="text-gray-900 font-medium">Ny reservasjon</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reserver {facilityName}
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Fyll ut skjemaet under for å reservere lokalet. All informasjon behandles trygt og sikkert.
        </p>
      </div>
    </>
  );
}
