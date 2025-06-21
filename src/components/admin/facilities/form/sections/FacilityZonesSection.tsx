
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Grid3X3, Move, Edit, Trash2 } from "lucide-react";
import { ZoneEditor } from "./zones/ZoneEditor";

interface FacilityZonesSectionProps {
  form: UseFormReturn<FacilityFormData>;
  facilityId?: number;
}

interface Zone {
  id: string;
  name: string;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity: number;
  description: string;
  isMainZone: boolean;
  bookableIndependently: boolean;
  areaSqm: number;
  floor: string;
  equipment: string[];
  status: 'active' | 'maintenance' | 'inactive';
  priceMultiplier: number;
  minBookingDuration: number;
  maxBookingDuration: number;
}

export const FacilityZonesSection: React.FC<FacilityZonesSectionProps> = ({ form, facilityId }) => {
  const { tSync } = useTranslation();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const handleSaveZone = (zone: Zone) => {
    if (editingZone) {
      setZones(zones.map(z => z.id === zone.id ? zone : z));
      setEditingZone(null);
    } else {
      setZones([...zones, zone]);
      setIsAddingZone(false);
    }
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
  };

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

  if (isAddingZone || editingZone) {
    return (
      <ZoneEditor
        zone={editingZone || undefined}
        onSave={handleSaveZone}
        onCancel={() => {
          setIsAddingZone(false);
          setEditingZone(null);
        }}
        existingZones={zones}
      />
    );
  }

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
                    <Badge variant="outline">{getZoneTypeLabel(zone.type)}</Badge>
                    <Badge className={getStatusColor(zone.status)}>{zone.status}</Badge>
                    {zone.isMainZone && <Badge variant="default">Main Zone</Badge>}
                    {!zone.bookableIndependently && <Badge variant="secondary">Part of Main</Badge>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Capacity:</span> {zone.capacity} people
                    </div>
                    <div>
                      <span className="font-medium">Area:</span> {zone.areaSqm} m²
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ×{zone.priceMultiplier}
                    </div>
                    <div>
                      <span className="font-medium">Equipment:</span> {zone.equipment.length} items
                    </div>
                  </div>
                  {zone.description && (
                    <p className="text-sm text-muted-foreground mt-2">{zone.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingZone(zone)}
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
        <Button onClick={() => setIsAddingZone(true)} variant="outline" className="w-full">
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
    </Card>
  );
};
