
import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface AutoApprovalCardProps {
  hasAutoApproval: boolean;
}

export function AutoApprovalCard({ hasAutoApproval }: AutoApprovalCardProps) {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      autoApproval: "Automatisk godkjenning",
      manualApproval: "Manuell godkjenning",
      autoDescription: "Reservasjonen godkjennes umiddelbart",
      manualDescription: "Reservasjonen må godkjennes manuelt"
    },
    EN: {
      autoApproval: "Automatic approval",
      manualApproval: "Manual approval",
      autoDescription: "Reservation is approved immediately",
      manualDescription: "Reservation requires manual approval"
    }
  };

  const t = translations[language];
  
  return (
    <Card className="shadow-md rounded-xl border-gray-100 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${hasAutoApproval ? 'bg-green-100' : 'bg-amber-100'}`}>
            {hasAutoApproval ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <Clock className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {hasAutoApproval ? t.autoApproval : t.manualApproval}
            </h3>
            <p className="text-base text-gray-600">
              {hasAutoApproval ? t.autoDescription : t.manualDescription}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
