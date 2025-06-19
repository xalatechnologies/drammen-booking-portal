
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, CreditCard, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { format } from "date-fns";

interface CartDropdownProps {
  onClose: () => void;
}

export function CartDropdown({ onClose }: CartDropdownProps) {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getTotalPrice, getItemCount } = useCart();

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    onClose();
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm font-medium text-gray-500 mb-2">Din handlekurv er tom</p>
        <p className="text-xs text-gray-400">Velg tidslukene du ønsker å reservere</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Handlekurv ({getItemCount()})</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Tøm kurv
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.facilityName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeFromCart(item.id)}
                className="p-1 h-auto text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">
                  {format(new Date(item.date), 'dd.MM.yyyy')}
                </p>
                <p className="text-xs text-gray-600">{item.timeSlot}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-xs">
                {item.pricePerHour * item.duration} kr
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Total and Checkout Button */}
      <div className="p-4 border-t bg-gray-50 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{getTotalPrice()} kr</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">MVA (25%)</span>
            <span className="font-medium">{Math.round(getTotalPrice() * 0.25)} kr</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-base font-bold">
            <span>Total</span>
            <span>{getTotalPrice() + Math.round(getTotalPrice() * 0.25)} kr</span>
          </div>
        </div>
        
        <Button 
          onClick={handleProceedToCheckout} 
          className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium"
          disabled={getItemCount() === 0}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Gå til kassen
        </Button>
      </div>
    </div>
  );
}
