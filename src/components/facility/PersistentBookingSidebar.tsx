import React, { useState } from "react";
import { ShoppingCart, X, CreditCard, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { format } from "date-fns";
interface PersistentBookingSidebarProps {
  facilityName: string;
  facilityId: string;
}
export function PersistentBookingSidebar({
  facilityName,
  facilityId
}: PersistentBookingSidebarProps) {
  const {
    cartItems,
    removeFromCart,
    getTotalPrice,
    getItemCount
  } = useCart();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const [customerType, setCustomerType] = useState<string>('private');
  const facilityCartItems = cartItems.filter(item => item.facilityId === facilityId);
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };
  const addTimeSlot = (item: any) => {
    console.log('Add time slot for:', item);
  };
  const removeTimeSlot = (item: any) => {
    console.log('Remove time slot for:', item);
  };
  return <div className="space-y-6">
      {/* Customer Type Selection */}
      

      {/* Booking Cart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            {t('booking.cart.title')} ({getItemCount()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {facilityCartItems.length === 0 ? <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">{t('booking.cart.empty')}</p>
              <p className="text-xs mt-1 text-gray-400">{t('booking.cart.selectSlots')}</p>
            </div> : <div className="space-y-4">
              {facilityCartItems.map((item, index) => <div key={item.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
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
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="p-1 h-auto text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => removeTimeSlot(item)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-gray-500">2t</span>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => addTimeSlot(item)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Badge className="bg-green-100 text-green-800 font-medium">
                      {item.pricePerHour * 2} kr
                    </Badge>
                  </div>
                  
                  {index < facilityCartItems.length - 1 && <Separator className="mt-4" />}
                </div>)}
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('booking.cart.subtotal')}</span>
                  <span className="font-medium">{getTotalPrice()} kr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('booking.cart.vat')}</span>
                  <span className="font-medium">{Math.round(getTotalPrice() * 0.25)} kr</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t('booking.cart.total')}</span>
                  <span>{getTotalPrice() + Math.round(getTotalPrice() * 0.25)} kr</span>
                </div>
              </div>
              
              <Button onClick={handleProceedToCheckout} className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium text-base h-12 mt-4" disabled={getItemCount() === 0}>
                <CreditCard className="h-5 w-5 mr-2" />
                {t('booking.cart.proceedToCheckout')}
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
}