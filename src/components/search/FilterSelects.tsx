
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface FilterSelectsProps {
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
  showOnlyMain?: boolean;
}

const FilterSelects: React.FC<FilterSelectsProps> = ({
  facilityType,
  setFacilityType,
  location,
  setLocation,
  accessibility,
  setAccessibility,
  capacity,
  setCapacity,
  showOnlyMain = false,
}) => {
  const { t } = useTranslation();

  // Define consistent facility type mappings that match database values
  const facilityTypeOptions = [
    { value: "all", labelKey: "search.placeholders.allTypes" },
    { value: "gymsal", labelKey: "forms.facilityTypes.sportsHall" },
    { value: "møterom", labelKey: "forms.facilityTypes.meetingRoom" },
    { value: "konferanserom", labelKey: "forms.facilityTypes.conferenceRoom" },
    { value: "auditorium", labelKey: "forms.facilityTypes.auditorium" },
    { value: "treningssenter", labelKey: "forms.facilityTypes.gym" },
  ];

  // Define location mappings that match database values
  const locationOptions = [
    { value: "all", labelKey: "search.placeholders.allLocations" },
    { value: "drammen-sentrum", labelKey: "forms.locations.drammenSentrum" },
    { value: "bragernes", labelKey: "forms.locations.bragernes" },
    { value: "stromsø", labelKey: "forms.locations.stromsø" },
    { value: "konnerud", labelKey: "forms.locations.konnerud" },
    { value: "åssiden", labelKey: "forms.locations.åssiden" },
  ];

  if (showOnlyMain) {
    return (
      <div className="flex gap-4">
        {/* Facility Type */}
        <div className="flex-1 relative">
          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <Select value={facilityType} onValueChange={setFacilityType}>
            <SelectTrigger className="w-full h-14 pl-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 text-lg font-medium rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder={t('search.labels.facilityType')} />
            </SelectTrigger>
            <SelectContent>
              {facilityTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-lg">
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full h-14 pl-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 text-lg font-medium rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder={t('search.labels.location')} />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-lg">
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Facility Type */}
      <Select value={facilityType} onValueChange={setFacilityType}>
        <SelectTrigger className="w-full h-12 border-gray-300 focus:border-gray-900">
          <SelectValue placeholder={t('search.labels.facilityType')} />
        </SelectTrigger>
        <SelectContent>
          {facilityTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Location */}
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full h-12 border-gray-300 focus:border-gray-900">
          <SelectValue placeholder={t('search.labels.location')} />
        </SelectTrigger>
        <SelectContent>
          {locationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Accessibility */}
      <Select value={accessibility} onValueChange={setAccessibility}>
        <SelectTrigger className="w-full h-12 border-gray-300 focus:border-gray-900">
          <SelectValue placeholder={t('search.labels.accessibility')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('search.placeholders.anyAccessibility')}</SelectItem>
          <SelectItem value="wheelchair">{t('search.filters.wheelchairAccessible')}</SelectItem>
          <SelectItem value="hearing-loop">{t('search.filters.hearingLoop')}</SelectItem>
          <SelectItem value="visual-guidance">{t('search.filters.visualGuidance')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Capacity */}
      <Select value={`${capacity[0]}-${capacity[1]}`} onValueChange={(value) => {
        const [min, max] = value.split("-").map(Number);
        setCapacity([min, max]);
      }}>
        <SelectTrigger className="w-full h-12 border-gray-300 focus:border-gray-900">
          <SelectValue placeholder={t('search.labels.capacity')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-20">0-20 {t('common.labels.people', {}, 'personer')}</SelectItem>
          <SelectItem value="20-50">20-50 {t('common.labels.people', {}, 'personer')}</SelectItem>
          <SelectItem value="50-100">50-100 {t('common.labels.people', {}, 'personer')}</SelectItem>
          <SelectItem value="100-200">100-200 {t('common.labels.people', {}, 'personer')}</SelectItem>
          <SelectItem value="200-500">200+ {t('common.labels.people', {}, 'personer')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelects;
