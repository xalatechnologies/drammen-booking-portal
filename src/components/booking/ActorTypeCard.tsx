
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { ActorType } from '@/types/pricing';

interface ActorTypeCardProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

const actorTypes = [
  { value: 'private-person' as ActorType, label: 'Privatperson' },
  { value: 'lag-foreninger' as ActorType, label: 'Lag og foreninger' },
  { value: 'paraply' as ActorType, label: 'Paraplyorganisasjoner' },
  { value: 'private-firma' as ActorType, label: 'Private bedrifter' },
  { value: 'kommunale-enheter' as ActorType, label: 'Kommunale enheter' }
];

export function ActorTypeCard({ value, onChange }: ActorTypeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Aktørtype
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="actorType">Hvem booker? *</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Velg aktørtype" />
            </SelectTrigger>
            <SelectContent>
              {actorTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
