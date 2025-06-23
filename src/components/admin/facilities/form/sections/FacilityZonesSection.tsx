import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Grid3X3, Move, Edit, Trash2 } from "lucide-react";
import { ZoneEditor } from "./zones/ZoneEditor";
import { ZoneService } from '@/services/ZoneService';
import { ZoneManagementModal, Zone } from "../zones/ZoneManagementModal";

interface FacilityZonesSectionProps {
  facilityId: string;
}

interface FacilityZonesSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityZonesSection = forwardRef<FacilityZonesSectionRef, FacilityZonesSectionProps>(({ facilityId }, ref) => {
  const { tSync } = useTranslation();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedZoneIds, setDeletedZoneIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadZones();
  }, [facilityId]);

  const loadZones = async () => {
    if (!facilityId) return;
    
    setLoading(true);
    try {
      console.log('FacilityZonesSection.loadZones - Loading zones for facility ID:', facilityId);
      const response = await ZoneService.getZonesByFacilityId(parseInt(facilityId));
      console.log('FacilityZonesSection.loadZones - Response:', response);
      
      if (response.success && response.data) {
        console.log('FacilityZonesSection.loadZones - Raw zone data:', response.data);
        const uiZones = response.data.map(dbZoneToUIZone);
        console.log('FacilityZonesSection.loadZones - Mapped UI zones:', uiZones);
        setZones(uiZones);
      } else {
        console.error('Failed to load zones:', response.error);
        setError('Failed to load zones: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading zones:', error);
      setError('Error loading zones: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      if (!facilityId) {
        console.log('FacilityZonesSection.saveData - No facilityId provided');
        return true;
      }
      
      console.log(`FacilityZonesSection.saveData - Starting save for facility ID: ${facilityId}`);
      console.log(`FacilityZonesSection.saveData - Zones to save:`, zones);
      console.log(`FacilityZonesSection.saveData - Zones to delete:`, deletedZoneIds);
      
      setLoading(true);
      setError(null);
      try {
        // Create or update zones
        for (const zone of zones) {
          // Skip invalid zones
          if (!zone || typeof zone !== 'object') {
            console.error('FacilityZonesSection.saveData - Invalid zone object:', zone);
            continue;
          }
          
          // Ensure zone has an ID
          if (!zone.id) {
            console.log(`FacilityZonesSection.saveData - Zone missing ID, generating temporary ID:`, zone);
            zone.id = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          }
          
          if (typeof zone.id === 'string' && zone.id.startsWith('temp-')) {
            console.log(`FacilityZonesSection.saveData - Creating new zone:`, zone);
            const dbZone = uiZoneToDBZone(zone, facilityId);
            console.log(`FacilityZonesSection.saveData - Mapped DB zone for create:`, dbZone);
            
            const response = await ZoneService.createZone(dbZone);
            console.log(`FacilityZonesSection.saveData - Create zone response:`, response);
            
            if (!response.success) {
              console.error('Failed to create zone:', zone.name, response.error);
              setError(`Failed to create zone: ${zone.name || 'Unknown'}`);
              return false;
            }
          } else {
            console.log(`FacilityZonesSection.saveData - Updating zone:`, zone);
            const dbZone = uiZoneToDBZone(zone, facilityId);
            console.log(`FacilityZonesSection.saveData - Mapped DB zone for update:`, dbZone);
            
            const response = await ZoneService.updateZone(zone.id, dbZone);
            console.log(`FacilityZonesSection.saveData - Update zone response:`, response);
            
            if (!response.success) {
              console.error('Failed to update zone:', zone.name, response.error);
              setError(`Failed to update zone: ${zone.name || 'Unknown'}`);
              return false;
            }
          }
        }

        // Delete zones
        for (const deletedId of deletedZoneIds) {
          console.log(`FacilityZonesSection.saveData - Deleting zone with ID:`, deletedId);
          
          const response = await ZoneService.deleteZone(deletedId);
          console.log(`FacilityZonesSection.saveData - Delete zone response:`, response);
          
          if (!response.success) {
            console.error('Failed to delete zone:', deletedId, response.error);
            setError(`Failed to delete zone ID: ${deletedId}`);
            return false;
          }
        }

        console.log('FacilityZonesSection.saveData - All zones saved successfully');
        setDeletedZoneIds([]);
        return true;
      } catch (error: any) {
        console.error('FacilityZonesSection.saveData - Exception:', error);
        setError(error.message || 'Failed to save zones');
        return false;
      } finally {
        setLoading(false);
      }
    }
  }), [zones, deletedZoneIds, facilityId]);


  const handleSaveZone = async (zone: Zone) => {
    try {
      setLoading(true);
      
      if (editingZone) {
        // Update existing zone
        const zoneData = {
          ...zone,
          facility_id: parseInt(facilityId),
          isActive: zone.status === 'active'
        };
        
        const response = await ZoneService.updateZone(zone.id, zoneData);
        
        if (response.success) {
          setZones(zones.map(z => z.id === zone.id ? zone : z));
          setEditingZone(null);
        } else {
          console.error('Failed to update zone:', response.error);
          // You might want to show an error message to the user here
        }
      } else {
        // Create new zone
        const newZone = {
          ...zone,
          id: `zone_${Date.now()}`, // Generate temporary ID
          facility_id: parseInt(facilityId),
          isActive: zone.status === 'active',
          isMainZone: false // Always set to false since we hid the toggle
        };
        
        const response = await ZoneService.createZone(newZone);
        
        if (response.success && response.data) {
          // Add the new zone with the server-generated ID
          setZones([...zones, { ...newZone, id: response.data.id }]);
          setIsAddingZone(false);
        } else {
          console.error('Failed to create zone:', response.error);
          // You might want to show an error message to the user here
        }
      }
    } catch (error) {
      console.error('Error saving zone:', error);
    } finally {
      setLoading(false);
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
    if (id && id.length > 10) setDeletedZoneIds([...deletedZoneIds, id]);
  };

  // Map DB Zone to UI Zone
  function dbZoneToUIZone(db: any): Zone {
    console.log('dbZoneToUIZone - Processing zone:', db);
    
    // Ensure arrays are properly handled
    const equipment = Array.isArray(db.equipment) ? db.equipment : 
                     (typeof db.equipment === 'string' ? JSON.parse(db.equipment || '[]') : []);
    
    const amenities = Array.isArray(db.amenities) ? db.amenities : 
                     (typeof db.amenities === 'string' ? JSON.parse(db.amenities || '[]') : []);
    
    const accessibilityFeatures = Array.isArray(db.accessibility_features) ? db.accessibility_features : 
                                 (typeof db.accessibility_features === 'string' ? JSON.parse(db.accessibility_features || '[]') : []);
    
    const mappedZone = {
      id: db.id,
      name: db.name,
      type: db.type || 'room',
      capacity: db.capacity || 0,
      notes: db.description || db.notes || '',
      isMainZone: db.is_main_zone || false,
      bookableIndependently: db.bookable_independently || false,
      areaSqm: db.area_sqm || 0,
      floor: db.floor || 0,
      equipment: equipment,
      amenities: amenities,
      accessibilityFeatures: accessibilityFeatures,
      status: db.status || 'active',
      priceMultiplier: db.price_multiplier || 1,
      minBookingDuration: db.min_booking_duration || 60,
      maxBookingDuration: db.max_booking_duration || 480,
      isActive: db.status === 'active',
    };
    
    console.log('dbZoneToUIZone - Mapped zone:', mappedZone);
    return mappedZone;
  }

  // Map UI Zone to DB Zone
  function uiZoneToDBZone(ui: Zone, facilityId: string) {
    return {
      ...ui,
      facility_id: parseInt(facilityId),
      is_main_zone: ui.isMainZone,
      bookable_independently: ui.bookableIndependently,
      area_sqm: ui.areaSqm,
      price_multiplier: ui.priceMultiplier,
      min_booking_duration: ui.minBookingDuration,
      max_booking_duration: ui.maxBookingDuration,
      is_active: ui.isActive,
      // Ensure description is properly mapped from notes
      description: ui.notes,
      // Map the new feature arrays
      equipment: ui.equipment || [],
      amenities: ui.amenities || [],
      accessibility_features: ui.accessibilityFeatures || [],
    };
  }

  const getZoneTypeLabel = (type: string) => {
    const labels = {
      'court': 'Court',
      'room': 'Room', 
      'area': 'Area',
      'section': 'Section',
      'field': 'Field'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getZoneTypeIcon = (type: string) => {
    const icons = {
      court: '🏐',
      room: '🏢',
      area: '📐',
      section: '📋',
      field: '⚽'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  const handleAddZone = () => {
    setIsAddingZone(true);
    setIsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          {tSync("admin.facilities.form.zones.title", "Zone Management")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone List */}
        {zones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-1">{tSync("admin.facilities.form.zones.noZones", "No zones configured")}</h3>
            <p className="text-sm mb-4">{tSync("admin.facilities.form.zones.noZonesHint", "Create zones to divide this facility into bookable areas")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                <div className="text-2xl">{getZoneTypeIcon(zone.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{zone.name}</h4>
                    <Badge variant="default">{getZoneTypeLabel(zone.type)}</Badge>
                    <Badge className={getStatusColor(zone.status)}>{zone.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Capacity:</span> {zone.capacity} people
                    </div>
                    <div>
                      <span className="font-medium">Area:</span> {zone.areaSqm} m²
                    </div>
                  </div>
                  {zone.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{zone.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleEditZone(zone)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteZone(zone.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Zone Button */}
        <Button type="button" onClick={handleAddZone} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {tSync("admin.facilities.form.zones.addZone", "Add Zone")}
        </Button>

        {/* Summary */}
        {zones.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Total Zones</div>
              <div className="text-lg font-bold">{zones.length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Total Capacity</div>
              <div className="text-lg font-bold">{zones.reduce((sum, zone) => sum + zone.capacity, 0)}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Active Zones</div>
              <div className="text-lg font-bold text-green-600">{zones.filter(z => z.status === 'active').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Bookable Zones</div>
              <div className="text-lg font-bold text-blue-600">{zones.filter(z => z.bookableIndependently).length}</div>
            </div>
          </div>
        )}
      </CardContent>
      <ZoneManagementModal 
        isOpen={isModalOpen} 
        zone={editingZone} 
        onSave={handleSaveZone} 
        onOpenChange={(isOpen) => setIsModalOpen(isOpen)} 
        facilityId={facilityId} 
      />
    </Card>
  );
});

FacilityZonesSection.displayName = "FacilityZonesSection";
