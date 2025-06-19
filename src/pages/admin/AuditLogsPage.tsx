import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ClipboardList, Info } from "lucide-react";

const MOCK_LOGS = [
  { id: 1, user: "admin@kommune.no", action: "Opprettet booking", time: "2024-06-18 10:12", ip: "192.168.1.10" },
  { id: 2, user: "bruker1@idporten.no", action: "Endret profil", time: "2024-06-18 10:15", ip: "192.168.1.22" },
  { id: 3, user: "admin@kommune.no", action: "Slettet bruker", time: "2024-06-18 10:20", ip: "192.168.1.10" },
  { id: 4, user: "bruker2@idporten.no", action: "Logget inn", time: "2024-06-18 10:25", ip: "192.168.1.33" },
];

const currentUser = { name: "Admin Bruker", role: "systemadmin" }; // Bytt til 'systemadmin' eller 'superadmin' for full tilgang

const AuditLogsPage: React.FC = () => {
  const [logs] = useState(MOCK_LOGS);
  const [search, setSearch] = useState("");

  function handleExport() {
    // Enkel CSV-eksport (mock)
    const csv = [
      "Bruker,Handling,Tidspunkt,IP",
      ...logs.map(l => `${l.user},${l.action},${l.time},${l.ip}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revisjonslogger.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredLogs = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.ip.includes(search)
  );

  if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du må være systemadministrator for å se revisjonslogger.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-blue-700" />
          Revisjonslogger
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Se og eksporter alle handlinger i systemet for GDPR og sikkerhetsrevisjon. <span title="Logger alle endringer og pålogginger."><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Logger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <Input
              placeholder="Søk på bruker, handling eller IP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="outline" onClick={handleExport}>Eksporter til CSV</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bruker</TableHead>
                  <TableHead>Handling</TableHead>
                  <TableHead>Tidspunkt</TableHead>
                  <TableHead>IP-adresse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Ingen logger funnet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage; 