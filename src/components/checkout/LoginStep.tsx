
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

interface LoginStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export function LoginStep({ onBack, onContinue }: LoginStepProps) {
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (method: 'id-porten' | 'feide' | 'municipal') => {
    try {
      // Mock login - in real app this would redirect to actual auth providers
      await login('test@example.com', 'password', method);
      onContinue();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
          Velg innloggingsmetode
        </CardTitle>
        <p className="text-gray-600">
          Velg hvordan du vil logge inn for å fortsette
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {/* ID-porten Button */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white p-3 rounded-lg flex items-center justify-center w-12 h-12 flex-shrink-0">
                <span className="text-sm font-bold">ID</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Logg inn med ID-porten</h3>
                <p className="text-sm text-gray-600">
                  For privatpersoner, lag og foreninger som skal søke om lån eller booke lokaler.
                </p>
              </div>
              <Button 
                onClick={() => handleLogin('id-porten')}
                disabled={isLoading}
                variant="outline"
                className="ml-auto"
              >
                Logg inn via ID-porten
              </Button>
            </div>
          </div>

          {/* Feide Button */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center w-12 h-12 flex-shrink-0">
                <span className="text-lg font-bold">f</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Logg inn med Feide</h3>
                <p className="text-sm text-gray-600">
                  For ansatte i skole eller barnehage med Feide-bruker
                </p>
              </div>
              <Button 
                onClick={() => handleLogin('feide')}
                disabled={isLoading}
                variant="outline"
                className="ml-auto"
              >
                Logg inn med Feide
              </Button>
            </div>
          </div>

          {/* Municipal Employee Button */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-500 via-green-500 via-blue-500 to-yellow-500 p-3 rounded-lg flex items-center justify-center w-12 h-12 flex-shrink-0">
                <div className="bg-white w-6 h-6 rounded grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-red-500 rounded-sm"></div>
                  <div className="bg-green-500 rounded-sm"></div>
                  <div className="bg-blue-500 rounded-sm"></div>
                  <div className="bg-yellow-500 rounded-sm"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Logg inn som kommunalt ansatt</h3>
                <p className="text-sm text-gray-600">
                  For saksbehandlere og ansatte i kommunen
                </p>
              </div>
              <Button 
                onClick={() => handleLogin('municipal')}
                disabled={isLoading}
                variant="outline"
                className="ml-auto"
              >
                Logg inn med kommunebruker
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Tilbake
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
