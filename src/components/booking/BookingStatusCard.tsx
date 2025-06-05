
import React from "react";
import { CheckCircle, Clock, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type BookingStatus = 'pending' | 'approved-payment-required' | 'approved-paid' | 'rejected';

interface BookingStatusCardProps {
  status: BookingStatus;
  facilityName: string;
  bookingReference: string;
  amount?: number;
  onPayNow?: () => void;
  onViewDetails?: () => void;
  approvalDate?: Date;
  paymentDueDate?: Date;
}

export function BookingStatusCard({
  status,
  facilityName,
  bookingReference,
  amount,
  onPayNow,
  onViewDetails,
  approvalDate,
  paymentDueDate
}: BookingStatusCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Venter på godkjenning',
          description: 'Din reservasjon er mottatt og blir behandlet.',
          badgeVariant: 'secondary' as const,
          badgeText: 'Under behandling'
        };
      case 'approved-payment-required':
        return {
          icon: CreditCard,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Godkjent - betaling påkrevd',
          description: 'Din reservasjon er godkjent! Fullfør betaling for å sikre bookingen.',
          badgeVariant: 'default' as const,
          badgeText: 'Betaling påkrevd'
        };
      case 'approved-paid':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Bekreftet og betalt',
          description: 'Din reservasjon er fullført og betalt.',
          badgeVariant: 'default' as const,
          badgeText: 'Bekreftet'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Avslått',
          description: 'Din reservasjon kunne ikke godkjennes.',
          badgeVariant: 'destructive' as const,
          badgeText: 'Avslått'
        };
      default:
        return {
          icon: Clock,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Ukjent status',
          description: 'Kontakt support for mer informasjon.',
          badgeVariant: 'secondary' as const,
          badgeText: 'Ukjent'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card className={`${config.borderColor} border-2 ${config.bgColor}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 ${config.borderColor}`}>
              <StatusIcon className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {config.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Ref: {bookingReference}
              </p>
            </div>
          </div>
          <Badge variant={config.badgeVariant} className="font-semibold">
            {config.badgeText}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{facilityName}</h3>
          <p className="text-sm text-gray-700">
            {config.description}
          </p>
        </div>

        {/* Payment Information */}
        {status === 'approved-payment-required' && amount && (
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Beløp å betale:</span>
              <span className="text-lg font-bold text-blue-600">{amount.toFixed(2)} kr</span>
            </div>
            {paymentDueDate && (
              <p className="text-xs text-gray-600">
                Betaling må gjennomføres innen {paymentDueDate.toLocaleDateString('nb-NO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        )}

        {/* Approval Information */}
        {approvalDate && status !== 'pending' && (
          <div className="text-xs text-gray-600">
            {status === 'approved-payment-required' || status === 'approved-paid' 
              ? 'Godkjent' 
              : 'Behandlet'
            } {approvalDate.toLocaleDateString('nb-NO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {status === 'approved-payment-required' && onPayNow && (
            <Button
              onClick={onPayNow}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <CreditCard className="h-4 w-4 mr-2" aria-hidden="true" />
              Betal nå
            </Button>
          )}
          
          {onViewDetails && (
            <Button
              onClick={onViewDetails}
              variant="outline"
              className={status === 'approved-payment-required' ? 'flex-1' : 'w-full'}
            >
              Se detaljer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
