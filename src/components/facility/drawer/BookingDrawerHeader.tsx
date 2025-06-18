
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingDrawerHeaderProps {
  onClose: () => void;
}

export function BookingDrawerHeader({ onClose }: BookingDrawerHeaderProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Fullfør booking</h2>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
