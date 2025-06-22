import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { Facility } from '@/features/facility/types/facility';
import { useFacilityService } from '@/features/facility/hooks/useFacilityService';
import { FacilityListItem } from './FacilityListItem';

/**
 * FacilityListViewProps Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityListViewProps {
  selectedFacilityId?: string;
  onFacilitySelect?: (id: string) => void;
  onFacilityDeselect?: () => void;
}

/**
 * FacilityListView Component
 * 
 * Responsible for displaying a list of facilities in the admin interface
 * Following Single Responsibility Principle by focusing only on facility listing display
 * Following Open/Closed Principle by being configurable via props
 * Following Dependency Inversion by depending on abstractions (service hooks and callbacks)
 * Following Interface Segregation with minimal props
 */
export function FacilityListView({ 
  selectedFacilityId, 
  onFacilitySelect,
  onFacilityDeselect 
}: FacilityListViewProps) {
  const navigate = useNavigate();
  const { translate } = useLocalization();
  const { facilityService } = useFacilityService();
  
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');

  // Load facilities from service
  const loadFacilities = async () => {
    setIsLoading(true);
    try {
      const result = await facilityService.getAllFacilities();
      if (result.success) {
        setFacilities(result.data);
        setError(undefined);
      } else {
        setError(result.error?.message || 'Failed to load facilities');
        setFacilities([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load facilities on component mount
  useEffect(() => {
    loadFacilities();
  }, []);

  // Filter facilities based on search term
  const filteredFacilities = facilities.filter(facility => {
    const facilityName = Object.values(facility.name).join(' ').toLowerCase();
    return facilityName.includes(searchTerm.toLowerCase());
  });

  // Handle adding a new facility
  const handleAddFacility = () => {
    navigate('/admin/facilities/new');
  };

  // Handle editing a facility
  const handleEditFacility = (id: string) => {
    navigate(`/admin/facilities/${id}`);
  };

  // Handle deleting a facility
  const handleDeleteFacility = async (id: string) => {
    if (window.confirm(translate('admin.facilities.confirmDelete'))) {
      try {
        const result = await facilityService.deleteFacility(id);
        if (result.success) {
          // If the deleted facility was selected, deselect it
          if (selectedFacilityId === id && onFacilityDeselect) {
            onFacilityDeselect();
          }
          loadFacilities();
        } else {
          setError(result.error?.message || 'Failed to delete facility');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    }
  };

  // Handle selection of a facility
  const handleSelectFacility = (id: string) => {
    if (onFacilitySelect) {
      // If the same facility is clicked again, toggle selection
      if (id === selectedFacilityId && onFacilityDeselect) {
        onFacilityDeselect();
      } else {
        onFacilitySelect(id);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{translate('admin.facilities.title')}</CardTitle>
          <CardDescription>{translate('admin.facilities.description')}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={loadFacilities} 
            disabled={isLoading}
            aria-label={translate('common.refresh')}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {translate('common.refresh')}
          </Button>
          <Button 
            onClick={handleAddFacility}
            aria-label={translate('admin.facilities.addNew')}
          >
            <Plus className="h-4 w-4 mr-2" />
            {translate('admin.facilities.addNew')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder={translate('common.search')}
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={translate('common.search')}
            />
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4" role="alert">
            {error}
          </div>
        )}

        {/* Facilities table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translate('admin.facilities.name')}</TableHead>
                <TableHead>{translate('admin.facilities.type')}</TableHead>
                <TableHead className="text-center">{translate('admin.facilities.capacity')}</TableHead>
                <TableHead className="text-center">{translate('admin.facilities.status')}</TableHead>
                <TableHead className="text-right">{translate('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {translate('common.loading')}
                  </TableCell>
                </TableRow>
              ) : filteredFacilities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {searchTerm 
                      ? translate('admin.facilities.noSearchResults') 
                      : translate('admin.facilities.noFacilities')
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredFacilities.map((facility) => (
                  <FacilityListItem
                    key={facility.id}
                    facility={facility}
                    isSelected={selectedFacilityId === facility.id}
                    onSelect={handleSelectFacility}
                    onEdit={handleEditFacility}
                    onDelete={handleDeleteFacility}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
