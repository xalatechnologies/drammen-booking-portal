
import React from "react";
import { User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingDetailsSectionProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  formData: any;
  validationErrors: any;
  bookingErrors: string[];
  onFormFieldChange: (field: string, value: string) => void;
  onContinueBooking: () => void;
  onResetBooking: () => void;
  isBookingInProgress: boolean;
  canProceed: boolean;
  requiresApproval: boolean;
  isFormValid: boolean;
}

export function BookingDetailsSection({
  isOpen,
  onToggle,
  formData,
  validationErrors,
  bookingErrors,
  onFormFieldChange,
  onContinueBooking,
  onResetBooking,
  isBookingInProgress,
  canProceed,
  requiresApproval,
  isFormValid
}: BookingDetailsSectionProps) {
  const getFieldError = (field: string) => validationErrors[field];

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Booking detaljer
              {!isFormValid && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              {bookingErrors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  {bookingErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Kunde type
                </Label>
                <Select 
                  value={formData.customerType} 
                  onValueChange={(value: 'private' | 'business' | 'organization') => 
                    onFormFieldChange('customerType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privatperson</SelectItem>
                    <SelectItem value="business">Bedrift (-10%)</SelectItem>
                    <SelectItem value="organization">Organisasjon (-20%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kontaktnavn *
                  </Label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) => onFormFieldChange('contactName', e.target.value)}
                    placeholder="Skriv inn fullt navn"
                    className={getFieldError('contactName') ? 'border-red-500' : ''}
                  />
                  {getFieldError('contactName') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('contactName')}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    E-post *
                  </Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => onFormFieldChange('contactEmail', e.target.value)}
                    placeholder="din@epost.no"
                    className={getFieldError('contactEmail') ? 'border-red-500' : ''}
                  />
                  {getFieldError('contactEmail') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('contactEmail')}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Telefon *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => onFormFieldChange('contactPhone', e.target.value)}
                    placeholder="+47 123 45 678"
                    className={getFieldError('contactPhone') ? 'border-red-500' : ''}
                  />
                  {getFieldError('contactPhone') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('contactPhone')}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Organisasjon (valgfritt)
                  </Label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => onFormFieldChange('organization', e.target.value)}
                    placeholder="Organisasjonsnavn"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Formål (valgfritt)
                  </Label>
                  <Input
                    value={formData.purpose || ''}
                    onChange={(e) => onFormFieldChange('purpose', e.target.value)}
                    placeholder="Beskriv formålet med bookingen"
                    className={getFieldError('purpose') ? 'border-red-500' : ''}
                  />
                  {getFieldError('purpose') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('purpose')}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={onContinueBooking}
                  className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af]"
                  disabled={!canProceed || isBookingInProgress}
                >
                  {isBookingInProgress ? 'Behandler...' : 
                   requiresApproval ? 'Send til godkjenning' : 'Fortsett med booking'}
                </Button>
                <Button
                  variant="outline"
                  onClick={onResetBooking}
                  size="sm"
                  className="px-3"
                >
                  Nullstill
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
