
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from '@/i18n';

export function EnhancedRulesTab() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('facility.rules.bookingRules')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Minimum booking: 2 timer</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Maksimum booking: 8 timer</span>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Avbestilling: 48 timer før</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            {t('facility.rules.restrictions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="outline" className="bg-red-50 text-red-700">Ikke røyking</Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700">Ikke alkohol</Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Rydde etter bruk</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
