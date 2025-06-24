import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Shield, Key } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const AuthProvidersPage = () => {
  const { tSync } = useTranslation();
  const [providers, setProviders] = useState([
    {
      id: "google",
      name: "Google",
      enabled: true,
      clientId: "your-google-client-id",
      clientSecret: "your-google-client-secret",
    },
    {
      id: "facebook",
      name: "Facebook",
      enabled: false,
      clientId: "your-facebook-client-id",
      clientSecret: "your-facebook-client-secret",
    },
    {
      id: "azure",
      name: "Azure AD",
      enabled: false,
      clientId: "your-azure-client-id",
      clientSecret: "your-azure-client-secret",
    },
  ]);

  const handleProviderToggle = (id: string) => {
    setProviders(
      providers.map((provider) =>
        provider.id === id ? { ...provider, enabled: !provider.enabled } : provider
      )
    );
  };

  const handleClientIdChange = (id: string, value: string) => {
    setProviders(
      providers.map((provider) =>
        provider.id === id ? { ...provider, clientId: value } : provider
      )
    );
  };

  const handleClientSecretChange = (id: string, value: string) => {
    setProviders(
      providers.map((provider) =>
        provider.id === id ? { ...provider, clientSecret: value } : provider
      )
    );
  };

  return (
    <div>
      <PageHeader
        title={tSync("admin.authProviders.title", "Authentication Providers")}
        description={tSync("admin.authProviders.description", "Configure authentication methods for your application")}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {tSync("admin.authProviders.addProvider", "Add Provider")}
          </Button>
        }
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            {tSync("admin.authProviders.generalSettings", "General Settings")}
          </TabsTrigger>
          <TabsTrigger value="providers">
            <Shield className="h-4 w-4 mr-2" />
            {tSync("admin.authProviders.providersConfig", "Providers Configuration")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.authProviders.securitySettings", "Security Settings")}</CardTitle>
              <CardDescription>
                {tSync("admin.authProviders.securityDescription", "Manage general security settings for authentication")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="require-2fa" className="flex items-center justify-between">
                  {tSync("admin.authProviders.require2FA", "Require Two-Factor Authentication")}
                  <Switch id="require-2fa" />
                </Label>
              </div>
              <div>
                <Label htmlFor="session-timeout">
                  {tSync("admin.authProviders.sessionTimeout", "Session Timeout (minutes)")}
                </Label>
                <Input id="session-timeout" type="number" defaultValue={60} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {provider.name}
                  <Badge variant="secondary">
                    <Key className="h-3 w-3 mr-1" />
                    {provider.id}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {tSync("admin.authProviders.configureProvider", "Configure settings for")} {provider.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`${provider.id}-enabled`} className="flex items-center justify-between">
                    {tSync("admin.authProviders.enableProvider", "Enable Provider")}
                    <Switch
                      id={`${provider.id}-enabled`}
                      checked={provider.enabled}
                      onCheckedChange={() => handleProviderToggle(provider.id)}
                    />
                  </Label>
                </div>
                <div>
                  <Label htmlFor={`${provider.id}-client-id`}>
                    {tSync("admin.authProviders.clientId", "Client ID")}
                  </Label>
                  <Input
                    id={`${provider.id}-client-id`}
                    type="text"
                    value={provider.clientId}
                    onChange={(e) => handleClientIdChange(provider.id, e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${provider.id}-client-secret`}>
                    {tSync("admin.authProviders.clientSecret", "Client Secret")}
                  </Label>
                  <Input
                    id={`${provider.id}-client-secret`}
                    type="password"
                    value={provider.clientSecret}
                    onChange={(e) => handleClientSecretChange(provider.id, e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthProvidersPage;
