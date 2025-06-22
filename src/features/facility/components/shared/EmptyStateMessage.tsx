import React from "react";
import { useLocalization } from "@/core/localization/hooks/useLocalization";
import { SearchX } from "lucide-react";

/**
 * EmptyStateMessage Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface EmptyStateMessageProps {
  message?: string;
  submessage?: string;
  icon?: React.ReactNode;
}

/**
 * EmptyStateMessage Component
 * 
 * Responsible for displaying a message when no results are found
 * Following Single Responsibility Principle by focusing only on empty state display
 */
export function EmptyStateMessage({
  message,
  submessage,
  icon = <SearchX className="w-16 h-16 text-gray-300" />
}: EmptyStateMessageProps) {
  const { translate } = useLocalization();
  
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-gray-700">
        {message || translate('facility.noResults')}
      </h3>
      {(submessage || translate('facility.tryAdjustingFilters')) && (
        <p className="mt-2 text-gray-500">
          {submessage || translate('facility.tryAdjustingFilters')}
        </p>
      )}
    </div>
  );
}
