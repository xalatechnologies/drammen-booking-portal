
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FacilityFormBreadcrumbProps {
  facilityName?: string;
  isEditing?: boolean;
}

export function FacilityFormBreadcrumb({ facilityName, isEditing }: FacilityFormBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
        <Home className="h-4 w-4 mr-1" />
        Admin
      </Button>
      <ChevronRight className="h-4 w-4" />
      <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
        Facilities
      </Button>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium">
        {isEditing ? (facilityName || 'Edit Facility') : 'New Facility'}
      </span>
    </nav>
  );
}
