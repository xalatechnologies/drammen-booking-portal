
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useFacility } from "@/hooks/useFacility";
import { Facility } from "@/types/facility";
import PageHeader from "@/components/admin/PageHeader";
import FacilityBasicInfoForm from "./FacilityBasicInfoForm";
import FacilityImageUpload from "./FacilityImageUpload";
import { OpeningHoursManagement } from "./OpeningHoursManagement";
import { ZoneManagementView } from "./ZoneManagementView";

interface FacilityFormViewProps {
  facilityId?: number;
  onBack: () => void;
}

export const FacilityFormView: React.FC<FacilityFormViewProps> = ({
  facilityId,
  onBack,
}) => {
  const { facility: existingFacility, isLoading } = useFacility(facilityId || 0);
  const [facility, setFacility] = useState<Partial<Facility>>({
    name: "",
    type: "",
    address: "",
    area: "",
    description: "",
    capacity: 1,
    area_sqm: null,
    pricePerHour: 450,
    status: "active",
    image: "",
    amenities: [],
    accessibility: [],
    equipment: [],
    hasAutoApproval: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!facilityId;

  // Load existing facility data
  useEffect(() => {
    if (existingFacility) {
      setFacility(existingFacility);
      setImages(existingFacility.image ? [existingFacility.image] : []);
    }
  }, [existingFacility]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!facility.name?.trim()) {
      newErrors.name = "Navn er påkrevd";
    }
    if (!facility.type) {
      newErrors.type = "Type er påkrevd";
    }
    if (!facility.address?.trim()) {
      newErrors.address = "Adresse er påkrevd";
    }
    if (!facility.area?.trim()) {
      newErrors.area = "Område er påkrevd";
    }
    if (!facility.capacity || facility.capacity < 1) {
      newErrors.capacity = "Kapasitet må være minst 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const facilityData = {
        ...facility,
        image: images[0] || null, // Use first image as main image
      };

      // TODO: Implement actual save logic here
      console.log("Saving facility:", facilityData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(isEditMode ? "Facilitet oppdatert!" : "Facilitet opprettet!");
      onBack();
    } catch (error) {
      console.error("Error saving facility:", error);
      alert("Feil ved lagring av facilitet");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) return;
    
    const confirmed = confirm("Er du sikker på at du vil slette denne fasiliteten?");
    if (!confirmed) return;

    try {
      // TODO: Implement actual delete logic here
      console.log("Deleting facility:", facilityId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert("Facilitet slettet!");
      onBack();
    } catch (error) {
      console.error("Error deleting facility:", error);
      alert("Feil ved sletting av facilitet");
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-lg text-gray-500">Laster facilitet...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader
        title={isEditMode ? `Rediger: ${facility.name}` : "Ny facilitet"}
        description={isEditMode ? "Oppdater fasilitets informasjon og innstillinger" : "Opprett en ny facilitet med all nødvendig informasjon"}
        actions={
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack} size="lg" className="text-base px-6 py-3">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tilbake
            </Button>
            {isEditMode && (
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                size="lg" 
                className="text-base px-6 py-3"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Slett
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              size="lg" 
              className="text-base px-6 py-3"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Lagrer..." : "Lagre"}
            </Button>
          </div>
        }
      />

      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-gray-50 rounded-none">
              <TabsTrigger value="basic" className="text-base py-3">
                Grunninfo
              </TabsTrigger>
              <TabsTrigger value="images" className="text-base py-3">
                Bilder
              </TabsTrigger>
              <TabsTrigger value="hours" className="text-base py-3">
                Åpningstider
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="basic" className="mt-0">
                <FacilityBasicInfoForm
                  facility={facility}
                  onUpdate={(updates) => setFacility(prev => ({ ...prev, ...updates }))}
                  errors={errors}
                />
              </TabsContent>

              <TabsContent value="images" className="mt-0">
                <FacilityImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={5}
                />
              </TabsContent>

              <TabsContent value="hours" className="mt-0">
                <OpeningHoursManagement
                  facilityId={facilityId}
                  openingHours={facility.openingHours || []}
                  onOpeningHoursChange={(hours) => setFacility(prev => ({ ...prev, openingHours: hours }))}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
