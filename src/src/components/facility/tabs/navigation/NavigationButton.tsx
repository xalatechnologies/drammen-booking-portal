
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonProps {
  direction: 'previous' | 'next';
  onClick: () => void;
  disabled?: boolean;
}

export function NavigationButton({ direction, onClick, disabled }: NavigationButtonProps) {
  const isPrevious = direction === 'previous';
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 h-9 px-4 text-sm"
      disabled={disabled}
    >
      {isPrevious && <ChevronLeft className="h-4 w-4" />}
      {isPrevious ? 'Forrige' : 'Neste'}
      {!isPrevious && <ChevronRight className="h-4 w-4" />}
    </Button>
  );
}
