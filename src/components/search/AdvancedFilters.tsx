
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/i18n/hooks/useTranslation";

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
  const { t, formatCurrency } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Accessibility */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-900">
          {t('search.labels.accessibility')}
        </Label>
        <Select value={accessibility} onValueChange={setAccessibility}>
          <SelectTrigger className="h-12 border-slate-300 focus:border-slate-500">
            <SelectValue placeholder={t('search.placeholders.anyAccessibility')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.placeholders.anyAccessibility')}</SelectItem>
            <SelectItem value="wheelchair">{t('search.filters.wheelchairAccessible')}</SelectItem>
            <SelectItem value="hearing-loop">{t('search.filters.hearingLoop')}</SelectItem>
            <SelectItem value="visual-guidance">{t('search.filters.visualGuidance')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Capacity Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-900">
          {t('search.labels.capacity')}: {capacity[0]}-{capacity[1]} {t('common.labels.people', {}, 'personer')}
        </Label>
        <div className="px-3">
          <Slider
            value={capacity}
            onValueChange={setCapacity}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-900">
          {t('search.labels.priceRange')}: {formatCurrency(priceRange[0])}-{formatCurrency(priceRange[1])}
        </Label>
        <div className="px-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Availability */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">
          {t('search.labels.quickFilters', {}, 'Hurtigfiltre')}
        </Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="available-now" 
              checked={availableNow} 
              onCheckedChange={setAvailableNow}
              className="border-slate-300"
            />
            <Label htmlFor="available-now" className="text-sm font-medium cursor-pointer">
              {t('search.filters.availableNow')}
            </Label>
          </div>
        </div>
      </div>

      {/* Equipment & Amenities */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">
          {t('search.labels.equipment', {}, 'Utstyr og Lokaler')}
        </Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="has-equipment" 
              checked={hasEquipment} 
              onCheckedChange={setHasEquipment}
              className="border-slate-300"
            />
            <Label htmlFor="has-equipment" className="text-sm font-medium cursor-pointer">
              {t('search.filters.hasEquipment')}
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="has-parking" 
              checked={hasParking} 
              onCheckedChange={setHasParking}
              className="border-slate-300"
            />
            <Label htmlFor="has-parking" className="text-sm font-medium cursor-pointer">
              {t('search.filters.hasParking')}
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="has-wifi" 
              checked={hasWifi} 
              onCheckedChange={setHasWifi}
              className="border-slate-300"
            />
            <Label htmlFor="has-wifi" className="text-sm font-medium cursor-pointer">
              {t('search.filters.hasWifi')}
            </Label>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">
          {t('search.labels.policies', {}, 'Retningslinjer')}
        </Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="allows-photography" 
              checked={allowsPhotography} 
              onCheckedChange={setAllowsPhotography}
              className="border-slate-300"
            />
            <Label htmlFor="allows-photography" className="text-sm font-medium cursor-pointer">
              {t('search.filters.allowsPhotography')}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
