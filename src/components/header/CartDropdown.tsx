
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, CreditCard, Trash2, Calendar, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { format } from "date-fns";

interface CartDropdownProps {
  onClose: () => void;
}

export function CartDropdown({ onClose }: CartDropdownProps) {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, getTotalPrice, getItemCount } = useCart();
  const { t } = useTranslation();

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    onClose();
  };

  if (items.length === 0) {
    return (
      <div className="w-[500px] p-6 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium text-gray-500 mb-2">{t('booking.cart.empty')}</p>
        <p className="text-base text-gray-400">{t('booking.cart.selectTimeSlots')}</p>
      </div>
    );
  }

  return (
    <div className="w-[600px] max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-2xl">{t('booking.cart.title')} ({getItemCount()})</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            {t('booking.cart.clear')}
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto min-h-0">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-gray-900 truncate">
                  {item.facilityName}
                </p>
                <p className="text-base text-gray-600 truncate mt-1">
                  {item.purpose}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeFromCart(item.id)}
                className="p-2 h-auto text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Time slots summary */}
            <div className="space-y-2 mb-3">
              {item.timeSlots && item.timeSlots.length > 1 ? (
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{item.timeSlots.length} tidspunkt</span>
                  <Clock className="h-5 w-5 ml-2" />
                  <span>{item.duration || (item.timeSlots.length * 2)}t total</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(item.date), 'dd.MM.yyyy')}</span>
                  <Clock className="h-5 w-5 ml-2" />
                  <span>{item.timeSlot}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-base px-3 py-1">
                {item.organizationType === 'private' ? 'Privat' : 
                 item.organizationType === 'organization' ? 'Organisasjon' : 'Bedrift'}
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-base font-semibold px-3 py-1">
                {item.pricing?.totalPrice || (item.pricePerHour * (item.duration || 2))} kr
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Total and Checkout Button - Always visible */}
      <div className="p-5 border-t bg-gray-50 space-y-4 flex-shrink-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">{t('booking.pricing.subtotal')}</span>
            <span className="font-medium">{getTotalPrice()} kr</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">{t('booking.pricing.vat')}</span>
            <span className="font-medium">{Math.round(getTotalPrice() * 0.25)} kr</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>{t('booking.pricing.total')}</span>
            <span>{getTotalPrice() + Math.round(getTotalPrice() * 0.25)} kr</span>
          </div>
        </div>
        
        <Button 
          onClick={handleProceedToCheckout} 
          className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium text-lg py-3"
          disabled={getItemCount() === 0}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          {t('booking.cart.proceedToCheckout')}
        </Button>
      </div>
    </div>
  );
}
