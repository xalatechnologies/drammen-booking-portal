
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalHeader from "@/components/GlobalHeader";
import { useTranslation } from "@/i18n";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{t('common.navigation.settings')}</h1>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.users.settings', {}, 'Brukerinnstillinger')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('admin.dashboard.overview', {}, 'Her vil du kunne tilpasse din brukerprofil og applikasjonsinnstillinger.')}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('navigation.footer.contact', {}, 'Hjelp')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('error.network.unknown', {}, 'Hvis du trenger hjelp med innstillingene dine, vennligst kontakt kundeservice på support@drammmen.kommune.no')}
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
