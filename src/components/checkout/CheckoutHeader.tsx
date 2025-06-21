
import React from 'react';
import { CheckoutBreadcrumb } from './CheckoutBreadcrumb';

interface CheckoutHeaderProps {
  onBack: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <CheckoutBreadcrumb />
  );
}
