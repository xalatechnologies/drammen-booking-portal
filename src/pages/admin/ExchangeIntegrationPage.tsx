import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RefreshCw, Calendar, Info } from "lucide-react";

const MOCK_ROOMS = [
  { id: "room1", name: "Møterom Oslo", selected: true },
  { id: "room2", name: "Møterom Bergen", selected: false },
  { id: "room3", name: "Møterom Trondheim", selected: true },
];

const ExchangeIntegrationPage: React.FC = () => {
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [syncing, setSyncing] = useState(false);
  const [credentials, setCredentials] = useState({
    clientId: "",
    tenantId: "",
    clientSecret: "",
  });

  function handleRoomToggle(id: string) {
    setRooms(rooms => rooms.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  }

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500); // mock
  }

  function handleCredChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Exchange-integrasjon
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Koble til Microsoft Exchange for å gjøre møterom bookbare i systemet. <span title="Krever Microsoft Graph API-tilgang."><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Microsoft Graph API credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Client ID</label>
              <Input name="clientId" value={credentials.clientId} onChange={handleCredChange} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tenant ID</label>
              <Input name="tenantId" value={credentials.tenantId} onChange={handleCredChange} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Client Secret</label>
              <Input name="clientSecret" value={credentials.clientSecret} onChange={handleCredChange} placeholder="••••••••" type="password" />
            </div>
            <div className="md:col-span-2 flex gap-4 items-center mt-2">
              <Button type="button" variant="outline">Test tilkobling</Button>
              <span className="text-green-700 font-medium">Tilkoblet (mock)</span>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tilgjengelige møterom</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Bookbar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>
                      <input type="checkbox" checked={room.selected} onChange={() => handleRoomToggle(room.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button className="mt-4" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={syncing ? "animate-spin" : ""} size={18} /> Synkroniser møterom
          </Button>
          <div className="mt-2 text-sm text-gray-500">Sist synkronisert: 2024-06-18 12:00 (mock)</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeIntegrationPage; 