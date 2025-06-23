import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Search, Info } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const mockHistory = [
  {
    id: 1,
    user: "Kari Hansen",
    userId: "u-123",
    userAvatar: "https://i.pravatar.cc/150?u=kari",
    role: "Paraplyadmin",
    action: "Endret tildeling fra Drammen Turn til Åssiden IF",
    organization: "Drammen Idrettsråd",
    location: "Drammenshallen",
    timestamp: "2025-06-20 12:45",
    type: "Manuell",
    ip: "192.168.1.10",
    prevValue: "Drammen Turn, 2 timer",
    newValue: "Åssiden IF, 2 timer",
    technical: "Endring utført via webgrensesnitt",
  },
  {
    id: 2,
    user: "System",
    userId: "system",
    userAvatar: "",
    role: "System",
    action: "Rammetid generert for sesong 2025",
    organization: "-",
    location: "-",
    timestamp: "2025-06-01 08:00",
    type: "System",
    ip: "-",
    prevValue: "-",
    newValue: "Rammetid opprettet",
    technical: "Automatisk generering av rammetid for alle klubber",
  },
  {
    id: 3,
    user: "Ola Nordmann",
    userId: "u-456",
    userAvatar: "https://i.pravatar.cc/150?u=ola",
    role: "Tildelingsansvarlig",
    action: "Varslet Åssiden IF om endret tildeling",
    organization: "Drammen IF",
    location: "Åssidenhallen",
    timestamp: "2025-06-20 13:00",
    type: "Manuell",
    ip: "192.168.1.22",
    prevValue: "Tildeling: 1 time",
    newValue: "Tildeling: 2 timer",
    technical: "Varsel sendt via systemets meldingsmodul",
  },
  {
    id: 4,
    user: "System",
    userId: "system",
    userAvatar: "",
    role: "System",
    action: "Feil ved synkronisering mot ekstern kalender",
    organization: "-",
    location: "-",
    timestamp: "2025-06-21 09:15",
    type: "System",
    ip: "-",
    prevValue: "-",
    newValue: "-",
    technical: "HTTP 500 fra Exchange API",
  },
];

const mockRoles = ["Alle roller", "Paraplyadmin", "Tildelingsansvarlig", "System"];
const mockTypes = ["Alle typer", "Manuell", "System"];
const mockOrgs = ["Alle organisasjoner", "Drammen Idrettsråd", "Drammen IF", "Åssiden IF"];
const mockLocations = ["Alle lokasjoner", "Drammenshallen", "Åssidenhallen"];

const HistoryLogPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Alle roller");
  const [filterType, setFilterType] = useState("Alle typer");
  const [filterOrg, setFilterOrg] = useState("Alle organisasjoner");
  const [filterLocation, setFilterLocation] = useState("Alle lokasjoner");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterFromTime, setFilterFromTime] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToTime, setFilterToTime] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  // Helper to combine date and time
  function combineDateTime(date: string, time: string) {
    if (!date) return "";
    return time ? `${date} ${time}` : `${date} 00:00`;
  }

  // Filtering logic
  const filtered = mockHistory.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.role.toLowerCase().includes(search.toLowerCase()) ||
      entry.organization.toLowerCase().includes(search.toLowerCase()) ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.location.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "Alle roller" || entry.role === filterRole;
    const matchesType = filterType === "Alle typer" || entry.type === filterType;
    const matchesOrg = filterOrg === "Alle organisasjoner" || entry.organization === filterOrg;
    const matchesLoc = filterLocation === "Alle lokasjoner" || entry.location === filterLocation;
    // Dato/tid filter
    let matchesFrom = true;
    let matchesTo = true;
    if (filterFromDate) {
      const from = combineDateTime(filterFromDate, filterFromTime);
      matchesFrom = entry.timestamp >= from;
    }
    if (filterToDate) {
      const to = combineDateTime(filterToDate, filterToTime || "23:59");
      matchesTo = entry.timestamp <= to;
    }
    return matchesSearch && matchesRole && matchesType && matchesOrg && matchesLoc && matchesFrom && matchesTo;
  });

  // Mock export function
  const handleExport = (type: "csv" | "excel") => {
    alert(`Eksportert som ${type.toUpperCase()} (mock)`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("umbrella.historyLog.title", undefined, "Historikk og Logg")}
        description={t(
          "umbrella.historyLog.description",
          undefined,
          "Se historikk over alle endringer og aktiviteter"
        )}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}> <Download className="mr-2 h-4 w-4" /> Last ned CSV </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}> <Download className="mr-2 h-4 w-4" /> Last ned Excel </Button>
          </div>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>{t("umbrella.historyLog.activityLog", undefined, "Aktivitetslogg")}</CardTitle>
          <CardDescription>
            {t(
              "umbrella.historyLog.activityLogDescription",
              undefined,
              "Detaljert oversikt over alle systemaktivitetene"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter/search row */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <Input
              placeholder="Søk på bruker, rolle, organisasjon, handling, lokasjon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Rolle" /></SelectTrigger>
              <SelectContent>
                {mockRoles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {mockTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Organisasjon" /></SelectTrigger>
              <SelectContent>
                {mockOrgs.map((org) => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Lokasjon" /></SelectTrigger>
              <SelectContent>
                {mockLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Improved date/time filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Periode:</label>
              <div className="flex gap-1 items-center">
                <Input type="date" value={filterFromDate} onChange={e => setFilterFromDate(e.target.value)} className="w-[130px]" placeholder="Fra dato" />
                <Input type="time" value={filterFromTime} onChange={e => setFilterFromTime(e.target.value)} className="w-[110px]" placeholder="Fra tid" />
                <span className="mx-1 text-gray-400">–</span>
                <Input type="date" value={filterToDate} onChange={e => setFilterToDate(e.target.value)} className="w-[130px]" placeholder="Til dato" />
                <Input type="time" value={filterToTime} onChange={e => setFilterToTime(e.target.value)} className="w-[110px]" placeholder="Til tid" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bruker</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Handling</TableHead>
                  <TableHead>Organisasjon</TableHead>
                  <TableHead>Lokasjon</TableHead>
                  <TableHead>Tidspunkt</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLog(entry)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {entry.userAvatar ? <AvatarImage src={entry.userAvatar} /> : <AvatarFallback>{entry.user.substring(0, 2)}</AvatarFallback>}
                        </Avatar>
                        <span>{entry.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>{entry.role}</TableCell>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>{entry.organization}</TableCell>
                    <TableCell>{entry.location}</TableCell>
                    <TableCell>{entry.timestamp}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell><Info className="h-4 w-4 text-gray-400" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Modal for log details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Detaljer for hendelse</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedLog(null)}>×</Button>
            </div>
            <div className="space-y-2 text-sm">
              <div><b>Bruker:</b> {selectedLog.user} ({selectedLog.userId})</div>
              <div><b>Rolle:</b> {selectedLog.role}</div>
              <div><b>Organisasjon:</b> {selectedLog.organization}</div>
              <div><b>Lokasjon:</b> {selectedLog.location}</div>
              <div><b>Tidspunkt:</b> {selectedLog.timestamp}</div>
              <div><b>Type:</b> {selectedLog.type}</div>
              <div><b>IP-adresse:</b> {selectedLog.ip}</div>
              <div><b>Handling:</b> {selectedLog.action}</div>
              <div><b>Tidligere verdi:</b> {selectedLog.prevValue}</div>
              <div><b>Ny verdi:</b> {selectedLog.newValue}</div>
              <div><b>Teknisk info:</b> {selectedLog.technical}</div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setSelectedLog(null)}>Lukk</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryLogPage;
