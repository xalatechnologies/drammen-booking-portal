
import React from "react";
import { Mail, Phone, User, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      contactPerson: "Kontaktperson",
      email: "E-post",
      phone: "Telefon",
      organization: "Organisasjon"
    },
    EN: {
      contactPerson: "Contact person",
      email: "Email",
      phone: "Phone",
      organization: "Organization"
    }
  };

  const t = translations[language];
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-green-50 p-2 rounded-md text-green-600">
          <User className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t.contactPerson}</p>
          <p className="font-medium">{contactName}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="bg-green-50 p-2 rounded-md text-green-600">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t.email}</p>
          <p className="font-medium">{contactEmail}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="bg-green-50 p-2 rounded-md text-green-600">
          <Phone className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t.phone}</p>
          <p className="font-medium">{contactPhone}</p>
        </div>
      </div>
      
      {organization && (
        <div className="flex items-start gap-3">
          <div className="bg-green-50 p-2 rounded-md text-green-600">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t.organization}</p>
            <p className="font-medium">{organization}</p>
          </div>
        </div>
      )}
    </div>
  );
}
