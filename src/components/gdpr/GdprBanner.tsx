
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Cookie, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGdpr } from "@/contexts/GdprContext";

export function GdprBanner() {
  const { state, acceptAll, acceptNecessaryOnly, showPreferences, hideBanner } = useGdpr();
  const navigate = useNavigate();

  if (!state.showBanner || state.hasConsented) {
    return null;
  }

  const handleLearnMore = () => {
    navigate('/personvern');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/20 backdrop-blur-sm animate-slide-up">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Vi respekterer ditt personvern
              </h3>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Drammen Kommune bruker informasjonskapsler (cookies) og lignende teknologier for å forbedre din opplevelse på våre nettsider. 
                Vi samler inn og behandler personopplysninger i samsvar med GDPR og norsk personvernlovgivning.
              </p>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Cookie className="h-4 w-4" />
                <span>Nødvendige cookies er alltid aktivert</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={acceptAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Godta alle
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={acceptNecessaryOnly}
                  className="px-6"
                >
                  Godta kun nødvendige
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={showPreferences}
                  className="px-6"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Tilpass innstillinger
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={handleLearnMore}
                  className="px-6 text-blue-600 hover:text-blue-700"
                >
                  Les mer
                </Button>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={hideBanner}
              className="flex-shrink-0 p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
