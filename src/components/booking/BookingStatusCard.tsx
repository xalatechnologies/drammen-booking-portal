
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface BookingStatusCardProps {
  status: string;
  title?: string;
  children?: React.ReactNode;
}

export function BookingStatusCard({ status, title = 'Status', children }: BookingStatusCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { icon: CheckCircle, variant: 'default' as const, label: 'Bekreftet' };
      case 'pending':
        return { icon: Clock, variant: 'secondary' as const, label: 'Venter' };
      case 'cancelled':
        return { icon: XCircle, variant: 'destructive' as const, label: 'Kansellert' };
      case 'draft':
        return { icon: AlertCircle, variant: 'outline' as const, label: 'Utkast' };
      default:
        return { icon: Clock, variant: 'secondary' as const, label: status };
    }
  };

  const { icon: Icon, variant, label } = getStatusConfig(status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={variant} className="mb-3">
          {label}
        </Badge>
        {children}
      </CardContent>
    </Card>
  );
}
