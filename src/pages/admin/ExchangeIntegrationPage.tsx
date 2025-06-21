
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RefreshCw, Calendar, Info, CheckCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

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
    setTimeout(() => setSyncing(false), 1500);
  }

  function handleCredChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Exchange-integrasjon"
        description="Koble til Microsoft Exchange for å gjøre møterom bookbare i systemet. Krever Microsoft Graph API-tilgang."
        actions={
          <Button onClick={handleSync} disabled={syncing} size="lg" className="text-base px-6 py-3">
            <RefreshCw className={syncing ? "animate-spin" : ""} size={20} />
            Synkroniser møterom
          </Button>
        }
      />
      
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Microsoft Graph API credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900">Client ID</label>
              <Input 
                name="clientId" 
                value={credentials.clientId} 
                onChange={handleCredChange} 
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900">Tenant ID</label>
              <Input 
                name="tenantId" 
                value={credentials.tenantId} 
                onChange={handleCredChange} 
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="h-12 text-base"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="block text-base font-medium text-gray-900">Client Secret</label>
              <Input 
                name="clientSecret" 
                value={credentials.clientSecret} 
                onChange={handleCredChange} 
                placeholder="••••••••" 
                type="password"
                className="h-12 text-base"
              />
            </div>
            <div className="md:col-span-2 flex gap-4 items-center mt-4">
              <Button type="button" variant="outline" size="lg" className="text-base px-6 py-3">
                Test tilkobling
              </Button>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium text-base">Tilkoblet (mock)</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Tilgjengelige møterom</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2">
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Navn</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Bookbar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map(room => (
                  <TableRow key={room.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <TableCell className="text-base py-6">{room.name}</TableCell>
                    <TableCell className="py-6">
                      <input 
                        type="checkbox" 
                        checked={room.selected} 
                        onChange={() => handleRoomToggle(room.id)}
                        className="w-5 h-5"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 text-base text-gray-500">
            Sist synkronisert: 2024-06-18 12:00 (mock)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeIntegrationPage;
