
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, BarChart3, Target, Zap, Info } from "lucide-react";
import { useGdpr, CookiePreferences } from "@/contexts/GdprContext";

export function GdprPreferencesModal() {
  const { state, savePreferences, hidePreferences } = useGdpr();
  const [preferences, setPreferences] = useState<CookiePreferences>(state.preferences);

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  const cookieCategories = [
    {
      key: 'necessary' as const,
      title: 'Nødvendige cookies',
      description: 'Disse er nødvendige for at nettsiden skal fungere og kan ikke deaktiveres.',
      icon: Shield,
      required: true,
      details: [
        'Sesjonsbehandling og sikkerhet',
        'Grunnleggende navigering',
        'Tilgjengelighetsinnstillinger',
        'Språkpreferanser'
      ]
    },
    {
      key: 'functional' as const,
      title: 'Funksjonelle cookies',
      description: 'Gjør det mulig å huske dine valg og gi forbedret funksjonalitet.',
      icon: Zap,
      required: false,
      details: [
        'Brukerpreferanser og innstillinger',
        'Lagring av søk og filtre',
        'Tilpasset brukeropplevelse'
      ]
    },
    {
      key: 'analytics' as const,
      title: 'Analytiske cookies',
      description: 'Hjelper oss å forstå hvordan nettsiden brukes for å forbedre tjenesten.',
      icon: BarChart3,
      required: false,
      details: [
        'Anonymiserte bruksstatistikker',
        'Ytelsesmålinger',
        'Feilrapportering (uten persondata)'
      ]
    },
    {
      key: 'marketing' as const,
      title: 'Markedsføringscookies',
      description: 'Brukes for å vise relevante annonser og målrette kommunikasjon.',
      icon: Target,
      required: false,
      details: [
        'Tilpassede annonser',
        'Sosiale medier integrasjon',
        'Målrettet kommunikasjon'
      ]
    }
  ];

  return (
    <Dialog open={state.showPreferencesModal} onOpenChange={hidePreferences}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cookie-innstillinger
          </DialogTitle>
          <DialogDescription>
            Tilpass dine personverninnstillinger. Du kan endre disse når som helst.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">GDPR-kompatibel</h4>
                <p className="text-sm text-blue-700">
                  Dine valg lagres sikkert og du kan endre dem når som helst. Vi følger GDPR og ISO 27001 standarder.
                </p>
              </div>
            </div>
          </div>

          {cookieCategories.map((category) => {
            const IconComponent = category.icon;
            const isEnabled = preferences[category.key];
            
            return (
              <div key={category.key} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <IconComponent className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{category.title}</h3>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">
                            Påkrevd
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {category.details.map((detail, index) => (
                          <li key={index}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={category.key}
                      checked={isEnabled}
                      onCheckedChange={(value) => handlePreferenceChange(category.key, value)}
                      disabled={category.required}
                    />
                    <Label htmlFor={category.key} className="sr-only">
                      {category.title}
                    </Label>
                  </div>
                </div>
              </div>
            );
          })}

          <Separator />

          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong>Databehandlingsansvarlig:</strong> Drammen Kommune, Rådhusplassen 1, 3008 Drammen
            </p>
            <p>
              <strong>Personvernombud:</strong> personvern@drammen.kommune.no
            </p>
            <p>
              Du har rett til å trekke tilbake samtykket når som helst, samt be om innsyn, retting eller sletting av dine personopplysninger.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Lagre innstillinger
            </Button>
            <Button variant="outline" onClick={hidePreferences}>
              Avbryt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
