import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Edit } from 'lucide-react';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface Zone {
  id: string; 
  name: string;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity: number;
  description: string;
  isMainZone: boolean;
  bookableIndependently: boolean;
  areaSqm: number;
  floor: string;
  equipment: string[];
  status: 'active' | 'maintenance' | 'inactive';
  priceMultiplier: number;
  minBookingDuration: number;
  maxBookingDuration: number;
}

interface ZoneListProps {
  zones: Zone[];
  onEdit: (zone: Zone) => void;
  onRemove: (zoneId: string) => void;
}

export const ZoneList: React.FC<ZoneListProps> = ({ zones, onEdit, onRemove }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {zones.map((zone) => (
        <Card key={zone.id}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div>
              <CardTitle className="text-lg">{zone.name}</CardTitle>
              {zone.description && <CardDescription>{zone.description}</CardDescription>}
            </div>
            <div className="flex items-center space-x-2">
                {zone.capacity && <span className="text-sm text-muted-foreground">{t('admin:zones.capacity', { count: zone.capacity })}</span>}
                <Button variant="ghost" size="icon" onClick={() => onEdit(zone)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onRemove(zone.id)}>
                    <Trash className="h-4 w-4 text-destructive" />
                </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}; 