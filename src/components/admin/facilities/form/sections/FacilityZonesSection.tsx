
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Trash2, Grid3X3, Move } from "lucide-react";

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
}

export const FacilityZonesSection: React.FC<FacilityZonesSectionProps> = ({ form, facilityId }) => {
  const { tSync } = useTranslation();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZone, setNewZone] = useState<Partial<Zone>>({
    name: '',
    type: 'room',
    capacity: 1,
    description: '',
    isMainZone: false,
    bookableIndependently: true,
    areaSqm: 0,
    floor: '',
    equipment: [],
    status: 'active'
  });

  const addZone = () => {
    if (newZone.name && newZone.capacity) {
      const zone: Zone = {
        id: Date.now().toString(),
        name: newZone.name,
        type: newZone.type as Zone['type'],
        capacity: newZone.capacity,
        description: newZone.description || '',
        isMainZone: newZone.isMainZone || false,
        bookableIndependently: newZone.bookableIndependently || true,
        areaSqm: newZone.areaSqm || 0,
        floor: newZone.floor || '',
        equipment: newZone.equipment || [],
        status: newZone.status as Zone['status'] || 'active'
      };
      setZones([...zones, zone]);
      setNewZone({
        name: '',
        type: 'room',
        capacity: 1,
        description: '',
        isMainZone: false,
        bookableIndependently: true,
        areaSqm: 0,
        floor: '',
        equipment: [],
        status: 'active'
      });
      setIsAddingZone(false);
    }
  };

  const removeZone = (id: string) => {
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
                      <span className="font-medium">Floor:</span> {zone.floor || 'Ground'}
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
                  <Button size="sm" variant="ghost">
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeZone(zone.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Zone Section */}
        {isAddingZone ? (
          <div className="space-y-4 p-4 border-2 border-dashed rounded-lg">
            <h3 className="font-medium">{tSync("admin.facilities.form.zones.addNew", "Add New Zone")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.name", "Zone Name")} *</label>
                <Input
                  value={newZone.name}
                  onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                  placeholder="e.g., Court A, Meeting Room 1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.type", "Zone Type")}</label>
                <Select onValueChange={(value) => setNewZone({...newZone, type: value as Zone['type']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="court">Court</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="section">Section</SelectItem>
                    <SelectItem value="field">Field</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.capacity", "Capacity")} *</label>
                <Input
                  type="number"
                  value={newZone.capacity}
                  onChange={(e) => setNewZone({...newZone, capacity: parseInt(e.target.value) || 1})}
                  placeholder="Number of people"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.area", "Area (m²)")}</label>
                <Input
                  type="number"
                  value={newZone.areaSqm}
                  onChange={(e) => setNewZone({...newZone, areaSqm: parseFloat(e.target.value) || 0})}
                  placeholder="Square meters"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.floor", "Floor/Level")}</label>
                <Input
                  value={newZone.floor}
                  onChange={(e) => setNewZone({...newZone, floor: e.target.value})}
                  placeholder="e.g., Ground, 1st Floor, Basement"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.status", "Status")}</label>
                <Select onValueChange={(value) => setNewZone({...newZone, status: value as Zone['status']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{tSync("admin.facilities.form.zones.description", "Description")}</label>
              <Textarea
                value={newZone.description}
                onChange={(e) => setNewZone({...newZone, description: e.target.value})}
                placeholder="Describe this zone's features and purpose"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newZone.isMainZone}
                  onCheckedChange={(checked) => setNewZone({...newZone, isMainZone: checked})}
                />
                <label className="text-sm">{tSync("admin.facilities.form.zones.isMain", "Main Zone")}</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newZone.bookableIndependently}
                  onCheckedChange={(checked) => setNewZone({...newZone, bookableIndependently: checked})}
                />
                <label className="text-sm">{tSync("admin.facilities.form.zones.independent", "Bookable Independently")}</label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addZone} size="sm">
                {tSync("admin.facilities.form.zones.save", "Save Zone")}
              </Button>
              <Button onClick={() => setIsAddingZone(false)} size="sm" variant="outline">
                {tSync("admin.common.cancel", "Cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAddingZone(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {tSync("admin.facilities.form.zones.addZone", "Add Zone")}
          </Button>
        )}

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
