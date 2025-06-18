
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalHeader from "@/components/GlobalHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const SettingsPage: React.FC = () => {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      title: "Innstillinger",
      userSettings: "Brukerinnstillinger",
      userDescription: "Her vil du kunne tilpasse din brukerprofil og applikasjonsinnstillinger.",
      help: "Hjelp",
      helpDescription: "Hvis du trenger hjelp med innstillingene dine, vennligst kontakt kundeservice på support@drammmen.kommune.no"
    },
    EN: {
      title: "Settings",
      userSettings: "User Settings",
      userDescription: "Here you can customize your user profile and application settings.",
      help: "Help",
      helpDescription: "If you need help with your settings, please contact customer service at support@drammmen.kommune.no"
    }
  };

  const t = translations[language];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>{t.userSettings}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t.userDescription}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.help}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.helpDescription}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
