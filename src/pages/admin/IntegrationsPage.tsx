
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Key, Link2, Mail, Phone, Info, Briefcase, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/admin/PageHeader";

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
  { id: "exchange", name: "Microsoft Exchange", icon: Briefcase, status: "Aktiv", path: "/admin/integrations/exchange" },
];

const IntegrationsPage: React.FC = () => {
  const [apiKeys] = useState(MOCK_API_KEYS);
  const [webhooks] = useState(MOCK_WEBHOOKS);
  const [services] = useState(MOCK_SERVICES);
  const navigate = useNavigate();

  const handleServiceClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Integrasjoner"
        description="Administrer API-nøkler, webhooks og eksterne tjenester. Støttede tjenester: Sendinblue, Twilio, Aktørregister."
      />
      
      {/* API-nøkler */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">API-nøkler</CardTitle>
            <Button size="lg" className="text-base px-6 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Opprett ny nøkkel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2">
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Navn</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Nøkkel</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Status</TableHead>
                  <TableHead className="w-32 text-base font-semibold text-gray-900 py-6">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map(key => (
                  <TableRow key={key.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <TableCell className="text-base py-6 font-medium">{key.name}</TableCell>
                    <TableCell className="py-6">
                      <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">{key.value}</span>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge 
                        variant={key.active ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        {key.active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      <Button size="sm" variant="outline" className="text-sm px-4 py-2">
                        Deaktiver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Webhooks */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Webhooks</CardTitle>
            <Button size="lg" className="text-base px-6 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Legg til webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2">
                  <TableHead className="text-base font-semibold text-gray-900 py-6">URL</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Event</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Status</TableHead>
                  <TableHead className="w-32 text-base font-semibold text-gray-900 py-6">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map(wh => (
                  <TableRow key={wh.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <TableCell className="text-base py-6">{wh.url}</TableCell>
                    <TableCell className="text-base py-6">{wh.event}</TableCell>
                    <TableCell className="py-6">
                      <Badge 
                        variant={wh.active ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        {wh.active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      <Button size="sm" variant="outline" className="text-sm px-4 py-2">
                        Test
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Eksterne tjenester */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Eksterne tjenester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(svc => (
              <div 
                key={svc.id} 
                className={`border-2 rounded-xl p-6 flex flex-col gap-4 bg-white hover:shadow-lg transition-all duration-300 ${
                  svc.path ? 'cursor-pointer hover:border-blue-500 hover:shadow-blue-100' : ''
                }`}
                onClick={() => handleServiceClick(svc.path)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svc.icon className="h-6 w-6 text-blue-700" />
                  </div>
                  <span className="font-semibold text-xl text-gray-900">{svc.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-base text-gray-700">
                    Status: 
                    <Badge 
                      variant={svc.status === "Aktiv" ? "default" : "secondary"}
                      className="ml-2 text-sm"
                    >
                      {svc.status}
                    </Badge>
                  </div>
                  {svc.apiUrl && (
                    <div className="text-sm text-gray-500 break-all">
                      API-url: {svc.apiUrl}
                    </div>
                  )}
                  {svc.token && (
                    <div className="text-sm text-gray-500">
                      Token: {svc.token}
                    </div>
                  )}
                </div>
                {!svc.path && (
                  <Button size="sm" variant="outline" className="mt-4 text-sm">
                    Test tilkobling
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage;
