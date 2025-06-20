
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Users, Building } from 'lucide-react';

interface LoginSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginMethodSelect: (method: 'id-porten' | 'feide' | 'municipal') => void;
}

export function LoginSelectionModal({ isOpen, onClose, onLoginMethodSelect }: LoginSelectionModalProps) {
  console.log('LoginSelectionModal: isOpen:', isOpen);

  const handleMethodSelect = (method: 'id-porten' | 'feide' | 'municipal') => {
    console.log('LoginSelectionModal: Method selected:', method);
    onLoginMethodSelect(method);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-8">
        <DialogHeader className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
              <div className="w-8 h-8 bg-yellow-400 rounded"></div>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                DRAMMEN KOMMUNE
              </DialogTitle>
            </div>
          </div>
          <p className="text-lg text-gray-700 mt-4">
            Velg innloggingsmetode basert på hvem du er:
          </p>
        </DialogHeader>

        <div className="space-y-4">
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
                  onClick={() => handleMethodSelect('id-porten')}
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
                  onClick={() => handleMethodSelect('feide')}
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
                  onClick={() => handleMethodSelect('municipal')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Logg inn med kommunebruker
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
