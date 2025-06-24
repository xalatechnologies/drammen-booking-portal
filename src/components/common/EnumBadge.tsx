
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EnumBadgeProps {
  enumType: string;
  enumKey: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function EnumBadge({ enumType, enumKey, variant = 'default' }: EnumBadgeProps) {
  // Simple display without translations for now
  return (
    <Badge variant={variant}>
      {enumKey}
    </Badge>
  );
}
