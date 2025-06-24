
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { ZONE_TYPES, EQUIPMENT_OPTIONS } from "../../FacilityFormSchema";

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

interface ZoneEditorProps {
  zone?: Zone;
  onSave: (zone: Zone) => void;
  onCancel: () => void;
  existingZones: Zone[];
}

export const ZoneEditor: React.FC<ZoneEditorProps> = ({
  zone,
  onSave,
  onCancel,
  existingZones
}) => {
  const { tSync } = useTranslation();
  const [formData, setFormData] = useState<Zone>(() => 
    zone || {
      id: Date.now().toString(),
      name: '',
      type: 'room',
      capacity: 1,
      description: '',
      isMainZone: false,
      bookableIndependently: true,
      areaSqm: 0,
      floor: '',
      equipment: [],
      status: 'active',
      priceMultiplier: 1,
      minBookingDuration: 60,
      maxBookingDuration: 480
    }
  );

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(formData.equipment);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    // Validate main zone rules
    if (formData.isMainZone && existingZones.some(z => z.isMainZone && z.id !== formData.id)) {
      alert("Only one main zone is allowed per facility");
      return;
    }

    onSave({ ...formData, equipment: selectedEquipment });
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment) 
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getZoneTypeIcon(formData.type)}
          {zone ? 'Edit Zone' : 'Add New Zone'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Zone Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Court A, Meeting Room 1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Zone Type</label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value as Zone['type']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZONE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {getZoneTypeIcon(type.value)} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Capacity and Physical Properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Capacity *</label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
              placeholder="Number of people"
              min="1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Area (m²)</label>
            <Input
              type="number"
              value={formData.areaSqm}
              onChange={(e) => setFormData({...formData, areaSqm: parseFloat(e.target.value) || 0})}
              placeholder="Square meters"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Floor/Level</label>
            <Input
              value={formData.floor}
              onChange={(e) => setFormData({...formData, floor: e.target.value})}
              placeholder="e.g., Ground, 1st Floor"
            />
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <label className="text-sm font-medium">Price Multiplier</label>
            <Input
              type="number"
              value={formData.priceMultiplier}
              onChange={(e) => setFormData({...formData, priceMultiplier: parseFloat(e.target.value) || 1})}
              placeholder="1.0"
              min="0.1"
              step="0.1"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Multiplier applied to base facility price
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Min Booking (minutes)</label>
            <Select 
              value={formData.minBookingDuration.toString()} 
              onValueChange={(value) => setFormData({...formData, minBookingDuration: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Max Booking (minutes)</label>
            <Select 
              value={formData.maxBookingDuration.toString()} 
              onValueChange={(value) => setFormData({...formData, maxBookingDuration: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="720">12 hours</SelectItem>
                <SelectItem value="1440">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Equipment Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Available Equipment</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {EQUIPMENT_OPTIONS.map(equipment => (
              <div 
                key={equipment}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedEquipment.includes(equipment) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleEquipment(equipment)}
              >
                <div className="text-sm">{equipment}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Selected: {selectedEquipment.length} items
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe this zone's features, purpose, and any special requirements"
            rows={3}
          />
        </div>

        {/* Zone Configuration Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isMainZone}
              onCheckedChange={(checked) => setFormData({...formData, isMainZone: checked})}
            />
            <div>
              <label className="text-sm font-medium">Main Zone</label>
              <p className="text-xs text-muted-foreground">Primary zone for this facility</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.bookableIndependently}
              onCheckedChange={(checked) => setFormData({...formData, bookableIndependently: checked})}
            />
            <div>
              <label className="text-sm font-medium">Independent Booking</label>
              <p className="text-xs text-muted-foreground">Can be booked separately</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({...formData, status: value as Zone['status']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">🟢 Active</SelectItem>
                <SelectItem value="maintenance">🟡 Maintenance</SelectItem>
                <SelectItem value="inactive">🔴 Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            {zone ? 'Update Zone' : 'Create Zone'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
