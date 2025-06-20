
import React from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { CartProvider } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface LoadingStateProps {}

export function LoadingState({}: LoadingStateProps) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalHeader />
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-96 w-full rounded-lg" />
                </div>
                <div className="lg:col-span-1">
                  <Skeleton className="h-80 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <GlobalFooter />
      </div>
    </CartProvider>
  );
}

interface ErrorStateProps {
  error?: any;
  notFound?: boolean;
}

export function ErrorState({ error, notFound }: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {notFound ? "Lokale ikke funnet" : "Feil ved lasting"}
            </h1>
            <p className="text-gray-600 mb-8">
              {notFound ? "Det forespurte lokalet kunne ikke finnes." : "Det oppstod en feil ved lasting av lokalet."}
            </p>
            <Button onClick={() => navigate("/")} className="mb-4">
              <Home className="h-4 w-4 mr-2" />
              Tilbake til forsiden
            </Button>
          </div>
        </div>
        <GlobalFooter />
      </div>
    </CartProvider>
  );
}
