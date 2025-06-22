import React from 'react';
import { Facility } from '@/features/facility/types/facility';
import { FacilityStatusBadge } from './FacilityStatusBadge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useLocalization } from '@/core/localization/hooks/useLocalization';

/**
 * Props for FacilityListItem component
 * Following Interface Segregation Principle with focused interface
 */
interface FacilityListItemProps {
  facility: Facility;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * FacilityListItem Component
 * 
 * Displays a single facility in the admin facility list
 * Following Single Responsibility Principle by focusing only on rendering a list item
 * Following Open/Closed Principle by accepting callbacks for actions
 * Following Dependency Inversion by depending on abstractions (callbacks) rather than implementations
 */
export function FacilityListItem({
  facility,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete
}: FacilityListItemProps) {
  const { language, translate } = useLocalization();
  
  // Helper function to get localized text
  const getLocalText = (textObj: Record<string, string> | string) => {
    if (typeof textObj === 'string') {
      return textObj;
    }
    return textObj[language] || textObj.EN || Object.values(textObj)[0] || '';
  };
  
  // Handle click on the row
  const handleRowClick = () => {
    if (onSelect) {
      onSelect(facility.id);
    }
  };
  
  // Handle edit action with event stop propagation
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(facility.id);
    }
  };
  
  // Handle delete action with event stop propagation
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(facility.id);
    }
  };

  return (
    <tr 
      className={`cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? 'bg-gray-100' : ''}`}
      onClick={handleRowClick}
      data-testid={`facility-list-item-${facility.id}`}
    >
      <td className="px-4 py-3 font-medium">
        {getLocalText(facility.name)}
      </td>
      <td className="px-4 py-3">
        {getLocalText(facility.type)}
      </td>
      <td className="px-4 py-3 text-center">
        {facility.capacity}
      </td>
      <td className="px-4 py-3 text-center">
        <FacilityStatusBadge status={facility.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleEdit}
            aria-label={translate('admin.facilities.edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDelete}
            aria-label={translate('admin.facilities.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
