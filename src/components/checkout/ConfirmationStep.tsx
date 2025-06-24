
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ConfirmationStepProps {
  reference: string;
  onBackToFacilities: () => void;
}

export function ConfirmationStep({ reference, onBackToFacilities }: ConfirmationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Booking Confirmed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Your booking has been confirmed!</p>
        <p className="text-sm text-gray-600">
          Reference: <span className="font-mono">{reference}</span>
        </p>
        
        <Button onClick={onBackToFacilities} className="w-full">
          Back to Facilities
        </Button>
      </CardContent>
    </Card>
  );
}
