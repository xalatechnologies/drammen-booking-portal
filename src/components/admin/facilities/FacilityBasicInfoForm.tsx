
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Facility } from "@/types/facility";

interface FacilityBasicInfoFormProps {
  facility: Partial<Facility>;
  onUpdate: (updates: Partial<Facility>) => void;
  errors?: Record<string, string>;
}

const FacilityBasicInfoForm: React.FC<FacilityBasicInfoFormProps> = ({
  facility,
  onUpdate,
  errors = {}
}) => {
  const handleInputChange = (field: keyof Facility, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Grunnleggende informasjon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Navn *
            </Label>
            <Input
              id="name"
              value={facility.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Navn på fasiliteten"
              className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-base font-medium">
              Type *
            </Label>
            <Select value={facility.type || ""} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className={`h-12 text-base ${errors.type ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Velg type fasiliteter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sports_hall">Sporthall</SelectItem>
                <SelectItem value="gym">Treningsstudio</SelectItem>
                <SelectItem value="swimming_pool">Svømmehall</SelectItem>
                <SelectItem value="meeting_room">Møterom</SelectItem>
                <SelectItem value="classroom">Klasserom</SelectItem>
                <SelectItem value="auditorium">Auditorium</SelectItem>
                <SelectItem value="cultural_center">Kulturhus</SelectItem>
                <SelectItem value="outdoor_facility">Utendørs fasiliteter</SelectItem>
                <SelectItem value="other">Annet</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            Beskrivelse
          </Label>
          <Textarea
            id="description"
            value={facility.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Detaljert beskrivelse av fasiliteten..."
            rows={4}
            className="text-base resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-base font-medium">
              Kapasitet (personer) *
            </Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={facility.capacity || ""}
              onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
              placeholder="50"
              className={`h-12 text-base ${errors.capacity ? 'border-red-500' : ''}`}
            />
            {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_sqm" className="text-base font-medium">
              Areal (m²)
            </Label>
            <Input
              id="area_sqm"
              type="number"
              min="0"
              step="0.1"
              value={facility.area_sqm || ""}
              onChange={(e) => handleInputChange("area_sqm", parseFloat(e.target.value) || null)}
              placeholder="100"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerHour" className="text-base font-medium">
              Pris per time (NOK)
            </Label>
            <Input
              id="pricePerHour"
              type="number"
              min="0"
              step="0.01"
              value={facility.pricePerHour || ""}
              onChange={(e) => handleInputChange("pricePerHour", parseFloat(e.target.value) || 0)}
              placeholder="450"
              className="h-12 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="area" className="text-base font-medium">
              Område/Bydel *
            </Label>
            <Input
              id="area"
              value={facility.area || ""}
              onChange={(e) => handleInputChange("area", e.target.value)}
              placeholder="Sentrum, Strømsø, etc."
              className={`h-12 text-base ${errors.area ? 'border-red-500' : ''}`}
            />
            {errors.area && <p className="text-sm text-red-600">{errors.area}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-base font-medium">
              Status *
            </Label>
            <Select value={facility.status || "active"} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Velg status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="maintenance">Vedlikehold</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-base font-medium">
            Adresse *
          </Label>
          <Input
            id="address"
            value={facility.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Gate, postnummer, by"
            className={`h-12 text-base ${errors.address ? 'border-red-500' : ''}`}
          />
          {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityBasicInfoForm;
