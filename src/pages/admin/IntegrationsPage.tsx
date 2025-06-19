import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Activity, Key, Link2, Mail, Phone, Info } from "lucide-react";

const MOCK_API_KEYS = [
  { id: "key1", name: "Frontend", value: "sk_live_1234...abcd", active: true },
  { id: "key2", name: "Integrasjonspartner", value: "sk_live_5678...efgh", active: false },
];
const MOCK_WEBHOOKS = [
  { id: "wh1", url: "https://webhook.site/abc", event: "booking.created", active: true },
  { id: "wh2", url: "https://webhook.site/xyz", event: "user.suspended", active: false },
];
const MOCK_SERVICES = [
  { id: "sendinblue", name: "Sendinblue", icon: Mail, status: "Aktiv", apiUrl: "https://api.sendinblue.com/v3", token: "••••••••" },
  { id: "twilio", name: "Twilio", icon: Phone, status: "Inaktiv", apiUrl: "https://api.twilio.com", token: "••••••••" },
  { id: "aktorregister", name: "Aktørregister", icon: Link2, status: "Aktiv", apiUrl: "https://api.aktorregister.no", token: "••••••••" },
];

const IntegrationsPage: React.FC = () => {
  const [apiKeys] = useState(MOCK_API_KEYS);
  const [webhooks] = useState(MOCK_WEBHOOKS);
  const [services] = useState(MOCK_SERVICES);

  return (
    <div className="space-y-10 max-w-5xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-700" />
          Integrasjoner
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Administrer API-nøkler, webhooks og eksterne tjenester. <span title="Støttede tjenester: Sendinblue, Twilio, Aktørregister."><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>
      {/* API-nøkler */}
      <Card>
        <CardHeader>
          <CardTitle>API-nøkler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Nøkkel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map(key => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell><span className="font-mono text-xs">{key.value}</span></TableCell>
                    <TableCell>{key.active ? <span className="text-green-700 font-semibold">Aktiv</span> : <span className="text-gray-500">Inaktiv</span>}</TableCell>
                    <TableCell><Button size="sm" variant="outline">Deaktiver</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button className="mt-4">Opprett ny nøkkel</Button>
        </CardContent>
      </Card>
      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map(wh => (
                  <TableRow key={wh.id}>
                    <TableCell>{wh.url}</TableCell>
                    <TableCell>{wh.event}</TableCell>
                    <TableCell>{wh.active ? <span className="text-green-700 font-semibold">Aktiv</span> : <span className="text-gray-500">Inaktiv</span>}</TableCell>
                    <TableCell><Button size="sm" variant="outline">Test</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button className="mt-4">Legg til webhook</Button>
        </CardContent>
      </Card>
      {/* Eksterne tjenester */}
      <Card>
        <CardHeader>
          <CardTitle>Eksterne tjenester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(svc => (
              <div key={svc.id} className="border rounded-lg p-4 flex flex-col gap-2 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <svc.icon className="h-6 w-6 text-blue-700" />
                  <span className="font-semibold text-lg">{svc.name}</span>
                </div>
                <div className="text-sm text-gray-700">Status: <span className={svc.status === "Aktiv" ? "text-green-700 font-semibold" : "text-gray-500"}>{svc.status}</span></div>
                <div className="text-xs text-gray-500">API-url: {svc.apiUrl}</div>
                <div className="text-xs text-gray-500">Token: {svc.token}</div>
                <Button size="sm" variant="outline" className="mt-2">Test tilkobling</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage; 