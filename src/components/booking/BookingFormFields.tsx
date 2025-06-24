
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building, Users } from 'lucide-react';
import { ActorType } from '@/types/pricing';

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
}

interface BookingFormFieldsProps {
  formData: BookingFormData;
  onUpdateFormData: (updates: Partial<BookingFormData>) => void;
}

// Separate data for purpose (formål) and activity type (aktivitet)
const purposeOptions = [
  { value: 'sport', label: 'Sport og trening' },
  { value: 'meeting', label: 'Møte' },
  { value: 'course', label: 'Kurs/opplæring' },
  { value: 'event', label: 'Arrangement/fest' },
  { value: 'conference', label: 'Konferanse' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'presentation', label: 'Presentasjon' },
  { value: 'other', label: 'Annet' }
];

const activityTypeOptions = [
  { value: 'fotball', label: 'Fotball' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'handball', label: 'Håndball' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'dans', label: 'Dans' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'aerobic', label: 'Aerobic' },
  { value: 'styrketrening', label: 'Styrketrening' },
  { value: 'kampsport', label: 'Kampsport' },
  { value: 'gymnastikk', label: 'Gymnastikk' },
  { value: 'annet-sport', label: 'Annen sport' }
];

export function BookingFormFields({ formData, onUpdateFormData }: BookingFormFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking informasjon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actor Type Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Hvem booker? *</Label>
          <RadioGroup
            value={formData.actorType}
            onValueChange={(value: ActorType) => onUpdateFormData({ actorType: value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="private-person" id="private-person" />
              <Label htmlFor="private-person" className="flex items-center gap-2 cursor-pointer flex-1">
                <User className="h-4 w-4" />
                Privatperson
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="private-firma" id="private-firma" />
              <Label htmlFor="private-firma" className="flex items-center gap-2 cursor-pointer flex-1">
                <Building className="h-4 w-4" />
                Privat firma
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="lag-foreninger" id="lag-foreninger" />
              <Label htmlFor="lag-foreninger" className="flex items-center gap-2 cursor-pointer flex-1">
                <Users className="h-4 w-4" />
                Lag/Foreninger
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="paraply" id="paraply" />
              <Label htmlFor="paraply" className="flex items-center gap-2 cursor-pointer flex-1">
                <Users className="h-4 w-4" />
                Paraplyorganisasjon
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="kommunale-enheter" id="kommunale-enheter" />
              <Label htmlFor="kommunale-enheter" className="flex items-center gap-2 cursor-pointer flex-1">
                <Building className="h-4 w-4" />
                Kommunale enheter
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Purpose Selection */}
        <div>
          <Label htmlFor="purpose">Formål med booking *</Label>
          <Select 
            value={formData.purpose} 
            onValueChange={(value) => onUpdateFormData({ purpose: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Velg formål med bookingen" />
            </SelectTrigger>
            <SelectContent>
              {purposeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activity Type Selection */}
        <div>
          <Label htmlFor="activityType">Type aktivitet</Label>
          <Select 
            value={formData.activityType} 
            onValueChange={(value) => onUpdateFormData({ activityType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Velg type aktivitet" />
            </SelectTrigger>
            <SelectContent>
              {activityTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Number of Attendees */}
        <div>
          <Label htmlFor="attendees">Antall deltakere *</Label>
          <Input
            id="attendees"
            type="number"
            min="1"
            value={formData.attendees}
            onChange={(e) => onUpdateFormData({ attendees: parseInt(e.target.value) || 1 })}
            className="w-full"
          />
        </div>

        {/* Additional Information */}
        <div>
          <Label htmlFor="additionalInfo">Tilleggsinformasjon</Label>
          <Textarea
            id="additionalInfo"
            value={formData.additionalInfo}
            onChange={(e) => onUpdateFormData({ additionalInfo: e.target.value })}
            placeholder="Spesielle behov, utstyr som trengs, etc."
            rows={3}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
