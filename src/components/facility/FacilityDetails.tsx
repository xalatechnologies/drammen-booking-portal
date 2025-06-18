
import React from "react";
import { Clock, Users, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FacilityDetailsProps {
  capacity: number;
  nextAvailable: string;
  openingHours: string;
  onDetailsClick: (e: React.MouseEvent) => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({
  capacity,
  nextAvailable,
  openingHours,
  onDetailsClick,
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-8">
      {/* Quick Stats */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-lg mb-4">Tilgjengelighet</h4>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Neste ledige</p>
                <p className="text-base font-semibold text-green-700">{nextAvailable}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Kapasitet</p>
                <p className="text-base font-semibold text-slate-900">{capacity} personer</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Åpningstider</p>
                <p className="text-sm text-slate-600 leading-relaxed">{openingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6 border-t border-slate-200">
        <Button
          onClick={onDetailsClick}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 group text-base"
        >
          Se detaljer og book
          <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default FacilityDetails;
