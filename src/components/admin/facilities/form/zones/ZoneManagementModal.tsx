import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Wrench, Star, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define Zone type to be shared across components
export interface Zone {
  id: string;
  name: string;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity?: number;
  notes?: string;
  isMainZone: boolean;
  bookableIndependently?: boolean;
  areaSqm?: number;
  status?: 'active' | 'maintenance' | 'inactive';
  isActive: boolean;
  facilityId?: string;
  createdAt?: string;
  updatedAt?: string;
  bookableHours?: any;
  images?: any;
  location?: any;
  rules?: any;
  floor?: string;
  equipment?: string[];
  amenities?: string[];
  accessibilityFeatures?: string[];
  priceMultiplier?: number;
  minBookingDuration?: number;
  maxBookingDuration?: number;
}

interface ZoneManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  zone?: Zone | null;
  onSave: (zone: Partial<Zone>) => Promise<void> | void;
  facilityId?: string;
}

export const ZoneManagementModal: React.FC<ZoneManagementModalProps> = ({
  isOpen,
  onOpenChange,
  zone,
  onSave,
  facilityId
}) => {
  const { tSync } = useTranslation();
  const isEditing = !!zone;
  
  // Form state (could use React Hook Form for more complex forms)
  const [formState, setFormState] = React.useState<Partial<Zone>>({
    name: zone?.name || "",
    type: zone?.type || "room",
    capacity: zone?.capacity || 1,
    notes: zone?.notes || "",
    isMainZone: zone?.isMainZone || false,
    bookableIndependently: zone?.bookableIndependently || true,
    areaSqm: zone?.areaSqm || 0,
    status: zone?.status || "active",
    equipment: zone?.equipment || [],
    amenities: zone?.amenities || [],
    accessibilityFeatures: zone?.accessibilityFeatures || [],
  });

  // Feature management states
  const [newEquipmentItem, setNewEquipmentItem] = React.useState("");
  const [newAmenityItem, setNewAmenityItem] = React.useState("");
  const [newAccessibilityItem, setNewAccessibilityItem] = React.useState("");

  // Update form when zone prop changes
  React.useEffect(() => {
    if (zone) {
      setFormState({
        id: zone.id,
        name: zone.name,
        type: zone.type,
        capacity: zone.capacity,
        notes: zone.notes,
        isMainZone: zone.isMainZone,
        bookableIndependently: zone.bookableIndependently,
        areaSqm: zone.areaSqm,
        status: zone.status,
        equipment: zone.equipment || [],
        amenities: zone.amenities || [],
        accessibilityFeatures: zone.accessibilityFeatures || [],
      });
    } else {
      // Reset form for new zone
      setFormState({
        name: "",
        type: "room",
        capacity: 1,
        notes: "",
        isMainZone: false,
        bookableIndependently: true,
        areaSqm: 0,
        status: "active",
        equipment: [],
        amenities: [],
        accessibilityFeatures: [],
      });
    }
  }, [zone, isOpen]);

  const handleChange = (field: keyof Zone, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Equipment management functions
  const addEquipmentItem = () => {
    if (newEquipmentItem.trim()) {
      const currentEquipment = formState.equipment || [];
      handleChange("equipment", [...currentEquipment, newEquipmentItem.trim()]);
      setNewEquipmentItem("");
    }
  };

  const removeEquipmentItem = (index: number) => {
    const currentEquipment = formState.equipment || [];
    const updated = currentEquipment.filter((_, i) => i !== index);
    handleChange("equipment", updated);
  };

  // Amenities management functions
  const addAmenityItem = () => {
    if (newAmenityItem.trim()) {
      const currentAmenities = formState.amenities || [];
      handleChange("amenities", [...currentAmenities, newAmenityItem.trim()]);
      setNewAmenityItem("");
    }
  };

  const removeAmenityItem = (index: number) => {
    const currentAmenities = formState.amenities || [];
    const updated = currentAmenities.filter((_, i) => i !== index);
    handleChange("amenities", updated);
  };

  // Accessibility features management functions
  const addAccessibilityItem = () => {
    if (newAccessibilityItem.trim()) {
      const currentAccessibilityFeatures = formState.accessibilityFeatures || [];
      handleChange("accessibilityFeatures", [...currentAccessibilityFeatures, newAccessibilityItem.trim()]);
      setNewAccessibilityItem("");
    }
  };

  const removeAccessibilityItem = (index: number) => {
    const currentAccessibilityFeatures = formState.accessibilityFeatures || [];
    const updated = currentAccessibilityFeatures.filter((_, i) => i !== index);
    handleChange("accessibilityFeatures", updated);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formState.name?.trim()) {
      alert(tSync("admin.facilities.form.zones.validation.nameRequired", "Zone name is required"));
      return;
    }
    
    if (!formState.capacity || formState.capacity < 1) {
      alert(tSync("admin.facilities.form.zones.validation.capacityRequired", "Capacity must be at least 1"));
      return;
    }
    
    if (!formState.areaSqm || formState.areaSqm <= 0) {
      alert(tSync("admin.facilities.form.zones.validation.areaSqmRequired", "Area (m²) is required and must be greater than 0"));
      return;
    }

    // Add facilityId if it's a new zone
    const zoneData = isEditing 
      ? formState 
      : { ...formState, facilityId };
      
    await onSave(zoneData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {isEditing 
                ? tSync("admin.facilities.form.zones.editZone", "Edit Zone") 
                : tSync("admin.facilities.form.zones.addZone", "Add New Zone")}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? tSync("admin.facilities.form.zones.editZoneDesc", "Update zone details below") 
                : tSync("admin.facilities.form.zones.addZoneDesc", "Create a new zone for this facility")}
            </DialogDescription>
          </DialogHeader>
        
          <Tabs defaultValue="basic" className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">
                {tSync("admin.facilities.form.zones.tabs.basic", "Basic Info")}
              </TabsTrigger>
              <TabsTrigger value="features">
                {tSync("admin.facilities.form.zones.tabs.features", "Features")}
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 overflow-y-auto max-h-[60vh]">
              <TabsContent value="basic" className="space-y-6 mt-0">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    {tSync("admin.facilities.form.zones.basicInfo", "Basic Information")}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zone-name" className="text-sm font-medium">
                        {tSync("admin.facilities.form.zones.name", "Zone Name")} <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="zone-name" 
                        value={formState.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder={tSync("admin.facilities.form.zones.namePlaceholder", "Enter zone name")} 
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zone-type" className="text-sm font-medium">
                        {tSync("admin.facilities.form.zones.type", "Zone Type")} <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formState.type} 
                        onValueChange={(value) => handleChange("type", value)}
                      >
                        <SelectTrigger id="zone-type">
                          <SelectValue placeholder={tSync("admin.facilities.form.zones.selectType", "Select zone type")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="court">{tSync("admin.facilities.form.zones.types.court", "Court")}</SelectItem>
                          <SelectItem value="room">{tSync("admin.facilities.form.zones.types.room", "Room")}</SelectItem>
                          <SelectItem value="area">{tSync("admin.facilities.form.zones.types.area", "Area")}</SelectItem>
                          <SelectItem value="section">{tSync("admin.facilities.form.zones.types.section", "Section")}</SelectItem>
                          <SelectItem value="field">{tSync("admin.facilities.form.zones.types.field", "Field")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Capacity and Area Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    {tSync("admin.facilities.form.zones.specifications", "Specifications")}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zone-capacity" className="text-sm font-medium">
                        {tSync("admin.facilities.form.zones.capacity", "Capacity")} <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="zone-capacity" 
                        type="number" 
                        value={formState.capacity || 1}
                        onChange={(e) => handleChange("capacity", parseInt(e.target.value))}
                        min={1}
                        placeholder="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zone-area-sqm" className="text-sm font-medium">
                        {tSync("admin.facilities.form.zones.areaSqm", "Area (m²)")} <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="zone-area-sqm" 
                        type="number" 
                        value={formState.areaSqm || 0}
                        onChange={(e) => handleChange("areaSqm", parseInt(e.target.value) || 0)}
                        min={0}
                        step="0.1"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Status and Settings Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    {tSync("admin.facilities.form.zones.settings", "Settings")}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zone-status" className="text-sm font-medium">
                      {tSync("admin.facilities.form.zones.status", "Status")}
                    </Label>
                    <Select 
                      value={formState.status || 'active'} 
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger id="zone-status">
                        <SelectValue placeholder={tSync("admin.facilities.form.zones.selectStatus", "Select status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{tSync("admin.facilities.form.zones.statuses.active", "Active")}</SelectItem>
                        <SelectItem value="maintenance">{tSync("admin.facilities.form.zones.statuses.maintenance", "Maintenance")}</SelectItem>
                        <SelectItem value="inactive">{tSync("admin.facilities.form.zones.statuses.inactive", "Inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    {tSync("admin.facilities.form.zones.additionalInfo", "Additional Information")}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zone-notes" className="text-sm font-medium">
                      {tSync("admin.facilities.form.zones.notes", "Notes")}
                    </Label>
                    <Textarea 
                      id="zone-notes" 
                      value={formState.notes || ""}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder={tSync("admin.facilities.form.zones.notesPlaceholder", "Additional notes about this zone")} 
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-0">
                {/* Equipment Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="w-5 h-5 mr-2" />
                      {tSync("admin.facilities.form.zones.features.equipment", "Equipment")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newEquipmentItem}
                          onChange={(e) => setNewEquipmentItem(e.target.value)}
                          placeholder={tSync("admin.facilities.form.zones.features.equipmentPlaceholder", "Add equipment item...")}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipmentItem())}
                        />
                        <Button type="button" onClick={addEquipmentItem} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(formState.equipment || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEquipmentItem(index)}
                              className="h-auto p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Amenities Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      {tSync("admin.facilities.form.zones.features.amenities", "Amenities")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newAmenityItem}
                          onChange={(e) => setNewAmenityItem(e.target.value)}
                          placeholder={tSync("admin.facilities.form.zones.features.amenitiesPlaceholder", "Add amenity...")}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenityItem())}
                        />
                        <Button type="button" onClick={addAmenityItem} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(formState.amenities || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAmenityItem(index)}
                              className="h-auto p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accessibility Features Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      {tSync("admin.facilities.form.zones.features.accessibility", "Accessibility Features")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newAccessibilityItem}
                          onChange={(e) => setNewAccessibilityItem(e.target.value)}
                          placeholder={tSync("admin.facilities.form.zones.features.accessibilityPlaceholder", "Add accessibility feature...")}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAccessibilityItem())}
                        />
                        <Button type="button" onClick={addAccessibilityItem} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(formState.accessibilityFeatures || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAccessibilityItem(index)}
                              className="h-auto p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Capacity Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      {tSync("admin.facilities.form.zones.features.capacity", "Capacity Information")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">
                          {tSync("admin.facilities.form.zones.features.maxCapacity", "Maximum Capacity")}
                        </Label>
                        <div className="text-2xl font-bold text-blue-600">{formState.capacity || 0}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              {tSync("admin.facilities.form.zones.cancel", "Cancel")}
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
            >
              {tSync("admin.facilities.form.zones.save", "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
