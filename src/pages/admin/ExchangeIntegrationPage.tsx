import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/useTranslation";

const ExchangeIntegrationPage = () => {
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { tSync } = useTranslation();

  const handleSave = () => {
    // Placeholder for save functionality
    alert(tSync("admin.exchangeIntegration.saved", "Settings saved!"));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={tSync("admin.exchangeIntegration.title", "Exchange Integration")}
        description={tSync("admin.exchangeIntegration.description", "Connect to Microsoft Exchange for calendar and booking synchronization.")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{tSync("admin.exchangeIntegration.settings", "Integration Settings")}</CardTitle>
          <CardDescription>
            {tSync("admin.exchangeIntegration.configure", "Configure your Exchange integration settings.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="exchange-enabled">{tSync("admin.exchangeIntegration.enable", "Enable Integration")}</Label>
            <Switch id="exchange-enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div>
            <Label htmlFor="api-key">{tSync("admin.exchangeIntegration.apiKey", "API Key")}</Label>
            <Input
              type="text"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={tSync("admin.exchangeIntegration.apiKeyPlaceholder", "Enter your API key")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>{tSync("admin.exchangeIntegration.save", "Save Settings")}</Button>
      </div>
    </div>
  );
};

export default ExchangeIntegrationPage;
