
import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { useFacilityStore } from "@/stores/useFacilityStore";
import { toast } from "@/hooks/use-toast";
import { 
  Star, 
  Users, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Music, 
  Camera, 
  Lightbulb,
  Dumbbell,
  Goal,
  Volleyball,
  Speaker,
  UserCheck,
  Eye,
  ArrowUp,
  Bath,
  Shield,
  Lock,
  Plus,
  X
} from "lucide-react";

interface FacilityFeaturesSectionProps {
  form: UseFormReturn<FacilityFormData>;
  equipment?: string[];
  amenities?: string[];
  capacity?: number;
}

interface FacilityFeaturesSectionRef {
  saveData: () => Promise<boolean>;
}

const EQUIPMENT_OPTIONS = [
  { value: 'fotballmål', label: 'Football Goals', icon: <Goal className="w-4 h-4" /> },
  { value: 'volleyballnett', label: 'Volleyball Net', icon: <Volleyball className="w-4 h-4" /> },
  { value: 'basketkurv', label: 'Basketball Hoop', icon: <Goal className="w-4 h-4" /> },
  { value: 'treningsutstyr', label: 'Training Equipment', icon: <Dumbbell className="w-4 h-4" /> },
  { value: 'lydanlegg', label: 'Sound System', icon: <Speaker className="w-4 h-4" /> },
  { value: 'projektor', label: 'Projector', icon: <Camera className="w-4 h-4" /> },
  { value: 'lys', label: 'Professional Lighting', icon: <Lightbulb className="w-4 h-4" /> },
  { value: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
  { value: 'kjøkken', label: 'Kitchen', icon: <Utensils className="w-4 h-4" /> }
];

const AMENITY_OPTIONS = [
  { value: 'garderober', label: 'Changing Rooms', icon: <Bath className="w-4 h-4" /> },
  { value: 'parkering', label: 'Parking', icon: <Car className="w-4 h-4" /> },
  { value: 'kafeteria', label: 'Cafeteria', icon: <Coffee className="w-4 h-4" /> },
  { value: 'tilskuerplasser', label: 'Spectator Seats', icon: <Users className="w-4 h-4" /> },
  { value: 'garderober_med_dus', label: 'Showers', icon: <Bath className="w-4 h-4" /> },
  { value: 'oppbevaring', label: 'Storage/Lockers', icon: <Lock className="w-4 h-4" /> },
  { value: 'sikkerhet', label: 'Security System', icon: <Shield className="w-4 h-4" /> },
  { value: 'musikkanlegg', label: 'Music System', icon: <Music className="w-4 h-4" /> }
];

const ACCESSIBILITY_OPTIONS = [
  { value: 'wheelchair', label: 'Wheelchair Access', icon: <UserCheck className="w-4 h-4" /> },
  { value: 'elevator', label: 'Elevator Access', icon: <ArrowUp className="w-4 h-4" /> },
  { value: 'visual_aids', label: 'Visual Aids', icon: <Eye className="w-4 h-4" /> },
  { value: 'accessible_parking', label: 'Accessible Parking', icon: <Car className="w-4 h-4" /> },
  { value: 'accessible_restrooms', label: 'Accessible Restrooms', icon: <Bath className="w-4 h-4" /> }
];

export const FacilityFeaturesSection = forwardRef<FacilityFeaturesSectionRef, FacilityFeaturesSectionProps>(({ 
  form, 
  equipment = [], 
  amenities = [], 
  capacity = 1 
}, ref) => {
  const { tSync } = useTranslation();
  const { updateFacility } = useFacilityStore();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(equipment);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(amenities);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);

  // Initialize from form data
  useEffect(() => {
    const formEquipment = form.watch('equipment');
    const formAmenities = form.watch('amenities');
    const formAccessibility = form.watch('accessibility_features');

    if (formEquipment) setSelectedEquipment(formEquipment);
    if (formAmenities) setSelectedAmenities(formAmenities);
    if (formAccessibility) setSelectedAccessibility(formAccessibility);
  }, [form]);

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      console.log('Saving facility features:', {
        equipment: selectedEquipment,
        amenities: selectedAmenities,
        accessibility: selectedAccessibility,
        capacity: form.watch('capacity')
      });
      
      try {
        // Update form values
        form.setValue('equipment', selectedEquipment);
        form.setValue('amenities', selectedAmenities);
        form.setValue('accessibility_features', selectedAccessibility);
        
        // Update store if we have current facility
        const facilityId = form.watch('id');
        if (facilityId) {
          updateFacility(facilityId.toString(), {
            equipment: selectedEquipment,
            amenities: selectedAmenities,
            accessibility_features: selectedAccessibility,
            capacity: form.watch('capacity'),
            area_sqm: form.watch('area_sqm')
          });
        }

        toast({
          title: "Success",
          description: "Facility features updated successfully",
        });
        
        return true;
      } catch (error) {
        console.error('Failed to save facility features:', error);
        toast({
          title: "Error",
          description: "Failed to save facility features",
          variant: "destructive",
        });
        return false;
      }
    }
  }), [selectedEquipment, selectedAmenities, selectedAccessibility, form, updateFacility]);

  const toggleSelection = (item: string, currentList: string[], setList: (list: string[]) => void) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const addCustomItem = (type: 'equipment' | 'amenities') => {
    const customValue = prompt(`Add custom ${type === 'equipment' ? 'equipment' : 'amenity'}:`);
    if (customValue && customValue.trim()) {
      if (type === 'equipment') {
        setSelectedEquipment([...selectedEquipment, customValue.trim()]);
      } else {
        setSelectedAmenities([...selectedAmenities, customValue.trim()]);
      }
    }
  };

  const removeCustomItem = (item: string, type: 'equipment' | 'amenities') => {
    if (type === 'equipment') {
      setSelectedEquipment(selectedEquipment.filter(i => i !== item));
    } else {
      setSelectedAmenities(selectedAmenities.filter(i => i !== item));
    }
  };

  const getCustomItems = (type: 'equipment' | 'amenities') => {
    const predefinedOptions = type === 'equipment' ? EQUIPMENT_OPTIONS : AMENITY_OPTIONS;
    const selectedList = type === 'equipment' ? selectedEquipment : selectedAmenities;
    const predefinedValues = predefinedOptions.map(opt => opt.value);
    return selectedList.filter(item => !predefinedValues.includes(item));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="w-5 h-5" />
          {tSync("admin.facilities.form.features.title", "Facility Features & Amenities")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={["basic-info", "equipment"]} className="space-y-4">
          
          {/* Basic Information */}
          <AccordionItem value="basic-info" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Basic Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="area_sqm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="200"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Equipment */}
          <AccordionItem value="equipment" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                <span className="font-medium">Equipment & Sports Facilities</span>
                <Badge variant="outline" className="ml-auto mr-8">
                  {selectedEquipment.length} selected
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {EQUIPMENT_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedEquipment.includes(option.value) ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2 text-sm"
                      onClick={() => toggleSelection(option.value, selectedEquipment, setSelectedEquipment)}
                    >
                      {option.icon}
                      <span className="text-center">{option.label}</span>
                    </Button>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 text-sm border-dashed"
                    onClick={() => addCustomItem('equipment')}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom</span>
                  </Button>
                </div>

                {/* Custom Equipment */}
                {getCustomItems('equipment').length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Custom Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {getCustomItems('equipment').map((item) => (
                        <Badge key={item} variant="secondary" className="gap-1">
                          {item}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeCustomItem(item, 'equipment')}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Amenities */}
          <AccordionItem value="amenities" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                <span className="font-medium">Amenities & Services</span>
                <Badge variant="outline" className="ml-auto mr-8">
                  {selectedAmenities.length} selected
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITY_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedAmenities.includes(option.value) ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2 text-sm"
                      onClick={() => toggleSelection(option.value, selectedAmenities, setSelectedAmenities)}
                    >
                      {option.icon}
                      <span className="text-center">{option.label}</span>
                    </Button>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 text-sm border-dashed"
                    onClick={() => addCustomItem('amenities')}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom</span>
                  </Button>
                </div>

                {/* Custom Amenities */}
                {getCustomItems('amenities').length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Custom Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {getCustomItems('amenities').map((item) => (
                        <Badge key={item} variant="secondary" className="gap-1">
                          {item}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeCustomItem(item, 'amenities')}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accessibility */}
          <AccordionItem value="accessibility" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span className="font-medium">Accessibility Features</span>
                <Badge variant="outline" className="ml-auto mr-8">
                  {selectedAccessibility.length} selected
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ACCESSIBILITY_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={selectedAccessibility.includes(option.value) ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center gap-2 text-sm"
                    onClick={() => toggleSelection(option.value, selectedAccessibility, setSelectedAccessibility)}
                  >
                    {option.icon}
                    <span className="text-center">{option.label}</span>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
});

FacilityFeaturesSection.displayName = "FacilityFeaturesSection";
