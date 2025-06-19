
import React from "react";
import { MapPin, Users, Clock, CheckCircle, Tag, Shield, Phone, Mail, MapIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/components/booking/types";
import { useTranslation } from "@/i18n";
import { FacilityLocation } from "../FacilityLocation";

interface EnhancedAboutTabProps {
  description: string;
  capacity: number;
  address: string;
  openingHours: string;
  area: string;
  zones: Zone[];
  hasAutoApproval: boolean;
  amenities: string[];
}

export function EnhancedAboutTab({
  description,
  capacity,
  address,
  openingHours,
  area,
  zones,
  hasAutoApproval,
  amenities
}: EnhancedAboutTabProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Beskrivelse</h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Key Information Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Nøkkelinformasjon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Kapasitet</p>
                  <p className="text-lg font-bold text-blue-800">{capacity} personer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Areal</p>
                  <p className="text-lg font-bold text-green-800">{area}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Åpningstider</p>
                  <p className="text-lg font-bold text-purple-800">{openingHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Soner</p>
                  <p className="text-lg font-bold text-emerald-800">{zones.length} tilgjengelige</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Auto Approval Status */}
      {hasAutoApproval && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 text-lg">Automatisk godkjenning</h4>
                <p className="text-sm text-green-700">Reservasjonen blir godkjent automatisk. Du trenger ikke å vente på bekreftelse.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zones Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Tilgjengelige soner</h3>
        <div className="space-y-4">
          {zones.map((zone) => (
            <Card key={zone.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg text-gray-900">{zone.name}</h4>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">
                    {zone.pricePerHour} kr/time
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4">{zone.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-gray-50">
                    <Users className="h-3 w-3 mr-1" />
                    {zone.capacity} personer
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    <MapIcon className="h-3 w-3 mr-1" />
                    {zone.area}
                  </Badge>
                </div>
                
                {zone.equipment && zone.equipment.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Utstyr:</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Suitable For */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Egnet for
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
            Idrett
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium">
            Trening
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2 text-sm font-medium">
            Arrangementer
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-4 py-2 text-sm font-medium">
            Grupper
          </Badge>
        </div>
      </div>

      {/* Location Map */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Lokasjon
        </h3>
        <div className="h-64 rounded-lg overflow-hidden border shadow-sm">
          <FacilityLocation address={address} />
        </div>
        <p className="text-sm text-gray-600 mt-2">{address}</p>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Kontaktinformasjon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">E-post</p>
              <p className="font-medium">booking@drammen.kommune.no</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Phone className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefon</p>
              <p className="font-medium">32 04 70 00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-green-800 mb-2">Avbestillingsregler</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Gratis avbestilling opptil 24 timer før reservert tid</li>
            <li>• Ved avbestilling mindre enn 24 timer før vil 50% av beløpet bli belastet</li>
            <li>• Ved utebliven reservasjon blir hele beløpet belastet</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
