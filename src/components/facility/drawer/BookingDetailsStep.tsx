
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/i18n/hooks/useTranslation';

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
  const { t } = useTranslation();

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
            {t('forms.headings.contactInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">{t('forms.labels.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder={t('forms.placeholders.name')}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('forms.labels.phone')} *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder={t('forms.placeholders.phone')}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">{t('forms.labels.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder={t('forms.placeholders.email')}
            />
          </div>

          <div>
            <Label htmlFor="organization">{t('forms.labels.organization')}</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => updateFormData('organization', e.target.value)}
              placeholder={t('forms.placeholders.organization')}
            />
          </div>

          <div>
            <Label htmlFor="purpose">{t('forms.labels.purpose')} *</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => updateFormData('purpose', e.target.value)}
              placeholder={t('forms.placeholders.purpose')}
            />
          </div>

          <div>
            <Label htmlFor="notes">{t('forms.labels.additionalInfo')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder={t('forms.placeholders.notes')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          {t('forms.buttons.back')}
        </Button>
        <Button 
          onClick={onSubmit} 
          className="flex-1"
          disabled={!isFormValid}
        >
          {t('forms.buttons.submit')}
        </Button>
      </div>
    </>
  );
}
