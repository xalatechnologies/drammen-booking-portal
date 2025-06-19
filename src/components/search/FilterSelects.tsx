
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

  // Use the actual facility type values from the data
  const facilityTypeOptions = [
    { value: "all", label: t('forms.facilityTypes.all') },
    { value: "sports-center", label: t('forms.facilityTypes.sportsHall') },
    { value: "community-center", label: t('forms.facilityTypes.meetingRoom') },
    { value: "conference-center", label: t('forms.facilityTypes.conferenceRoom') },
    { value: "cultural-center", label: t('forms.facilityTypes.auditorium') },
    { value: "school", label: t('forms.facilityTypes.gym') }
  ];

  // Use the actual location values from the data
  const locationOptions = [
    { value: "all", label: t('forms.locations.all') },
    { value: "drammen-sentrum", label: t('forms.locations.drammenSentrum') },
    { value: "bragernes", label: t('forms.locations.bragernes') },
    { value: "stromsø", label: t('forms.locations.stromsø') },
    { value: "konnerud", label: t('forms.locations.konnerud') },
    { value: "åssiden", label: t('forms.locations.åssiden') }
  ];

  // Define accessibility mappings
  const accessibilityOptions = [
    { value: "all", label: t('forms.accessibility.all') },
    { value: "wheelchair", label: t('forms.accessibility.wheelchair') },
    { value: "hearing-loop", label: t('forms.accessibility.hearingLoop') },
    { value: "visual-aids", label: t('forms.accessibility.visualAids') }
  ];

  // Define capacity mappings
  const capacityOptions = [
    { value: "0-20", label: t('forms.capacity.range1') },
    { value: "20-50", label: t('forms.capacity.range2') },
    { value: "50-100", label: t('forms.capacity.range3') },
    { value: "100-200", label: t('forms.capacity.range4') },
    { value: "200-500", label: t('forms.capacity.range5') }
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
                  {option.label}
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
                  {option.label}
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
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder={t('search.labels.facilityType')} />
        </SelectTrigger>
        <SelectContent>
          {facilityTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-lg">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Location */}
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder={t('search.labels.location')} />
        </SelectTrigger>
        <SelectContent>
          {locationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-lg">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Accessibility */}
      <Select value={accessibility} onValueChange={setAccessibility}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder={t('search.labels.accessibility')} />
        </SelectTrigger>
        <SelectContent>
          {accessibilityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-lg">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Capacity */}
      <Select value={`${capacity[0]}-${capacity[1]}`} onValueChange={(value) => {
        const [min, max] = value.split("-").map(Number);
        setCapacity([min, max]);
      }}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder={t('search.labels.capacity')} />
        </SelectTrigger>
        <SelectContent>
          {capacityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-lg">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelects;
