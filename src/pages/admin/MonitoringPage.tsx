import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, Bell, Cpu, Database, LineChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const currentUser = { name: "Admin Bruker", role: "systemadmin" }; // Bytt til 'systemadmin' eller 'superadmin' for full tilgang

// Mock data for monitoring settings
const mockMonitoringConfig = {
  applicationInsights: {
    enabled: true,
    instrumentationKey: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    samplingRate: 100,
    enableDebugLogging: false
  },
  azureMonitor: {
    enabled: true,
    resourceGroup: "drammen-booking-prod",
    workspaceId: "abc123workspace",
    thresholds: {
      cpu: 80,
      memory: 85,
      errorRate: 100,
      responseTime: 2000
    }
  },
  sentry: {
    enabled: true,
    dsn: "https://1234567@o123456.ingest.sentry.io/1234567",
    environment: "production",
    tracesSampleRate: 0.2
  }
};

const MonitoringPage: React.FC = () => {
  if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du må være systemadministrator for å se overvåknings- og monitoreringsinnstillinger.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-700" />
          Overvåkning & Monitorering
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Konfigurer Application Insights, Azure Monitor, Sentry og sett opp varslingsterskler (f.eks. CPU {'>'} 80%, feil {'>'} 100/min) for proaktiv driftsovervåkning.
          <span title="Gjelder applikasjonsovervåkning, ressursbruk og feilhåndtering."><AlertTriangle className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>

      <Tabs defaultValue="application-insights" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="application-insights">Application Insights</TabsTrigger>
          <TabsTrigger value="azure-monitor">Azure Monitor</TabsTrigger>
          <TabsTrigger value="sentry">Sentry</TabsTrigger>
        </TabsList>

        <TabsContent value="application-insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Application Insights Konfigurasjon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Switch id="ai-enabled" checked={mockMonitoringConfig.applicationInsights.enabled} />
                <Label htmlFor="ai-enabled">Aktiver Application Insights</Label>
              </div>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instrumentation-key">Instrumentasjonsnøkkel</Label>
                  <Input 
                    id="instrumentation-key" 
                    value={mockMonitoringConfig.applicationInsights.instrumentationKey}
                    placeholder="1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sampling-rate">Sampling Rate (%)</Label>
                  <Input 
                    id="sampling-rate" 
                    type="number" 
                    value={mockMonitoringConfig.applicationInsights.samplingRate}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Switch id="debug-logging" checked={mockMonitoringConfig.applicationInsights.enableDebugLogging} />
                  <Label htmlFor="debug-logging">Aktiver debug logging</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="azure-monitor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Azure Monitor & Varslingsterskler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Switch id="am-enabled" checked={mockMonitoringConfig.azureMonitor.enabled} />
                <Label htmlFor="am-enabled">Aktiver Azure Monitor</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-group">Ressursgruppe</Label>
                  <Input 
                    id="resource-group" 
                    value={mockMonitoringConfig.azureMonitor.resourceGroup}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace-id">Workspace ID</Label>
                  <Input 
                    id="workspace-id" 
                    value={mockMonitoringConfig.azureMonitor.workspaceId}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpu-threshold">CPU Terskel (%)</Label>
                    <Input 
                      id="cpu-threshold" 
                      type="number" 
                      value={mockMonitoringConfig.azureMonitor.thresholds.cpu}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory-threshold">Minne Terskel (%)</Label>
                    <Input 
                      id="memory-threshold" 
                      type="number" 
                      value={mockMonitoringConfig.azureMonitor.thresholds.memory}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="error-rate">Feilrate (per min)</Label>
                    <Input 
                      id="error-rate" 
                      type="number" 
                      value={mockMonitoringConfig.azureMonitor.thresholds.errorRate}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response-time">Responstid (ms)</Label>
                    <Input 
                      id="response-time" 
                      type="number" 
                      value={mockMonitoringConfig.azureMonitor.thresholds.responseTime}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Sentry Konfigurasjon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Switch id="sentry-enabled" checked={mockMonitoringConfig.sentry.enabled} />
                <Label htmlFor="sentry-enabled">Aktiver Sentry</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sentry-dsn">Sentry DSN</Label>
                  <Input 
                    id="sentry-dsn" 
                    value={mockMonitoringConfig.sentry.dsn}
                    placeholder="https://[key]@[organization].ingest.sentry.io/[project]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sentry-environment">Miljø</Label>
                  <Input 
                    id="sentry-environment" 
                    value={mockMonitoringConfig.sentry.environment}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traces-sample-rate">Traces Sample Rate</Label>
                  <Input 
                    id="traces-sample-rate" 
                    type="number" 
                    value={mockMonitoringConfig.sentry.tracesSampleRate}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Avbryt</Button>
        <Button>Lagre endringer</Button>
      </div>
    </div>
  );
};

export default MonitoringPage; 