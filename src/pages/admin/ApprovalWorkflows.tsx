
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Filter, 
  ChevronDown 
} from "lucide-react";
import { toast } from "sonner";

const ApprovalWorkflowsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("ventende");

  // Sample data for approval requests
  const approvalData = {
    ventende: [
      { id: "AP-3291", facility: "Mjøndalen Skole Gymsal", requestedBy: "Thomas Hansen", date: "20. mai 2025", status: "ventende", urgency: "høy" },
      { id: "AP-3290", facility: "Brandengen Kulturhus", requestedBy: "Maria Olsen", date: "20. mai 2025", status: "ventende", urgency: "medium" },
      { id: "AP-3289", facility: "Strømsø Idrettsanlegg", requestedBy: "Kari Nordmann", date: "19. mai 2025", status: "ventende", urgency: "lav" },
      { id: "AP-3287", facility: "Gulskogen Skole Auditorium", requestedBy: "Per Nilsen", date: "18. mai 2025", status: "ventende", urgency: "medium" },
      { id: "AP-3285", facility: "Åssiden Svømmehall", requestedBy: "Lars Johansen", date: "17. mai 2025", status: "ventende", urgency: "lav" },
    ],
    behandling: [
      { id: "AP-3286", facility: "Drammen Bibliotek Møterom", requestedBy: "Anne Pedersen", date: "17. mai 2025", status: "behandling", assignedTo: "Ola Admin" },
      { id: "AP-3284", facility: "Fjell Samfunnshus", requestedBy: "Jon Olsen", date: "16. mai 2025", status: "behandling", assignedTo: "Ola Admin" },
      { id: "AP-3282", facility: "Konnerud IL Klubbhus", requestedBy: "Silje Berg", date: "15. mai 2025", status: "behandling", assignedTo: "Eva Saksbehandler" },
    ],
    ferdig: [
      { id: "AP-3279", facility: "Drammen Tennisklubb", requestedBy: "Trond Hansen", date: "14. mai 2025", status: "godkjent", completedBy: "Eva Saksbehandler", completedDate: "16. mai 2025" },
      { id: "AP-3276", facility: "Marienlyst Stadion", requestedBy: "Nina Eriksen", date: "12. mai 2025", status: "avslått", completedBy: "Ola Admin", completedDate: "15. mai 2025", reason: "Manglende dokumentasjon" },
      { id: "AP-3275", facility: "Bragernes Kulturscene", requestedBy: "Erik Lund", date: "11. mai 2025", status: "godkjent", completedBy: "Eva Saksbehandler", completedDate: "14. mai 2025" },
    ],
  };

  const handleApprove = (id: string) => {
    toast.success(`Forespørsel ${id} godkjent!`);
  };

  const handleReject = (id: string) => {
    toast.error(`Forespørsel ${id} avslått!`);
  };

  const handleReview = (id: string) => {
    toast.info(`Starter gjennomgang av forespørsel ${id}`);
  };

  // Helper for rendering status badges
  const StatusBadge = ({ status, urgency }: { status: string; urgency?: string }) => {
    if (status === "ventende") {
      const color = urgency === "høy" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : 
                    urgency === "medium" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                    "bg-gray-100 text-gray-800 hover:bg-gray-200";
      return (
        <Badge variant="outline" className={color}>
          <Clock className="h-3 w-3 mr-1" />
          Venter
        </Badge>
      );
    }
    if (status === "behandling") {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Under behandling
        </Badge>
      );
    }
    if (status === "godkjent") {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Godkjent
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Avslått
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Godkjenningsprosesser</h2>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          Filtrer
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Godkjenningsforespørsler</CardTitle>
                <CardDescription>
                  Administrer og behandle forespørsler om tilgang til fasiliteter
                </CardDescription>
              </div>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-sm font-medium">
                {approvalData.ventende.length} ventende
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ventende" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="ventende" className="relative">
                  Ventende
                  {approvalData.ventende.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
                      {approvalData.ventende.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="behandling" className="relative">
                  Under behandling
                  {approvalData.behandling.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
                      {approvalData.behandling.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="ferdig">
                  Ferdigstilte
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ventende" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fasilitet</TableHead>
                      <TableHead>Forespurt av</TableHead>
                      <TableHead>Dato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Handling</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalData.ventende.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.facility}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/placeholder.svg`} alt={item.requestedBy} />
                              <AvatarFallback>{item.requestedBy.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {item.requestedBy}
                          </div>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} urgency={item.urgency} />
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleReview(item.id)}>
                            Vurder
                          </Button>
                          <Button variant="default" size="sm" onClick={() => handleApprove(item.id)}>
                            Godkjenn
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(item.id)}>
                            Avslå
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="behandling" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fasilitet</TableHead>
                      <TableHead>Forespurt av</TableHead>
                      <TableHead>Tildelt til</TableHead>
                      <TableHead>Dato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Handling</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalData.behandling.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.facility}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/placeholder.svg`} alt={item.requestedBy} />
                              <AvatarFallback>{item.requestedBy.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {item.requestedBy}
                          </div>
                        </TableCell>
                        <TableCell>{item.assignedTo}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button variant="default" size="sm" onClick={() => handleApprove(item.id)}>
                            Godkjenn
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(item.id)}>
                            Avslå
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="ferdig" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fasilitet</TableHead>
                      <TableHead>Forespurt av</TableHead>
                      <TableHead>Behandlet av</TableHead>
                      <TableHead>Dato behandlet</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalData.ferdig.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.facility}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/placeholder.svg`} alt={item.requestedBy} />
                              <AvatarFallback>{item.requestedBy.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {item.requestedBy}
                          </div>
                        </TableCell>
                        <TableCell>{item.completedBy}</TableCell>
                        <TableCell>{item.completedDate}</TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Viser {activeTab === "ventende" ? approvalData.ventende.length : 
                     activeTab === "behandling" ? approvalData.behandling.length : 
                     approvalData.ferdig.length} forespørsler
            </div>
            <Button variant="outline" size="sm">
              Eksporter til CSV
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Siste Aktivitet</CardTitle>
              <CardDescription>Nylige handlinger i godkjenningsprosessen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="relative mt-0.5">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-green-500" />
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Forespørsel AP-3279 godkjent</p>
                    <p className="text-xs text-muted-foreground">Behandlet av Eva Saksbehandler • 16. mai 2025</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="relative mt-0.5">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-red-500" />
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Forespørsel AP-3276 avslått</p>
                    <p className="text-xs text-muted-foreground">Behandlet av Ola Admin • 15. mai 2025</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="relative mt-0.5">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-purple-500" />
                    <AlertCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Forespørsel AP-3282 under behandling</p>
                    <p className="text-xs text-muted-foreground">Tildelt til Eva Saksbehandler • 15. mai 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Vis alle aktiviteter</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Godkjenningsstatistikk</CardTitle>
              <CardDescription>Oversikt over godkjenningsprosessene</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Gjennomsnittlig behandlingstid</p>
                    <p className="text-2xl font-bold">2.3 dager</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Ventende godkjenninger</div>
                    <div className="font-medium">{approvalData.ventende.length}</div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-amber-500" style={{ width: '35%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Under behandling</div>
                    <div className="font-medium">{approvalData.behandling.length}</div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-purple-500" style={{ width: '20%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Ferdigstilte denne måneden</div>
                    <div className="font-medium">{approvalData.ferdig.length}</div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-green-500" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Last ned fullstendig rapport
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflowsPage;
