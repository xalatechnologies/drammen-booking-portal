
import React, { useState } from "react";
import { ShoppingCart, X, CreditCard, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface PersistentBookingSidebarProps {
  facilityName: string;
  facilityId: string;
}

export function PersistentBookingSidebar({
  facilityName,
  facilityId
}: PersistentBookingSidebarProps) {
  const {
    items,
    removeFromCart,
    getTotalPrice,
    getItemCount
  } = useCart();
  const navigate = useNavigate();

  const facilityCartItems = items.filter(item => item.facilityId === facilityId);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Booking Cart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Reservasjonskurv ({getItemCount()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {facilityCartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">Reservasjonskurven er tom</p>
              <p className="text-xs mt-1 text-gray-400">Velg tidslukene du ønsker å reservere</p>
            </div>
          ) : (
            <div className="space-y-4">
              {facilityCartItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(item.startTime).toLocaleDateString('no-NO')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.startTime).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(item.endTime).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="p-1 h-auto text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{item.duration} min</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 font-medium">
                      {item.price} kr
                    </Badge>
                  </div>
                  
                  {index < facilityCartItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="font-medium">{getTotalPrice()} kr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">MVA (25%)</span>
                  <span className="font-medium">{Math.round(getTotalPrice() * 0.25)} kr</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{getTotalPrice() + Math.round(getTotalPrice() * 0.25)} kr</span>
                </div>
              </div>
              
              <Button onClick={handleProceedToCheckout} className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium text-base h-12 mt-4" disabled={getItemCount() === 0}>
                <CreditCard className="h-5 w-5 mr-2" />
                Gå til kassen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
