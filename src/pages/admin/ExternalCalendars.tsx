
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, RefreshCw } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

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
      setIcsEvents(MOCK_ICS_EVENTS);
    }
  }

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Eksterne kalendere"
        description="Importer og synkroniser eksterne kalenderhendelser (iCal/ICS, Exchange/Outlook) og blokker tidene i systemet."
      />
      
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-8 h-14 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger 
            value="ics" 
            className="text-base py-3 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            iCal/ICS
          </TabsTrigger>
          <TabsTrigger 
            value="exchange" 
            className="text-base py-3 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Exchange/Outlook
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ics">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Importer ICS-fil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <label className="flex items-center gap-4 cursor-pointer p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <UploadCloud className="h-8 w-8 text-blue-600" />
                  <div>
                    <span className="font-medium text-lg text-gray-900">Last opp ICS-fil</span>
                    {icsFileName && <span className="ml-3 text-gray-500 text-base">{icsFileName}</span>}
                  </div>
                  <Input type="file" accept=".ics" className="hidden" onChange={handleIcsUpload} />
                </label>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-b-2">
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Start</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Slutt</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Tittel</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Sted</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Beskrivelse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {icsEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-16 text-lg">
                            Ingen hendelser funnet i ICS-fil.
                          </TableCell>
                        </TableRow>
                      ) : (
                        icsEvents.map(ev => (
                          <TableRow key={ev.uid} className="hover:bg-blue-50 transition-colors duration-200">
                            <TableCell className="text-base py-6">{ev.start.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell className="text-base py-6">{ev.end.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell className="text-base py-6 font-medium">{ev.summary}</TableCell>
                            <TableCell className="text-base py-6">{ev.location}</TableCell>
                            <TableCell className="text-base py-6">{ev.description}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <Button 
                  className="mt-6 w-fit text-base px-8 py-4"
                  disabled={icsEvents.length === 0}
                  size="lg"
                >
                  Blokker tidene i systemet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exchange">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Exchange/Outlook-synkronisering</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin-slow" />
                  <span className="font-medium text-base">Synkroniserer med Exchange (mock)...</span>
                </div>
                <div className="overflow-x-auto mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-b-2">
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Start</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Slutt</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Emne</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Sted</TableHead>
                        <TableHead className="text-base font-semibold text-gray-900 py-6">Beskrivelse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exchangeEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-16 text-lg">
                            Ingen hendelser funnet fra Exchange.
                          </TableCell>
                        </TableRow>
                      ) : (
                        exchangeEvents.map(ev => (
                          <TableRow key={ev.id} className="hover:bg-blue-50 transition-colors duration-200">
                            <TableCell className="text-base py-6">{ev.start.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell className="text-base py-6">{ev.end.replace("T", " ").replace(":00", "")}</TableCell>
                            <TableCell className="text-base py-6 font-medium">{ev.subject}</TableCell>
                            <TableCell className="text-base py-6">{ev.location}</TableCell>
                            <TableCell className="text-base py-6">{ev.body}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Button className="mt-6 w-fit text-base px-8 py-4" disabled={exchangeEvents.length === 0} size="lg">
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
