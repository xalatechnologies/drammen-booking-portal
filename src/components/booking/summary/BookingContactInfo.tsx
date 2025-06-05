
import React from "react";
import { Mail, Phone, User, Building } from "lucide-react";

interface BookingContactInfoProps {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
}

export function BookingContactInfo({ 
  contactName, 
  contactEmail, 
  contactPhone, 
  organization 
}: BookingContactInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-green-50 p-2 rounded-md text-green-600">
          <User className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Kontaktperson</p>
          <p className="font-medium">{contactName}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="bg-green-50 p-2 rounded-md text-green-600">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">E-post</p>
          <p className="font-medium">{contactEmail}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="bg-green-50 p-2 rounded-md text-green-600">
          <Phone className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Telefon</p>
          <p className="font-medium">{contactPhone}</p>
        </div>
      </div>
      
      {organization && (
        <div className="flex items-start gap-3">
          <div className="bg-green-50 p-2 rounded-md text-green-600">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Organisasjon</p>
            <p className="font-medium">{organization}</p>
          </div>
        </div>
      )}
    </div>
  );
}
