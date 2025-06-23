import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { ArrowLeft, Calendar, Edit, MapPin, Users, Clock, Tag, Info } from 'lucide-react';

interface FacilityDetailViewComponentProps {
  facility: Facility;
  onBack: () => void;
  onEdit: () => void;
  onCalendar: () => void;
}

const FacilityDetailViewComponent: React.FC<FacilityDetailViewComponentProps> = ({
  facility,
  onBack,
  onEdit,
  onCalendar
}) => {
  const { tSync } = useJsonTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {tSync('admin.common.back')}
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCalendar}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            {tSync('admin.facilities.detail.viewCalendar')}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onEdit}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            {tSync('admin.facilities.detail.edit')}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{facility.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{tSync('admin.facilities.detail.address')}</h3>
                    <p className="text-gray-600">{facility.address}</p>
                    <p className="text-gray-600">{facility.address_postal_code} {facility.address_city}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{tSync('admin.facilities.detail.description')}</h3>
                    <p className="text-gray-600">{facility.description || tSync('admin.facilities.detail.noDescription')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{tSync('admin.facilities.detail.capacity')}</h3>
                    <p className="text-gray-600">{facility.capacity} {tSync('admin.facilities.detail.people')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{tSync('admin.facilities.detail.type')}</h3>
                    <p className="text-gray-600">{facility.type}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{tSync('admin.facilities.detail.openingHours')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {facility.openingHours.map((hours, index) => {
                        const dayName = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'][hours.dayOfWeek];
                        return (
                          <div key={index} className="flex justify-between border-b pb-1">
                            <span>{dayName}</span>
                            <span>
                              {hours.is_closed ? 
                                tSync('admin.facilities.detail.closed') : 
                                `${hours.opens} - ${hours.closes}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {facility.zones && facility.zones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{tSync('admin.facilities.detail.zones')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facility.zones.map(zone => (
                    <div key={zone.id} className="border rounded-md p-4">
                      <h3 className="font-medium">{zone.name}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{tSync('admin.facilities.detail.capacity')}: {zone.capacity}</p>
                        {zone.description && <p className="mt-1">{zone.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tSync('admin.facilities.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{tSync('admin.facilities.detail.currentStatus')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    facility.status === 'active' ? 'bg-green-100 text-green-800' :
                    facility.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {facility.status === 'active' ? tSync('admin.facilities.status.active') :
                     facility.status === 'maintenance' ? tSync('admin.facilities.status.maintenance') :
                     tSync('admin.facilities.status.inactive')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{tSync('admin.facilities.detail.price')}</span>
                  <span className="font-medium">{facility.price_per_hour} kr/time</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{tSync('admin.facilities.detail.autoApproval')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    facility.has_auto_approval ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {facility.has_auto_approval ? 
                      tSync('admin.facilities.detail.enabled') : 
                      tSync('admin.facilities.detail.disabled')}
                  </span>
                </div>
                
                {facility.allowed_booking_types && (
                  <div>
                    <h3 className="text-gray-600 mb-2">{tSync('admin.facilities.detail.allowedBookingTypes')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {facility.allowed_booking_types.map((type, index) => (
                        <span 
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {facility.featuredImage && (
            <Card>
              <CardHeader>
                <CardTitle>{tSync('admin.facilities.detail.featuredImage')}</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={facility.featuredImage.image_url} 
                  alt={facility.featuredImage.alt_text || facility.name}
                  className="w-full h-auto rounded-md"
                />
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>{tSync('admin.facilities.detail.contact')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facility.contact_name && (
                  <div>
                    <h3 className="text-sm font-medium">{tSync('admin.facilities.detail.contactName')}</h3>
                    <p className="text-gray-600">{facility.contact_name}</p>
                  </div>
                )}
                
                {facility.contact_email && (
                  <div>
                    <h3 className="text-sm font-medium">{tSync('admin.facilities.detail.contactEmail')}</h3>
                    <p className="text-gray-600">{facility.contact_email}</p>
                  </div>
                )}
                
                {facility.contact_phone && (
                  <div>
                    <h3 className="text-sm font-medium">{tSync('admin.facilities.detail.contactPhone')}</h3>
                    <p className="text-gray-600">{facility.contact_phone}</p>
                  </div>
                )}
                
                {!facility.contact_name && !facility.contact_email && !facility.contact_phone && (
                  <p className="text-gray-500 italic">{tSync('admin.facilities.detail.noContactInfo')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailViewComponent;
