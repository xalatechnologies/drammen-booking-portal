
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutBreadcrumb } from './CheckoutBreadcrumb';

interface CheckoutHeaderProps {
  onBack: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <>
      <CheckoutBreadcrumb />
      
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tilbake
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fullfør reservasjon</h1>
          <p className="text-gray-600">Gjennomgå og bekreft dine reservasjoner</p>
        </div>
      </div>
    </>
  );
}
