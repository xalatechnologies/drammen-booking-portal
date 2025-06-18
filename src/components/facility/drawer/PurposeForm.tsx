
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PurposeFormProps {
  purpose: string;
  onPurposeChange: (purpose: string) => void;
}

export function PurposeForm({ purpose, onPurposeChange }: PurposeFormProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-600" />
          Formål med bookingen *
        </Label>
        <Textarea
          value={purpose}
          onChange={(e) => onPurposeChange(e.target.value)}
          placeholder="Beskriv kort hva lokalet skal brukes til..."
          className="resize-none h-24 border-gray-300 focus:border-slate-700 text-base"
        />
        {purpose.trim().length === 0 && (
          <p className="text-sm text-red-600">Dette feltet er påkrevd</p>
        )}
      </CardContent>
    </Card>
  );
}
