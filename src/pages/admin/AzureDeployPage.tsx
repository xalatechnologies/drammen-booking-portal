import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Info, Server, Cloud, RefreshCw, Shield } from "lucide-react";

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

const currentUser = { name: "Admin Bruker", role: "systemadmin" }; // Bytt til 'systemadmin' eller 'superadmin' for full tilgang

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
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du må være systemadministrator for å se og endre Azure/Deploy-innstillinger.</p>
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
    setTimeout(() => setDeploying(false), 1500); // mock
  }

  function handleBackup() {
    setBackupRunning(true);
    setTimeout(() => {
      setBackupHistory([{ date: new Date().toISOString().slice(0, 16).replace('T', ' '), status: "OK" }, ...backupHistory]);
      setBackupRunning(false);
    }, 1500);
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-700" />
          Azure & Deploy
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Administrer miljøer, deployment-strategier og backup for høy tilgjengelighet og sikkerhet. <span title="Gjelder Azure dev/test/prod, blue/green deploy og backup."><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>
      {/* Miljøkonfigurasjon */}
      <Card>
        <CardHeader>
          <CardTitle>Miljøstatus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Velg miljø</label>
              <select value={env} onChange={handleEnvChange} className="border rounded px-3 py-2">
                {MOCK_ENVIRONMENTS.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-700">Status: <span className="font-semibold text-green-700">{MOCK_ENVIRONMENTS.find(e => e.id === env)?.status}</span></span>
              <span className="text-sm text-gray-700">Siste deploy: {MOCK_ENVIRONMENTS.find(e => e.id === env)?.lastDeploy}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Deployment-strategi */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment-strategi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Strategi</label>
              <select value={deploy.strategy} onChange={e => setDeploy({ ...deploy, strategy: e.target.value })} className="border rounded px-3 py-2">
                <option>Blue/Green</option>
                <option>Rolling</option>
                <option>Canary</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-700">Status: <span className="font-semibold text-green-700">{deploy.status}</span></span>
              <span className="text-sm text-gray-700">Siste deploy: {deploy.lastDeploy}</span>
            </div>
            <Button onClick={handleDeploy} disabled={deploying} className="mt-2 md:mt-0">
              <RefreshCw className={deploying ? "animate-spin" : ""} size={18} /> Trigger deploy
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Backup-plan */}
      <Card>
        <CardHeader>
          <CardTitle>Backup-plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Frekvens</label>
              <select value={backup.frequency} onChange={e => setBackup({ ...backup, frequency: e.target.value })} className="border rounded px-3 py-2">
                <option>Daglig</option>
                <option>Ukentlig</option>
                <option>Månedlig</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-700">Siste backup: {backup.lastBackup}</span>
              <span className="text-sm text-gray-700">Retention: {backup.retention}</span>
              <span className="text-sm text-gray-700">Status: <span className="font-semibold text-green-700">{backup.status}</span></span>
            </div>
            <Button onClick={handleBackup} disabled={backupRunning} className="mt-2 md:mt-0">
              <RefreshCw className={backupRunning ? "animate-spin" : ""} size={18} /> Ta backup nå
            </Button>
          </div>
          <div>
            <span className="font-medium">Backup-historikk:</span>
            <ul className="mt-2 text-sm text-gray-700">
              {backupHistory.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  {b.date} <span className={b.status === "OK" ? "text-green-700" : "text-red-700"}>{b.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AzureDeployPage; 