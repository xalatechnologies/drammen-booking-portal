
import React from "react";
import { Phone, Mail, Clock, MapPin, FileText, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

interface FacilityContactInfoProps {
  facilityName: string;
  address: string;
  openingHours: string;
  capacity: number;
  area: string;
}

export function FacilityContactInfo({
  facilityName,
  address,
  openingHours,
  capacity,
  area
}: FacilityContactInfoProps) {
  const { language } = useLanguage();

  const translations = {
    NO: {
      contactInfo: "Kontaktinformasjon",
      facilityManager: "Anleggsansvarlig",
      openingHours: "Åpningstider",
      emergencyContact: "Nødkontakt",
      bookingPolicies: "Booking regler",
      cancellation: "Gratis avbestilling",
      cancellationPolicy: "opptil 24 timer før reservert tid",
      minBooking: "Minimum booking",
      maxBooking: "Maksimum booking",
      hours: "timer",
      quickFacts: "Hurtigfakta"
    },
    EN: {
      contactInfo: "Contact Information",
      facilityManager: "Facility Manager",
      openingHours: "Opening Hours",
      emergencyContact: "Emergency Contact",
      bookingPolicies: "Booking Policies",
      cancellation: "Free cancellation",
      cancellationPolicy: "up to 24 hours before reserved time",
      minBooking: "Minimum booking",
      maxBooking: "Maximum booking",
      hours: "hours",
      quickFacts: "Quick Facts"
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-4">
      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5" />
            {t.contactInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t.facilityManager}</span>
            </div>
            <p className="text-sm text-gray-900">Lars Hansen</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">lars.hansen@drammen.kommune.no</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">+47 32 04 70 00</span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t.openingHours}</span>
            </div>
            <p className="text-sm text-gray-900">{openingHours}</p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t.emergencyContact}</span>
            </div>
            <p className="text-sm text-gray-900">Drammen Kommune</p>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">+47 32 04 70 00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Facts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            {t.quickFacts}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Kapasitet</span>
            <span className="text-sm font-medium">{capacity} personer</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Areal</span>
            <span className="text-sm font-medium">{area}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-xs text-gray-600">{address}</span>
          </div>
        </CardContent>
      </Card>

      {/* Booking Policies */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            {t.bookingPolicies}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.minBooking}</span>
            <Badge variant="outline">2 {t.hours}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.maxBooking}</span>
            <Badge variant="outline">8 {t.hours}</Badge>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-green-800">
              <strong>{t.cancellation}</strong> {t.cancellationPolicy}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
