
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
              <SelectItem value="all" className="text-lg">{t('forms.facilityTypes.all')}</SelectItem>
              <SelectItem value="sports-hall" className="text-lg">{t('forms.facilityTypes.sportsHall')}</SelectItem>
              <SelectItem value="meeting-room" className="text-lg">{t('forms.facilityTypes.meetingRoom')}</SelectItem>
              <SelectItem value="conference-room" className="text-lg">{t('forms.facilityTypes.conferenceRoom')}</SelectItem>
              <SelectItem value="auditorium" className="text-lg">{t('forms.facilityTypes.auditorium')}</SelectItem>
              <SelectItem value="gym" className="text-lg">{t('forms.facilityTypes.gym')}</SelectItem>
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
              <SelectItem value="all" className="text-lg">{t('forms.locations.all')}</SelectItem>
              <SelectItem value="drammen-sentrum" className="text-lg">{t('forms.locations.drammenSentrum')}</SelectItem>
              <SelectItem value="bragernes" className="text-lg">{t('forms.locations.bragernes')}</SelectItem>
              <SelectItem value="stromsø" className="text-lg">{t('forms.locations.stromsø')}</SelectItem>
              <SelectItem value="konnerud" className="text-lg">{t('forms.locations.konnerud')}</SelectItem>
              <SelectItem value="åssiden" className="text-lg">{t('forms.locations.åssiden')}</SelectItem>
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
          <SelectItem value="all" className="text-lg">{t('forms.facilityTypes.all')}</SelectItem>
          <SelectItem value="sports-hall" className="text-lg">{t('forms.facilityTypes.sportsHall')}</SelectItem>
          <SelectItem value="meeting-room" className="text-lg">{t('forms.facilityTypes.meetingRoom')}</SelectItem>
          <SelectItem value="conference-room" className="text-lg">{t('forms.facilityTypes.conferenceRoom')}</SelectItem>
          <SelectItem value="auditorium" className="text-lg">{t('forms.facilityTypes.auditorium')}</SelectItem>
          <SelectItem value="gym" className="text-lg">{t('forms.facilityTypes.gym')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Location */}
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder={t('search.labels.location')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-lg">{t('forms.locations.all')}</SelectItem>
          <SelectItem value="drammen-sentrum" className="text-lg">{t('forms.locations.drammenSentrum')}</SelectItem>
          <SelectItem value="bragernes" className="text-lg">{t('forms.locations.bragernes')}</SelectItem>
          <SelectItem value="stromsø" className="text-lg">{t('forms.locations.stromsø')}</SelectItem>
          <SelectItem value="konnerud" className="text-lg">{t('forms.locations.konnerud')}</SelectItem>
          <SelectItem value="åssiden" className="text-lg">{t('forms.locations.åssiden')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Accessibility */}
      <Select value={accessibility} onValueChange={setAccessibility}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder={t('search.labels.accessibility')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-lg">{t('forms.accessibility.all')}</SelectItem>
          <SelectItem value="wheelchair" className="text-lg">{t('forms.accessibility.wheelchair')}</SelectItem>
          <SelectItem value="hearing-loop" className="text-lg">{t('forms.accessibility.hearingLoop')}</SelectItem>
          <SelectItem value="visual-aids" className="text-lg">{t('forms.accessibility.visualAids')}</SelectItem>
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
          <SelectItem value="0-20" className="text-lg">{t('forms.capacity.range1')}</SelectItem>
          <SelectItem value="20-50" className="text-lg">{t('forms.capacity.range2')}</SelectItem>
          <SelectItem value="50-100" className="text-lg">{t('forms.capacity.range3')}</SelectItem>
          <SelectItem value="100-200" className="text-lg">{t('forms.capacity.range4')}</SelectItem>
          <SelectItem value="200-500" className="text-lg">{t('forms.capacity.range5')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelects;
