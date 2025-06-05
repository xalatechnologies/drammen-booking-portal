
import React from 'react';
import { Calculator, Tag, TrendingUp, TrendingDown, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceCalculation } from '@/types/pricing';

interface PriceBreakdownProps {
  calculation: PriceCalculation;
  isLoading?: boolean;
  showDetailed?: boolean;
}

export function PriceBreakdown({ calculation, isLoading = false, showDetailed = true }: PriceBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600 animate-spin" />
            <span className="text-blue-800">Beregner pris...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (calculation.finalPrice === 0 && calculation.breakdown.length === 0) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calculator className="h-5 w-5" />
            <span>Velg detaljer for å se pris</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if this is a free booking for nonprofit
  const isFreeForNonprofit = calculation.finalPrice === 0 && calculation.breakdown.some(
    item => item.description.includes('frivillige organisasjoner')
  );

  return (
    <Card className={`border ${isFreeForNonprofit ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 text-lg ${isFreeForNonprofit ? 'text-green-900' : 'text-blue-900'}`}>
          {isFreeForNonprofit ? <Gift className="h-5 w-5" /> : <Calculator className="h-5 w-5" />}
          {isFreeForNonprofit ? 'Gratis reservasjon' : 'Prisberegning'}
          {calculation.overrideAmount && (
            <Badge variant="secondary" className="ml-2">
              Justert
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Final Price Display */}
        <div className={`bg-white border rounded-lg p-4 ${isFreeForNonprofit ? 'border-green-200' : 'border-blue-200'}`}>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total kostnad:</span>
            <span className={`text-2xl font-bold ${isFreeForNonprofit ? 'text-green-600' : 'text-blue-600'}`}>
              {isFreeForNonprofit ? 'GRATIS' : `${calculation.finalPrice.toFixed(2)} kr`}
            </span>
          </div>
          {calculation.overrideAmount && calculation.overrideReason && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {calculation.overrideReason}
            </p>
          )}
        </div>

        {/* Detailed Breakdown */}
        {showDetailed && calculation.breakdown.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-medium text-sm ${isFreeForNonprofit ? 'text-green-900' : 'text-blue-900'}`}>
              {isFreeForNonprofit ? 'Gratisordning:' : 'Prisoppbygging:'}
            </h4>
            <div className={`bg-white border rounded-lg overflow-hidden ${isFreeForNonprofit ? 'border-green-200' : 'border-blue-200'}`}>
              {calculation.breakdown.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 ${
                    index !== calculation.breakdown.length - 1 ? `border-b ${isFreeForNonprofit ? 'border-green-100' : 'border-blue-100'}` : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.type === 'discount' && <TrendingDown className="h-4 w-4 text-green-600" />}
                    {item.type === 'surcharge' && <TrendingUp className="h-4 w-4 text-orange-600" />}
                    {item.type === 'override' && <Tag className="h-4 w-4 text-purple-600" />}
                    {isFreeForNonprofit && <Gift className="h-4 w-4 text-green-600" />}
                    <span className="text-sm text-gray-700">{item.description}</span>
                  </div>
                  <span 
                    className={`text-sm font-medium ${
                      isFreeForNonprofit 
                        ? 'text-green-600'
                        : item.type === 'discount' 
                        ? 'text-green-600' 
                        : item.type === 'surcharge' 
                        ? 'text-orange-600'
                        : item.type === 'override'
                        ? 'text-purple-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {isFreeForNonprofit ? 'Gratis' : 
                     item.total === 0 ? 'Gratis' :
                     `${item.total >= 0 ? '' : '-'}${Math.abs(item.total).toFixed(2)} kr`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Summary - only show for paid bookings */}
        {!isFreeForNonprofit && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white border border-blue-200 rounded-lg p-3">
              <div className="text-gray-600">Timer totalt</div>
              <div className="font-medium text-blue-900">{calculation.totalHours}</div>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-3">
              <div className="text-gray-600">Basispris per time</div>
              <div className="font-medium text-blue-900">{calculation.basePrice} kr</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
