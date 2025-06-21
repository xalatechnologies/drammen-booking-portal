
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Server, Cloud, CheckCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const MOCK_ENVIRONMENTS = [
  { id: "dev", name: "Utvikling", status: "OK", lastDeploy: "2024-06-18 10:00" },
  { id: "test", name: "Test", status: "OK", lastDeploy: "2024-06-17 15:30" },
  { id: "prod", name: "Produksjon", status: "OK", lastDeploy: "2024-06-16 22:00" },
];
const MOCK_DEPLOY = { strategy: "Blue/Green", status: "Idle", lastDeploy: "2024-06-16 22:00" };
const MOCK_BACKUP = { frequency: "Daglig", lastBackup: "2024-06-18 03:00", retention: "30 dager", status: "OK" };
const MOCK_BACKUP_HISTORY = [
  { date: "2024-06-18 03:00", status: "OK" },
  { date: "2024-06-17 03:00", status: "OK" },
  { date: "2024-06-16 03:00", status: "OK" },
];

const currentUser = { name: "Admin Bruker", role: "systemadmin" };

const AzureDeployPage: React.FC = () => {
  const [env, setEnv] = useState("prod");
  const [deploy, setDeploy] = useState(MOCK_DEPLOY);
  const [backup, setBackup] = useState(MOCK_BACKUP);
  const [backupHistory, setBackupHistory] = useState(MOCK_BACKUP_HISTORY);
  const [deploying, setDeploying] = useState(false);
  const [backupRunning, setBackupRunning] = useState(false);

  if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Du må være systemadministrator for å se og endre Azure/Deploy-innstillinger.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handleEnvChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEnv(e.target.value);
  }

  function handleDeploy() {
    setDeploying(true);
    setTimeout(() => setDeploying(false), 1500);
  }

  function handleBackup() {
    setBackupRunning(true);
    setTimeout(() => {
      setBackupHistory([{ date: new Date().toISOString().slice(0, 16).replace('T', ' '), status: "OK" }, ...backupHistory]);
      setBackupRunning(false);
    }, 1500);
  }

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Azure/Deploy"
        description="Administrer Azure-ressurser og deployment-innstillinger for optimal systemdrift"
        actions={
          <Button onClick={handleDeploy} disabled={deploying} size="lg" className="text-base px-6 py-3">
            <RefreshCw className={deploying ? "animate-spin" : ""} size={20} />
            Trigger deploy
          </Button>
        }
      />
      
      {/* Miljøkonfigurasjon */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Miljøstatus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex flex-col gap-3">
              <label className="font-medium text-base text-gray-900">Velg miljø</label>
              <select 
                value={env} 
                onChange={handleEnvChange} 
                className="border-2 rounded-lg px-4 py-3 text-base min-w-[200px] focus:border-blue-500"
              >
                {MOCK_ENVIRONMENTS.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-gray-700">Status:</span>
                <Badge variant="default" className="text-sm">
                  {MOCK_ENVIRONMENTS.find(e => e.id === env)?.status}
                </Badge>
              </div>
              <span className="text-base text-gray-700">
                Siste deploy: {MOCK_ENVIRONMENTS.find(e => e.id === env)?.lastDeploy}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Deployment-strategi */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Deployment-strategi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex flex-col gap-3">
              <label className="font-medium text-base text-gray-900">Strategi</label>
              <select 
                value={deploy.strategy} 
                onChange={e => setDeploy({ ...deploy, strategy: e.target.value })} 
                className="border-2 rounded-lg px-4 py-3 text-base min-w-[200px] focus:border-blue-500"
              >
                <option>Blue/Green</option>
                <option>Rolling</option>
                <option>Canary</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-gray-700">Status:</span>
                <Badge variant="default" className="text-sm">
                  {deploy.status}
                </Badge>
              </div>
              <span className="text-base text-gray-700">
                Siste deploy: {deploy.lastDeploy}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Backup-plan */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Backup-plan</CardTitle>
            <Button onClick={handleBackup} disabled={backupRunning} size="lg" className="text-base px-6 py-3">
              <RefreshCw className={backupRunning ? "animate-spin" : ""} size={20} />
              Ta backup nå
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="font-medium text-base text-gray-900">Frekvens</label>
                <select 
                  value={backup.frequency} 
                  onChange={e => setBackup({ ...backup, frequency: e.target.value })} 
                  className="border-2 rounded-lg px-4 py-3 text-base focus:border-blue-500"
                >
                  <option>Daglig</option>
                  <option>Ukentlig</option>
                  <option>Månedlig</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="text-base text-gray-700">Siste backup: {backup.lastBackup}</div>
                <div className="text-base text-gray-700">Retention: {backup.retention}</div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-700">Status:</span>
                  <Badge variant="default" className="text-sm">
                    {backup.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-medium text-lg text-gray-900">Backup-historikk:</span>
              <ul className="space-y-3">
                {backupHistory.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Cloud className="h-5 w-5 text-blue-500" />
                    <span className="text-base text-gray-700">{b.date}</span>
                    <Badge 
                      variant={b.status === "OK" ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {b.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AzureDeployPage;
