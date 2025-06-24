
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, User, Globe } from "lucide-react";

interface FacilityBasicInfoProps {
  facility: any;
}

export const FacilityBasicInfo: React.FC<FacilityBasicInfoProps> = ({ facility }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Facility Type</label>
            <p className="text-base">{facility.type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Area/Location</label>
            <p className="text-base">{facility.area}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-base text-gray-700">{facility.description || 'No description provided'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Capacity</label>
              <p className="text-base">{facility.capacity} people</p>
            </div>
            {facility.area_sqm && (
              <div>
                <label className="text-sm font-medium text-gray-600">Area</label>
                <p className="text-base">{facility.area_sqm} m²</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-base">{facility.address_street}</p>
              <p className="text-sm text-gray-600">{facility.address_postal_code} {facility.address_city}</p>
              <p className="text-sm text-gray-600">{facility.address_country}</p>
            </div>
          </div>
          
          {facility.contact_name && (
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <p className="text-base">{facility.contact_name}</p>
            </div>
          )}
          
          {facility.contact_email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <p className="text-base">{facility.contact_email}</p>
            </div>
          )}
          
          {facility.contact_phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <p className="text-base">{facility.contact_phone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features & Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          {facility.equipment && facility.equipment.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {facility.equipment.map((item: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No equipment listed</p>
          )}
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          {facility.amenities && facility.amenities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {facility.amenities.map((amenity: string, index: number) => (
                <Badge key={index} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No amenities listed</p>
          )}
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      {facility.accessibility_features && facility.accessibility_features.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {facility.accessibility_features.map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
