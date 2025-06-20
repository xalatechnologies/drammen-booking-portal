
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Building } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* ID-porten Button */}
          <div className="text-center">
            <div className="bg-red-500 text-white p-4 rounded-lg mb-3 mx-auto w-16 h-16 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ID-porten</h3>
            <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">
              For privatpersoner, lag og foreninger
            </p>
            <Button 
              onClick={() => handleLogin('id-porten')}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white w-full"
            >
              Logg inn
            </Button>
          </div>

          {/* Feide Button */}
          <div className="text-center">
            <div className="bg-blue-700 text-white p-4 rounded-lg mb-3 mx-auto w-16 h-16 flex items-center justify-center">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Feide</h3>
            <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">
              For ansatte i skole eller barnehage
            </p>
            <Button 
              onClick={() => handleLogin('feide')}
              disabled={isLoading}
              className="bg-blue-700 hover:bg-blue-800 text-white w-full"
            >
              Logg inn
            </Button>
          </div>

          {/* Municipal Employee Button */}
          <div className="text-center">
            <div className="bg-green-600 text-white p-4 rounded-lg mb-3 mx-auto w-16 h-16 flex items-center justify-center">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Kommunebruker</h3>
            <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">
              For saksbehandlere og kommunalt ansatte
            </p>
            <Button 
              onClick={() => handleLogin('municipal')}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              Logg inn
            </Button>
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
