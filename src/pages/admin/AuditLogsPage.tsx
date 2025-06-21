
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const MOCK_LOGS = [
  { id: 1, user: "admin@kommune.no", action: "Opprettet booking", time: "2024-06-18 10:12", ip: "192.168.1.10" },
  { id: 2, user: "bruker1@idporten.no", action: "Endret profil", time: "2024-06-18 10:15", ip: "192.168.1.22" },
  { id: 3, user: "admin@kommune.no", action: "Slettet bruker", time: "2024-06-18 10:20", ip: "192.168.1.10" },
  { id: 4, user: "bruker2@idporten.no", action: "Logget inn", time: "2024-06-18 10:25", ip: "192.168.1.33" },
];

const currentUser = { name: "Admin Bruker", role: "systemadmin" };

const AuditLogsPage: React.FC = () => {
  const [logs] = useState(MOCK_LOGS);
  const [search, setSearch] = useState("");

  function handleExport() {
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
            <CardTitle className="text-2xl">Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Du må være systemadministrator for å se revisjonslogger.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Revisjonslogger"
        description="Se og analyser systemhendelser og brukeraktivitet for å opprettholde sikkerhet og overholdelse"
        actions={
          <Button variant="outline" size="lg" onClick={handleExport} className="text-base px-6 py-3">
            <Download className="w-5 h-5 mr-2" />
            Eksporter til CSV
          </Button>
        }
      />
      
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Logger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Søk på bruker, handling eller IP..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-12 h-12 text-base border-2 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2">
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Bruker</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Handling</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Tidspunkt</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">IP-adresse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <TableCell className="text-base py-6">{log.user}</TableCell>
                    <TableCell className="text-base py-6">{log.action}</TableCell>
                    <TableCell className="text-base py-6">{log.time}</TableCell>
                    <TableCell className="text-base py-6">{log.ip}</TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-16 text-lg">
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
