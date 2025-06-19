
import React from "react";
import { Projector, Volume2, FileText, ChefHat, Car, Wifi, Snowflake, Accessibility, Users, MapPin } from "lucide-react";

interface FlatAmenitiesGridProps {
  items: string[];
  title?: string;
  showAll?: boolean;
  maxItems?: number;
  iconType?: 'amenities' | 'activities';
}

export function FlatAmenitiesGrid({ 
  items, 
  title, 
  showAll = false, 
  maxItems = 6,
  iconType = 'amenities'
}: FlatAmenitiesGridProps) {
  
  const amenityIcons: { [key: string]: React.ElementType } = {
    'projektor': Projector,
    'projector': Projector,
    'lydanlegg': Volume2,
    'sound system': Volume2,
    'whiteboard': FileText,
    'kjøkken': ChefHat,
    'kitchen': ChefHat,
    'parkering': Car,
    'parking': Car,
    'wifi': Wifi,
    'klimaanlegg': Snowflake,
    'air conditioning': Snowflake,
    'rullestolvennlig': Accessibility,
    'wheelchair accessible': Accessibility,
  };

  const activityIcons: { [key: string]: React.ElementType } = {
    'idrett': Users,
    'sport': Users,
    'trening': Users,
    'training': Users,
    'arrangementer': MapPin,
    'events': MapPin,
    'grupper': Users,
    'groups': Users,
    'møter': FileText,
    'meetings': FileText,
  };

  const iconMap = iconType === 'amenities' ? amenityIcons : activityIcons;
  const displayItems = showAll ? items : items.slice(0, maxItems);
  
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {displayItems.map((item, index) => {
          const IconComponent = iconMap[item.toLowerCase()] || FileText;
          
          return (
            <div key={index} className="flex items-center gap-3 text-gray-700">
              <div className="w-6 h-6 flex items-center justify-center">
                <IconComponent className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-sm font-medium">{item}</span>
            </div>
          );
        })}
      </div>
      
      {!showAll && items.length > maxItems && (
        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium underline">
          Show all {items.length} {iconType === 'amenities' ? 'amenities' : 'activities'}
        </button>
      )}
    </div>
  );
}
