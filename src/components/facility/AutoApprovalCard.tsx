
import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AutoApprovalCardProps {
  hasAutoApproval: boolean;
}

export function AutoApprovalCard({ hasAutoApproval }: AutoApprovalCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${hasAutoApproval ? 'bg-green-100' : 'bg-amber-100'}`}>
            {hasAutoApproval ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Clock className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium">
              {hasAutoApproval ? "Automatisk godkjenning" : "Manuell godkjenning"}
            </h3>
            <p className="text-sm text-gray-600">
              {hasAutoApproval 
                ? "Reservasjonen godkjennes umiddelbart"
                : "Reservasjonen må godkjennes manuelt"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
