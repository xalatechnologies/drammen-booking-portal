import React from "react";
import { ShoppingCart, X, CreditCard, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface ReservationCartSectionProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  cartItems: any[];
  itemCount: number;
  totalPrice: number;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

const getActorTypeLabel = (actorType: string) => {
  switch (actorType) {
    case 'private': return 'Privatperson';
    case 'business': return 'Bedrift';
    case 'organization': return 'Organisasjon';
    case 'lag-foreninger': return 'Lag/Foreninger';
    case 'paraply': return 'Paraplyorganisasjon';
    default: return 'Ukjent';
  }
};

const getEventTypeLabel = (eventType?: string) => {
  switch (eventType) {
    case 'sport': return 'Sport';
    case 'cultural': return 'Kultur';
    case 'meeting': return 'Møte';
    case 'training': return 'Trening';
    case 'competition': return 'Konkurranse';
    case 'other': return 'Annet';
    default: return 'Ikke spesifisert';
  }
};

const getBookingType = (item: any) => {
  const timeSlots = item.timeSlots || [{
    date: item.date,
    timeSlot: item.timeSlot,
    zoneId: item.zoneId,
    duration: item.duration
  }];
  
  if (timeSlots.length === 1) {
    return 'Enkelt booking';
  }
  
  const dateKeys = [...new Set(timeSlots.map((slot: any) => {
    const dateValue = slot.date instanceof Date ? slot.date : new Date(slot.date);
    return format(dateValue, 'yyyy-MM-dd');
  }))];
  if (dateKeys.length > 1) {
    const uniqueDays = new Set(timeSlots.map((slot: any) => {
      const dateValue = slot.date instanceof Date ? slot.date : new Date(slot.date);
      return format(dateValue, 'EEEE', { locale: nb });
    }));
    if (uniqueDays.size === 1) {
      return 'Fastlån';
    }
  }
  return 'Flere tidspunkt';
};

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
                {cartItems.map((item) => {
                  const timeSlots = item.timeSlots || [{
                    date: item.date,
                    timeSlot: item.timeSlot,
                    zoneId: item.zoneId,
                    duration: item.duration
                  }];
                  
                  const totalDuration = timeSlots.reduce((sum: number, slot: any) => {
                    return sum + (slot.duration || 2);
                  }, 0);
                  
                  const bookingType = getBookingType(item);
                  
                  return (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900">{item.facilityName}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {bookingType}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {timeSlots.length === 1 
                                  ? (() => {
                                      const dateValue = timeSlots[0].date instanceof Date ? timeSlots[0].date : new Date(timeSlots[0].date);
                                      return format(dateValue, 'dd.MM.yyyy', { locale: nb });
                                    })()
                                  : (() => {
                                      const firstDate = timeSlots[0].date instanceof Date ? timeSlots[0].date : new Date(timeSlots[0].date);
                                      const lastDate = timeSlots[timeSlots.length - 1].date instanceof Date ? timeSlots[timeSlots.length - 1].date : new Date(timeSlots[timeSlots.length - 1].date);
                                      return `${format(firstDate, 'dd.MM', { locale: nb })} - ${format(lastDate, 'dd.MM.yyyy', { locale: nb })}`;
                                    })()
                                }
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{totalDuration}t</span>
                            </div>
                            
                            {item.expectedAttendees && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{item.expectedAttendees}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 truncate">{item.purpose}</p>
                            
                            {item.eventType && (
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">Type:</span> {getEventTypeLabel(item.eventType)}
                              </p>
                            )}
                            
                            {item.specialRequirements && (
                              <p className="text-xs text-gray-500 truncate">
                                <span className="font-medium">Tillegg:</span> {item.specialRequirements}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {getActorTypeLabel(item.organizationType)}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 h-auto text-gray-400 hover:text-red-500 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <Badge className="bg-green-100 text-green-800 font-medium">
                          {item.pricing?.totalPrice || (item.pricePerHour * totalDuration)} kr
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
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
