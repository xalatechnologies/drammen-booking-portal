
import React from "react";
import { ShoppingCart, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";

interface ReservationCartSectionProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  cartItems: any[];
  itemCount: number;
  totalPrice: number;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export function ReservationCartSection({
  isOpen,
  onToggle,
  cartItems,
  itemCount,
  totalPrice,
  onRemoveItem,
  onProceedToCheckout
}: ReservationCartSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5" />
              Reservasjonskurv ({itemCount})
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm font-medium">Reservasjonskurven er tom</p>
                <p className="text-xs mt-1 text-gray-400">Fullfør booking for å legge til i reservasjonskurv</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs font-medium">
                            {item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(item.date), 'dd.MM.yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">{item.timeSlot}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 h-auto text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">2t</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 font-medium">
                        {item.pricePerHour * 2} kr
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="font-medium">{totalPrice} kr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">MVA (25%)</span>
                    <span className="font-medium">{Math.round(totalPrice * 0.25)} kr</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{totalPrice + Math.round(totalPrice * 0.25)} kr</span>
                  </div>
                </div>
                
                <Button
                  onClick={onProceedToCheckout}
                  className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium text-base h-12 mt-4"
                  disabled={itemCount === 0}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Gå til kasse
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
