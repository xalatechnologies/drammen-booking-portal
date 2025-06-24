
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useEnum } from '@/hooks/useEnum';
import { EnumType } from '@/types/enum';

interface EnumBadgeProps {
  enumType: EnumType;
  value: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  showTooltip?: boolean;
}

export function EnumBadge({
  enumType,
  value,
  variant = 'default',
  className = "",
  showTooltip = false
}: EnumBadgeProps) {
  const { getLabel, getDescription } = useEnum(enumType);
  
  const label = getLabel(value);
  const description = getDescription(value);

  const badge = (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );

  if (showTooltip && description) {
    return (
      <div title={description}>
        {badge}
      </div>
    );
  }

  return badge;
}
