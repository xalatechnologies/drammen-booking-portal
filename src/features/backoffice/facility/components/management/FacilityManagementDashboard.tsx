import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { FacilityListView } from '../FacilityListView';
import { useFacilityContext } from '@/contexts/facility/FacilityContext';
import { Facility, FacilityStatus } from '@/types/facility';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

/**
 * FacilityManagementDashboard Component
 * 
 * Administrative dashboard for managing facilities
 * Following Single Responsibility Principle by focusing only on facility management UI
 * Following Open/Closed Principle by being extensible through composition
 * Following Dependency Inversion Principle by depending on abstractions (context, hooks)
 */
export function FacilityManagementDashboard() {
  const { translate } = useLocalization();
  const { 
    facilities, 
    loading, 
    error, 
    loadFacilities, 
    selectedFacility, 
    selectFacility, 
    clearSelection,
    updateFacilityStatus 
  } = useFacilityContext();
  
  const [activeTab, setActiveTab] = useState('all');
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  // Filter facilities based on active tab
  const filteredFacilities = facilities.filter(facility => {
    if (activeTab === 'all') return true;
    return facility.status === activeTab;
  });
  
  // Handle facility selection
  const handleFacilitySelect = async (id: string) => {
    await selectFacility(id);
  };
  
  // Handle facility deselection
  const handleFacilityDeselect = () => {
    clearSelection();
  };
  
  // Handle facility status update
  const handleStatusChange = async (id: string, newStatus: FacilityStatus) => {
    setStatusUpdating(true);
    try {
      await updateFacilityStatus(id, newStatus);
    } finally {
      setStatusUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{translate('common.error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Main management interface */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">{translate('admin.facilities.filters.all')}</TabsTrigger>
            <TabsTrigger value={FacilityStatus.ACTIVE}>{translate('admin.facilities.filters.active')}</TabsTrigger>
            <TabsTrigger value={FacilityStatus.INACTIVE}>{translate('admin.facilities.filters.inactive')}</TabsTrigger>
            <TabsTrigger value={FacilityStatus.MAINTENANCE}>{translate('admin.facilities.filters.maintenance')}</TabsTrigger>
            <TabsTrigger value={FacilityStatus.PENDING}>{translate('admin.facilities.filters.pending')}</TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            onClick={loadFacilities} 
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {translate('common.refresh')}
          </Button>
        </div>
        
        <TabsContent value={activeTab} className="space-y-6">
          {/* Facilities list view */}
          <FacilityListView 
            selectedFacilityId={selectedFacility?.id} 
            onFacilitySelect={handleFacilitySelect}
            onFacilityDeselect={handleFacilityDeselect}
          />
        </TabsContent>
      </Tabs>
      
      {/* Selected facility quick actions */}
      {selectedFacility && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{translate('admin.facilities.quickActions')}</CardTitle>
            <CardDescription>
              {translate('admin.facilities.selectedFacility')}: {selectedFacility.name.EN || Object.values(selectedFacility.name)[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                disabled={statusUpdating || selectedFacility.status === FacilityStatus.ACTIVE}
                onClick={() => handleStatusChange(selectedFacility.id, FacilityStatus.ACTIVE)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {translate('admin.facilities.actions.activate')}
              </Button>
              
              <Button 
                variant="outline" 
                disabled={statusUpdating || selectedFacility.status === FacilityStatus.INACTIVE}
                onClick={() => handleStatusChange(selectedFacility.id, FacilityStatus.INACTIVE)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {translate('admin.facilities.actions.deactivate')}
              </Button>
              
              <Button 
                variant="outline" 
                disabled={statusUpdating || selectedFacility.status === FacilityStatus.MAINTENANCE}
                onClick={() => handleStatusChange(selectedFacility.id, FacilityStatus.MAINTENANCE)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {translate('admin.facilities.actions.maintenance')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
