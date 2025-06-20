
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
  const [selectedMethod, setSelectedMethod] = useState<'id-porten' | 'feide' | 'municipal' | null>(null);

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
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
            <div className="w-8 h-8 bg-yellow-400 rounded"></div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              DRAMMEN KOMMUNE
            </CardTitle>
          </div>
        </div>
        <p className="text-lg text-gray-700 mt-4">
          Velg innloggingsmetode basert på hvem du er:
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ID-porten Option */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="bg-red-500 text-white p-3 rounded-lg flex-shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Logg inn med ID-porten
              </h3>
              <p className="text-gray-600 mb-4">
                For privatpersoner, lag og foreninger som skal søke om lån eller booke lokaler.
              </p>
              <Button 
                onClick={() => handleLogin('id-porten')}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logg inn via ID-porten
              </Button>
            </div>
          </div>
        </div>

        {/* Feide Option */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-700 text-white p-3 rounded-lg flex-shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Logg inn med Feide
              </h3>
              <p className="text-gray-600 mb-4">
                For ansatte i skole eller barnehage med Feide-bruker
              </p>
              <Button 
                onClick={() => handleLogin('feide')}
                disabled={isLoading}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                Logg inn med Feide
              </Button>
            </div>
          </div>
        </div>

        {/* Municipal Employee Option */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-br from-red-500 via-green-500 via-blue-500 to-yellow-500 p-3 rounded-lg flex-shrink-0">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Logg inn som kommunalt ansatt
              </h3>
              <p className="text-gray-600 mb-4">
                For saksbehandlere og ansatte i kommunen
              </p>
              <Button 
                onClick={() => handleLogin('municipal')}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
