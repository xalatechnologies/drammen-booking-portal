import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLocalization } from '@/core/localization/hooks/useLocalization';

/**
 * FacilityStatus type definition
 * Represents the possible statuses a facility can have in the admin interface
 */
export type FacilityStatus = 'active' | 'inactive' | 'maintenance' | 'pending';

/**
 * Props for the FacilityStatusBadge component
 * Following Interface Segregation Principle with a minimal interface
 */
interface FacilityStatusBadgeProps {
  status: FacilityStatus | string;
}

/**
 * FacilityStatusBadge Component
 * 
 * Renders a styled badge indicating the status of a facility
 * Following Single Responsibility Principle by focusing only on displaying status
 */
export function FacilityStatusBadge({ status }: FacilityStatusBadgeProps) {
  const { translate } = useLocalization();

  // Get appropriate classname based on status
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  // Get translated status label
  const getStatusLabel = (status: string) => {
    const statusKey = status.toLowerCase();
    return translate(`admin.facilities.status.${statusKey}`);
  };

  return (
    <Badge
      variant="outline"
      className={`font-medium ${getStatusStyle(status)}`}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
