
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  purpose: string;
  notes: string;
  customerType: 'private' | 'business' | 'organization';
}

interface ContactDetailsStepProps {
  formData: ContactFormData;
  onFormDataChange: (data: Partial<ContactFormData>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ContactDetailsStep({ 
  formData, 
  onFormDataChange, 
  onBack, 
  onContinue 
}: ContactDetailsStepProps) {
  const isFormValid = formData.name && formData.email && formData.phone && formData.purpose && 
                     (formData.customerType === 'private' || formData.organization);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Kontaktopplysninger og kundeinfo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Kundetype</Label>
          <Select 
            value={formData.customerType} 
            onValueChange={(value: 'private' | 'business' | 'organization') => 
              onFormDataChange({ customerType: value })
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Privatperson</SelectItem>
              <SelectItem value="business">Bedrift (10% rabatt)</SelectItem>
              <SelectItem value="organization">Organisasjon/forening (20% rabatt)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-base font-medium">Kontaktperson *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="Fullt navn"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-base font-medium">E-postadresse *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ email: e.target.value })}
              placeholder="din@email.no"
              className="mt-2"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone" className="text-base font-medium">Telefonnummer *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ phone: e.target.value })}
              placeholder="+47 123 45 678"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="organization" className="text-base font-medium">
              {formData.customerType === 'private' ? 'Organisasjon (valgfritt)' : 'Organisasjon/bedrift *'}
            </Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => onFormDataChange({ organization: e.target.value })}
              placeholder="Navn på organisasjon/bedrift"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="purpose" className="text-base font-medium">Formål med reservasjonen *</Label>
          <Input
            id="purpose"
            value={formData.purpose}
            onChange={(e) => onFormDataChange({ purpose: e.target.value })}
            placeholder="F.eks. fotballtrening, møte, arrangement, konsert"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-base font-medium">Tilleggsnotater (valgfritt)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onFormDataChange({ notes: e.target.value })}
            placeholder="Spesielle ønsker, utstyr som trengs, eller annen viktig informasjon..."
            rows={4}
            className="mt-2"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Tilbake
          </Button>
          <Button 
            onClick={onContinue}
            disabled={!isFormValid}
            className="flex-1"
          >
            Gå til bekreftelse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
