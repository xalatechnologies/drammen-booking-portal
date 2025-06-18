
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingDrawerHeaderProps {
  onClose: () => void;
}

export function BookingDrawerHeader({ onClose }: BookingDrawerHeaderProps) {
  return (
    <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Fullfør booking</h2>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
