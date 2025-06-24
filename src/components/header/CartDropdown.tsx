
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export function CartDropdown() {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Handlekurv
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Handlekurven er tom</p>
            <p className="text-sm text-gray-400">
              Legg til lokaler for å starte booking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 max-h-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Handlekurv ({items.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.facilityName}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.zoneId || 'Hele lokalet'}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCart(item.id)}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(item.startTime), 'dd.MM.yyyy', { locale: nb })}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(item.startTime), 'HH:mm')} - {format(new Date(item.endTime), 'HH:mm')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {item.actorType}
              </Badge>
              <span className="font-medium text-sm">
                {item.price} kr
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">Totalt:</span>
          <span className="font-bold text-lg">
            {getTotalPrice().toLocaleString('no-NO')} kr
          </span>
        </div>
        <Button onClick={handleCheckout} className="w-full">
          Gå til kasse
        </Button>
      </div>
    </Card>
  );
}
