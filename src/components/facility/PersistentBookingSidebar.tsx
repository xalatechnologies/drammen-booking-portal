
import React from "react";
import { ShoppingCart, X, Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { format } from "date-fns";

interface PersistentBookingSidebarProps {
  facilityName: string;
  facilityId: string;
  capacity: number;
  area: string;
  openingHours: string;
}

export function PersistentBookingSidebar({
  facilityName,
  facilityId,
  capacity,
  area,
  openingHours
}: PersistentBookingSidebarProps) {
  const { cartItems, removeFromCart, getTotalPrice, getItemCount } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const facilityCartItems = cartItems.filter(item => item.facilityId === facilityId);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="space-y-4">
      {/* Quick Facts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t('facility.quickFacts')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">{t('facility.capacity')}</p>
              <p className="font-medium">{capacity} {t('common.people')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">{t('facility.area')}</p>
              <p className="font-medium">{area}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">{t('facility.openingHours')}</p>
              <p className="font-medium">{openingHours}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Cart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            {t('booking.cart.title')} ({getItemCount()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {facilityCartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">{t('booking.cart.empty')}</p>
              <p className="text-xs mt-1">{t('booking.cart.selectSlots')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {facilityCartItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.zoneId}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(item.date), 'dd.MM.yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">{item.timeSlot}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.pricePerHour * 2} kr
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index < facilityCartItems.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center font-medium">
                <span>{t('booking.cart.total')}</span>
                <span>{getTotalPrice()} kr</span>
              </div>
              
              <Button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]"
                disabled={getItemCount() === 0}
              >
                {t('booking.cart.proceedToCheckout')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
