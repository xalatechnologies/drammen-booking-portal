
import React from "react";
import { Users } from "lucide-react";

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
    <div className="h-full flex flex-col justify-center p-8">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Kapasitet</p>
            <p className="text-base font-semibold text-slate-900">{capacity} personer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;
