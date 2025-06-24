
import React from 'react';
import { Info, User, Mail, Phone, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  purpose: string;
  notes: string;
  customerType: 'private' | 'business' | 'organization';
}

interface ConfirmationStepProps {
  formData: ContactFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export function ConfirmationStep({ formData, onBack, onSubmit }: ConfirmationStepProps) {
  const { user } = useAuthStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bekreft og send til godkjenning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Godkjenningsprosess</h4>
              <p className="text-sm text-blue-700 mt-1">
                Din reservasjon vil bli sendt til godkjenning og behandlet innen 1-3 virkedager. 
                Du vil motta en bekreftelse på e-post når søknaden er mottatt.
              </p>
            </div>
          </div>
        </div>

        {user && (
          <div>
            <h3 className="font-semibold mb-3">Innlogget bruker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{user.name || user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Tilbake
          </Button>
          <Button onClick={onSubmit} className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg">
            Send til godkjenning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
