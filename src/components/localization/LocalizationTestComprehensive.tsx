
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedFacilities } from "@/hooks/useLocalizedFacilities";
import { useFacilitiesPagination } from "@/hooks/useFacilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Check, X } from "lucide-react";

export function LocalizationTestComprehensive() {
  const { language, toggleLanguage } = useLanguage();
  const { pagination } = useFacilitiesPagination(1, 3);
  const { facilities, isLoading, error } = useLocalizedFacilities({
    pagination,
    filters: {}
  });

  const translations = {
    NO: {
      title: "Komplett lokaliseringstest",
      currentLanguage: "Nåværende språk",
      switchLanguage: "Bytt språk",
      dataTest: "Data-test",
      facilitiesLoaded: "Lokaler lastet",
      loading: "Laster...",
      error: "Feil",
      testResults: "Testresultater",
      facilitiesCount: "Antall lokaler",
      firstFacility: "Første lokale",
      localizationWorking: "Lokalisering fungerer",
      localizationNotWorking: "Lokalisering fungerer ikke"
    },
    EN: {
      title: "Comprehensive localization test",
      currentLanguage: "Current language",
      switchLanguage: "Switch language",
      dataTest: "Data test",
      facilitiesLoaded: "Facilities loaded",
      loading: "Loading...",
      error: "Error",
      testResults: "Test results",
      facilitiesCount: "Number of facilities",
      firstFacility: "First facility",
      localizationWorking: "Localization working",
      localizationNotWorking: "Localization not working"
    }
  };

  const t = translations[language];

  const isLocalizationWorking = () => {
    if (!facilities || facilities.length === 0) return false;
    
    // Check if facility names are properly localized (not objects)
    const firstFacility = facilities[0];
    return typeof firstFacility.name === 'string' && 
           typeof firstFacility.description === 'string' &&
           Array.isArray(firstFacility.suitableFor);
  };

  return (
    <div className="max-w-4xl mx-auto m-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.currentLanguage}: {language}</span>
            <Button onClick={toggleLanguage} variant="outline">
              {t.switchLanguage}
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">{t.testResults}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isLocalizationWorking() ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>
                  {isLocalizationWorking() ? t.localizationWorking : t.localizationNotWorking}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <p>{t.facilitiesCount}: {facilities?.length || 0}</p>
                
                {isLoading && <p>{t.loading}</p>}
                {error && <p className="text-red-600">{t.error}: {error.message}</p>}
                
                {facilities && facilities.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">{t.firstFacility}:</p>
                    <div className="ml-4 space-y-1">
                      <p>Name: {facilities[0].name}</p>
                      <p>Type: {facilities[0].type}</p>
                      <p>Area: {facilities[0].area}</p>
                      <div className="flex flex-wrap gap-1">
                        {facilities[0].suitableFor?.slice(0, 3).map((activity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
