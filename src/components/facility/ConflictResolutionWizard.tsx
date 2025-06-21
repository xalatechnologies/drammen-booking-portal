
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';

interface ConflictResolutionWizardProps {
  conflictData: any;
  onResolve: () => void;
  onCancel: () => void;
}

export function ConflictResolutionWizard({ conflictData, onResolve, onCancel }: ConflictResolutionWizardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Booking konflikt oppdaget</h3>
        <p className="text-gray-600">Det er konflikter med de valgte tidspunktene</p>
      </div>

      {conflictData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Konfliktdetaljer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflictData.conflictedDates?.map((date: Date, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">
                    {new Date(date).toLocaleDateString('no-NO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button onClick={onResolve}>
          Fortsett uten konfliktende datoer
        </Button>
      </div>
    </div>
  );
}
