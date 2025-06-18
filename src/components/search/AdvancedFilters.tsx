
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, Clock, Zap, Wifi, Car, Camera } from "lucide-react";

interface AdvancedFiltersProps {
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  availableNow: boolean;
  setAvailableNow: (available: boolean) => void;
  hasEquipment: boolean;
  setHasEquipment: (has: boolean) => void;
  hasParking: boolean;
  setHasParking: (has: boolean) => void;
  hasWifi: boolean;
  setHasWifi: (has: boolean) => void;
  allowsPhotography: boolean;
  setAllowsPhotography: (allows: boolean) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  accessibility,
  setAccessibility,
  capacity,
  setCapacity,
  priceRange,
  setPriceRange,
  availableNow,
  setAvailableNow,
  hasEquipment,
  setHasEquipment,
  hasParking,
  setHasParking,
  hasWifi,
  setHasWifi,
  allowsPhotography,
  setAllowsPhotography,
}) => {
  return (
    <div className="space-y-8">
      {/* First Row - Capacity and Accessibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-slate-600" />
            <Label className="text-base font-semibold text-slate-800">
              Kapasitet: {capacity[0]} - {capacity[1]} personer
            </Label>
          </div>
          <Slider
            value={capacity}
            onValueChange={setCapacity}
            max={500}
            step={10}
            className="mt-3"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>0</span>
            <span>500+</span>
          </div>
        </div>

        {/* Accessibility */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-slate-800">Tilgjengelighet</Label>
          <Select value={accessibility || "all"} onValueChange={setAccessibility}>
            <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-500 text-base">
              <SelectValue placeholder="Tilgjengelighet (alle)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-base">Alle</SelectItem>
              <SelectItem value="wheelchair" className="text-base">Rullestoltilpasset</SelectItem>
              <SelectItem value="hearing-loop" className="text-base">Teleslynge</SelectItem>
              <SelectItem value="sign-language" className="text-base">Tegnspråktolking</SelectItem>
              <SelectItem value="visual-aids" className="text-base">Synshjelpemidler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Second Row - Price Range and Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-slate-800">
            Prisområde: {priceRange[0]} - {priceRange[1]} kr/time
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            step={100}
            className="mt-3"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>Gratis</span>
            <span>5000+ kr</span>
          </div>
        </div>

        {/* Quick Availability */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-base font-medium text-slate-800">Ledig nå</Label>
                <p className="text-sm text-slate-600">Vis kun lokaler som er tilgjengelige akkurat nå</p>
              </div>
            </div>
            <Switch
              checked={availableNow}
              onCheckedChange={setAvailableNow}
            />
          </div>
        </div>
      </div>

      {/* Third Row - Features and Amenities */}
      <div>
        <Label className="text-base font-semibold text-slate-800 mb-4 block">Fasiliteter og utstyr</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Equipment */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-base font-medium text-slate-800">AV-utstyr</Label>
                <p className="text-sm text-slate-600">Projektor, lyd, mikrofon</p>
              </div>
            </div>
            <Switch
              checked={hasEquipment}
              onCheckedChange={setHasEquipment}
            />
          </div>

          {/* Parking */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-slate-600" />
              <div>
                <Label className="text-base font-medium text-slate-800">Parkering</Label>
                <p className="text-sm text-slate-600">Tilgjengelig parkering</p>
              </div>
            </div>
            <Switch
              checked={hasParking}
              onCheckedChange={setHasParking}
            />
          </div>

          {/* WiFi */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Wifi className="h-5 w-5 text-purple-600" />
              <div>
                <Label className="text-base font-medium text-slate-800">WiFi</Label>
                <p className="text-sm text-slate-600">Gratis trådløst internett</p>
              </div>
            </div>
            <Switch
              checked={hasWifi}
              onCheckedChange={setHasWifi}
            />
          </div>

          {/* Photography */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Camera className="h-5 w-5 text-orange-600" />
              <div>
                <Label className="text-base font-medium text-slate-800">Fotografering</Label>
                <p className="text-sm text-slate-600">Tillater foto/video</p>
              </div>
            </div>
            <Switch
              checked={allowsPhotography}
              onCheckedChange={setAllowsPhotography}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
