import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, RefreshCw } from "lucide-react";

// Eksempel på ICS-hendelser (mocket)
const MOCK_ICS_EVENTS = [
  {
    uid: "1234567890@example.com",
    start: "2025-06-26T16:00:00",
    end: "2025-06-26T18:00:00",
    summary: "Ekstern booking - Hovedhall",
    description: "Ekstern booking fra idrettslag",
    location: "Brandengen Skole - Gymsal",
  },
  {
    uid: "0987654321@example.com",
    start: "2025-06-27T10:00:00",
    end: "2025-06-27T12:00:00",
    summary: "Ekstern booking - Møte",
    description: "Ekstern booking fra kommune",
    location: "Fjell Skole - Aktivitetshall",
  },
];

// Eksempel på Exchange-hendelser (mocket)
const MOCK_EXCHANGE_EVENTS = [
  {
    id: "ex-1",
    start: "2025-06-29T14:00:00",
    end: "2025-06-29T16:00:00",
    subject: "Outlook booking - Fotballhall",
    body: "Booking fra Outlook-kalender",
    location: "Åssiden Fotballhall",
  },
  {
    id: "ex-2",
    start: "2025-06-29T15:00:00",
    end: "2025-06-29T17:00:00",
    subject: "Outlook booking - Møte",
    body: "Booking fra Exchange-kalender",
    location: "Brandengen Skole - Gymsal",
  },
];

const ExternalCalendars: React.FC = () => {
  const [tab, setTab] = useState("ics");
  const [icsEvents, setIcsEvents] = useState(MOCK_ICS_EVENTS);
  const [exchangeEvents] = useState(MOCK_EXCHANGE_EVENTS);
  const [icsFileName, setIcsFileName] = useState<string | null>(null);

  // Simulert filopplasting
  function handleIcsUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setIcsFileName(e.target.files[0].name);
      // Her ville man normalt parse ICS-filen og oppdatere icsEvents
      setIcsEvents(MOCK_ICS_EVENTS); // mock
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Eksterne kalendere
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Importer og synkroniser eksterne kalenderhendelser (iCal/ICS, Exchange/Outlook) og blokker tidene i systemet.
        </p>
      </header>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="ics">iCal/ICS</TabsTrigger>
          <TabsTrigger value="exchange">Exchange/Outlook</TabsTrigger>
        </TabsList>
        <TabsContent value="ics">
          <Card>
            <CardHeader>
              <CardTitle>Importer ICS-fil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <UploadCloud className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">Last opp ICS-fil</span>
                  <Input type="file" accept=".ics" className="hidden" onChange={handleIcsUpload} />
                  {icsFileName && <span className="ml-2 text-gray-500">{icsFileName}</span>}
                </label>
                <div className="overflow-x-auto mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Start</TableHead>
                        <TableHead>Slutt</TableHead>
                        <TableHead>Tittel</TableHead>
                        <TableHead>Sted</TableHead>
                        <TableHead>Beskrivelse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {icsEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            Ingen hendelser funnet i ICS-fil.
                          </TableCell>
                        </TableRow>
                      ) : (
                        icsEvents.map(ev => (
                          <TableRow key={ev.uid}>
                            <TableCell>{ev.start.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell>{ev.end.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell>{ev.summary}</TableCell>
                            <TableCell>{ev.location}</TableCell>
                            <TableCell>{ev.description}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Button className="mt-4 w-fit" disabled={icsEvents.length === 0}>
                  Blokker tidene i systemet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exchange">
          <Card>
            <CardHeader>
              <CardTitle>Exchange/Outlook-synkronisering</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin-slow" />
                  <span className="font-medium">Synkroniserer med Exchange (mock)...</span>
                </div>
                <div className="overflow-x-auto mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Start</TableHead>
                        <TableHead>Slutt</TableHead>
                        <TableHead>Emne</TableHead>
                        <TableHead>Sted</TableHead>
                        <TableHead>Beskrivelse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exchangeEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            Ingen hendelser funnet fra Exchange.
                          </TableCell>
                        </TableRow>
                      ) : (
                        exchangeEvents.map(ev => (
                          <TableRow key={ev.id}>
                            <TableCell>{ev.start.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell>{ev.end.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell>{ev.subject}</TableCell>
                            <TableCell>{ev.location}</TableCell>
                            <TableCell>{ev.body}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Button className="mt-4 w-fit" disabled={exchangeEvents.length === 0}>
                  Blokker tidene i systemet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExternalCalendars; 