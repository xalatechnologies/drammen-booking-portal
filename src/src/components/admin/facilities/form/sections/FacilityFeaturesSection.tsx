
import React, { forwardRef, useImperativeHandle } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Wrench, Star, Users } from "lucide-react";
import { FacilityFormData } from "../FacilityFormSchema";

interface FacilityFeaturesSectionProps {
  form: UseFormReturn<FacilityFormData>;
  equipment: string[];
  amenities: string[];
  capacity: number;
}

export interface FacilityFeaturesSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityFeaturesSection = forwardRef<FacilityFeaturesSectionRef, FacilityFeaturesSectionProps>(({
  form,
  equipment,
  amenities,
  capacity
}, ref) => {
  const { setValue, watch } = form;

  // Remove the problematic "id" watch and use proper form field names
  const currentEquipment = watch("equipment") || [];
  const currentAmenities = watch("amenities") || [];
  const currentAccessibilityFeatures = watch("accessibility_features") || [];

  useImperativeHandle(ref, () => ({
    saveData: async () => {
      // Features are saved as part of the main form, so always return true
      console.log('Features section data will be saved with main form');
      return true;
    }
  }));

  const [newEquipmentItem, setNewEquipmentItem] = React.useState("");
  const [newAmenityItem, setNewAmenityItem] = React.useState("");
  const [newAccessibilityItem, setNewAccessibilityItem] = React.useState("");

  const addEquipmentItem = () => {
    if (newEquipmentItem.trim()) {
      setValue("equipment", [...currentEquipment, newEquipmentItem.trim()]);
      setNewEquipmentItem("");
    }
  };

  const removeEquipmentItem = (index: number) => {
    const updated = currentEquipment.filter((_, i) => i !== index);
    setValue("equipment", updated);
  };

  const addAmenityItem = () => {
    if (newAmenityItem.trim()) {
      setValue("amenities", [...currentAmenities, newAmenityItem.trim()]);
      setNewAmenityItem("");
    }
  };

  const removeAmenityItem = (index: number) => {
    const updated = currentAmenities.filter((_, i) => i !== index);
    setValue("amenities", updated);
  };

  const addAccessibilityItem = () => {
    if (newAccessibilityItem.trim()) {
      setValue("accessibility_features", [...currentAccessibilityFeatures, newAccessibilityItem.trim()]);
      setNewAccessibilityItem("");
    }
  };

  const removeAccessibilityItem = (index: number) => {
    const updated = currentAccessibilityFeatures.filter((_, i) => i !== index);
    setValue("accessibility_features", updated);
  };

  return (
    <div className="space-y-6">
      {/* Equipment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newEquipmentItem}
                onChange={(e) => setNewEquipmentItem(e.target.value)}
                placeholder="Add equipment item..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipmentItem())}
              />
              <Button type="button" onClick={addEquipmentItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentEquipment.map((item, index) => (
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
            Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAmenityItem}
                onChange={(e) => setNewAmenityItem(e.target.value)}
                placeholder="Add amenity..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenityItem())}
              />
              <Button type="button" onClick={addAmenityItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentAmenities.map((item, index) => (
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
            Accessibility Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAccessibilityItem}
                onChange={(e) => setNewAccessibilityItem(e.target.value)}
                placeholder="Add accessibility feature..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAccessibilityItem())}
              />
              <Button type="button" onClick={addAccessibilityItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentAccessibilityFeatures.map((item, index) => (
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
            Capacity Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-base font-medium">Maximum Capacity</Label>
              <div className="text-2xl font-bold text-blue-600">{capacity || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

FacilityFeaturesSection.displayName = "FacilityFeaturesSection";
