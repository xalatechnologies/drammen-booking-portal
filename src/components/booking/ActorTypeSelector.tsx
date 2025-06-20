
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, Building, Building2, Briefcase, MapPin } from 'lucide-react';
import { ActorType } from '@/types/pricing';

interface ActorTypeSelectorProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

const actorTypes = [
  {
    value: 'private-person' as ActorType,
    label: 'Privatperson',
    description: 'Enkeltpersoner og familier',
    icon: Users,
    discount: '0%'
  },
  {
    value: 'lag-foreninger' as ActorType,
    label: 'Lag og foreninger',
    description: 'Ideelle organisasjoner og foreninger',
    icon: Building,
    discount: '30%'
  },
  {
    value: 'paraply' as ActorType,
    label: 'Paraplyorganisasjoner',
    description: 'Organisasjoner med flere undergrupper',
    icon: Building2,
    discount: '40%'
  },
  {
    value: 'private-firma' as ActorType,
    label: 'Private firma',
    description: 'Kommersielle bedrifter og selskaper',
    icon: Briefcase,
    discount: '0%'
  },
  {
    value: 'kommunale-enheter' as ActorType,
    label: 'Kommunale enheter',
    description: 'Kommunale avdelinger og tjenester',
    icon: MapPin,
    discount: '50%'
  }
];

export function ActorTypeSelector({ value, onChange }: ActorTypeSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {actorTypes.map((type) => {
        const IconComponent = type.icon;
        return (
          <Card
            key={type.value}
            className={`cursor-pointer transition-all ${
              value === type.value
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(type.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value={type.value}
                  id={type.value}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <Label
                      htmlFor={type.value}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {type.label}
                    </Label>
                    {type.discount !== '0%' && (
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        -{type.discount} rabatt
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </RadioGroup>
  );
}
