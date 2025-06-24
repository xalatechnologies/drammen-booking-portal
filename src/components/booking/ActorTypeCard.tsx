
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
      <CardContent className="p-4">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Hvem booker?" />
          </SelectTrigger>
          <SelectContent>
            {actorTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
