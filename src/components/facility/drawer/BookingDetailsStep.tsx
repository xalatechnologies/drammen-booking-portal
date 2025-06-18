
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  purpose: string;
  notes: string;
}

interface BookingDetailsStepProps {
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function BookingDetailsStep({
  formData,
  onFormDataChange,
  onBack,
  onSubmit
}: BookingDetailsStepProps) {
  const updateFormData = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const isFormValid = formData.name && formData.email && formData.phone && formData.purpose;

  return (
    <>
      {/* Contact Details Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Kontaktinformasjon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Navn *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Ditt navn"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="Telefonnummer"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="din@epost.no"
            />
          </div>

          <div>
            <Label htmlFor="organization">Organisasjon</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => updateFormData('organization', e.target.value)}
              placeholder="Navn på organisasjon (valgfritt)"
            />
          </div>

          <div>
            <Label htmlFor="purpose">Formål med booking *</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => updateFormData('purpose', e.target.value)}
              placeholder="F.eks. fotballtrening, arrangement"
            />
          </div>

          <div>
            <Label htmlFor="notes">Tilleggsinformasjon</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Eventuelle spesielle behov eller kommentarer"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Tilbake
        </Button>
        <Button 
          onClick={onSubmit} 
          className="flex-1"
          disabled={!isFormValid}
        >
          Send søknad
        </Button>
      </div>
    </>
  );
}
