
import React from "react";
import { Phone, Mail, Clock, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      hours: "timer"
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
      hours: "hours"
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-4">
      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Phone className="h-6 w-6" />
            {t.contactInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-base font-medium text-gray-700">{t.facilityManager}</span>
            </div>
            <p className="text-base text-gray-900">Lars Hansen</p>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">lars.hansen@drammen.kommune.no</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">+47 32 04 70 00</span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-base font-medium text-gray-700">{t.openingHours}</span>
            </div>
            <p className="text-base text-gray-900">{openingHours}</p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <span className="text-base font-medium text-gray-700">{t.emergencyContact}</span>
            </div>
            <p className="text-base text-gray-900">Drammen Kommune</p>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">+47 32 04 70 00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Policies - removed Quick Facts card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6" />
            {t.bookingPolicies}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>{t.cancellation}</strong> {t.cancellationPolicy}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
