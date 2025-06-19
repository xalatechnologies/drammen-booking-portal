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
  Search,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApprovalRequest {
  id: string;
  facility: string;
  requestedBy: string;
  date: string;
  status: "ventende" | "behandling" | "godkjent" | "avslått";
  urgency?: "høy" | "medium" | "lav";
  facilityType?: string;
  details?: {
    type: string;
    duration: string;
    participants: number;
    purpose: string;
  };
  assignedTo?: string;
  completedBy?: string;
  completedDate?: string;
  reason?: string;
}

const ApprovalWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewDecision, setReviewDecision] = useState<"approve" | "reject" | null>(null);

  // Sample data for approval requests - now in a single array
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([
    { id: "AP-3291", facility: "Mjøndalen Skole Gymsal", requestedBy: "Thomas Hansen", date: "20. mai 2025", status: "ventende", urgency: "høy", facilityType: "Gymsal", details: { type: "Engangslån", duration: "2 timer", participants: 25, purpose: "Håndballtrening" } },
    { id: "AP-3290", facility: "Brandengen Kulturhus", requestedBy: "Maria Olsen", date: "20. mai 2025", status: "ventende", urgency: "medium" },
    { id: "AP-3289", facility: "Strømsø Idrettsanlegg", requestedBy: "Kari Nordmann", date: "19. mai 2025", status: "ventende", urgency: "lav" },
    { id: "AP-3286", facility: "Drammen Bibliotek Møterom", requestedBy: "Anne Pedersen", date: "17. mai 2025", status: "behandling", assignedTo: "Ola Admin" },
    { id: "AP-3284", facility: "Fjell Samfunnshus", requestedBy: "Jon Olsen", date: "16. mai 2025", status: "behandling", assignedTo: "Ola Admin" },
    { id: "AP-3279", facility: "Drammen Tennisklubb", requestedBy: "Trond Hansen", date: "14. mai 2025", status: "godkjent", completedBy: "Eva Saksbehandler", completedDate: "16. mai 2025" },
    { id: "AP-3276", facility: "Marienlyst Stadion", requestedBy: "Nina Eriksen", date: "12. mai 2025", status: "avslått", completedBy: "Ola Admin", completedDate: "15. mai 2025", reason: "Manglende dokumentasjon" },
  ]);

  const handleApprove = (id: string) => {
    const request = approvalRequests.find(r => r.id === id);
    if (request) {
      const updatedRequests = approvalRequests.map(r => {
        if (r.id === id) {
          const updatedRequest: ApprovalRequest = {
            ...r,
            status: "godkjent",
            completedBy: "Ola Admin",
            completedDate: new Date().toLocaleDateString("no")
          };
          return updatedRequest;
        }
        return r;
      });
      setApprovalRequests(updatedRequests);
    }
  };

  const handleReject = (id: string) => {
    const request = approvalRequests.find(r => r.id === id);
    if (request) {
      const updatedRequests = approvalRequests.map(r => {
        if (r.id === id) {
          const updatedRequest: ApprovalRequest = {
            ...r,
            status: "avslått",
            completedBy: "Ola Admin",
            completedDate: new Date().toLocaleDateString("no"),
            reason: reviewNotes || "Ingen begrunnelse oppgitt"
          };
          return updatedRequest;
        }
        return r;
      });
      setApprovalRequests(updatedRequests);
    }
  };

  const handleReview = (id: string) => {
    const request = approvalRequests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setReviewModalOpen(true);
    }
  };

  const handleSubmitReview = () => {
    if (!selectedRequest || !reviewDecision) return;

    if (reviewDecision === "approve") {
      handleApprove(selectedRequest.id);
    } else {
      handleReject(selectedRequest.id);
    }

    setReviewModalOpen(false);
    setSelectedRequest(null);
    setReviewNotes("");
    setReviewDecision(null);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Fasilitet", "Forespurt av", "Dato", "Status", "Hastegrad"];
    const csvContent = [
      headers.join(","),
      ...approvalRequests.map(item => [
        item.id,
        item.facility,
        item.requestedBy,
        item.date,
        item.status,
        item.urgency || "-"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `godkjenninger_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Filter functionality
  const filteredRequests = approvalRequests.filter(item => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm) ||
      item.facility.toLowerCase().includes(searchTerm) ||
      item.requestedBy.toLowerCase().includes(searchTerm) ||
      (item.completedBy?.toLowerCase() || "").includes(searchTerm) ||
      (item.assignedTo?.toLowerCase() || "").includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || item.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

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
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Godkjenningsprosesser</h2>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vurder forespørsel {selectedRequest?.id}</DialogTitle>
            <DialogDescription>
              Gjennomgå detaljer og ta en beslutning
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fasilitet</Label>
                  <p className="mt-1">{selectedRequest.facility}</p>
                </div>
                <div>
                  <Label>Forespurt av</Label>
                  <p className="mt-1">{selectedRequest.requestedBy}</p>
                </div>
                {selectedRequest.details && (
                  <>
                    <div>
                      <Label>Type booking</Label>
                      <p className="mt-1">{selectedRequest.details.type}</p>
                    </div>
                    <div>
                      <Label>Varighet</Label>
                      <p className="mt-1">{selectedRequest.details.duration}</p>
                    </div>
                    <div>
                      <Label>Antall deltakere</Label>
                      <p className="mt-1">{selectedRequest.details.participants}</p>
                    </div>
                    <div>
                      <Label>Formål</Label>
                      <p className="mt-1">{selectedRequest.details.purpose}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label>Vurderingsnotat</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Skriv inn eventuelle kommentarer eller begrunnelse..."
                />
              </div>
              <div className="space-y-2">
                <Label>Beslutning</Label>
                <div className="flex gap-4">
                  <Button
                    variant={reviewDecision === "approve" ? "default" : "outline"}
                    onClick={() => setReviewDecision("approve")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Godkjenn
                  </Button>
                  <Button
                    variant={reviewDecision === "reject" ? "destructive" : "outline"}
                    onClick={() => setReviewDecision("reject")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Avslå
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
              Avbryt
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={!reviewDecision}
            >
              Lagre beslutning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full">
        <CardHeader className="bg-gray-50 border-b border-gray-300 rounded-t-lg pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Godkjenningsforespørsler
          </CardTitle>
          <CardDescription className="text-base text-gray-700 leading-relaxed">
            Administrer og behandle forespørsler om tilgang til fasiliteter
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="relative flex-grow">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" 
                aria-hidden="true" 
              />
              <Input
                type="search"
                placeholder="Søk i forespørsler..."
                className="pl-12 h-12 text-base border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statuser</SelectItem>
                <SelectItem value="ventende">Ventende</SelectItem>
                <SelectItem value="behandling">Under behandling</SelectItem>
                <SelectItem value="godkjent">Godkjent</SelectItem>
                <SelectItem value="avslått">Avslått</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Hastegrad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle hastegrader</SelectItem>
                <SelectItem value="høy">Høy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="lav">Lav</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border-2 border-gray-300 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fasilitet</TableHead>
                  <TableHead>Forespurt av</TableHead>
                  <TableHead>Dato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Behandlet av</TableHead>
                  <TableHead className="text-right">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-600">
                      <div className="flex flex-col items-center space-y-4">
                        <Search className="h-12 w-12 text-gray-400" aria-hidden="true" />
                        <p className="text-lg font-medium">Ingen forespørsler funnet</p>
                        <p className="text-base text-gray-500">Prøv å endre søkekriteriene eller filteret</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{request.facility}</div>
                          {request.facilityType && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {request.facilityType}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`/placeholder.svg`} alt={request.requestedBy} />
                            <AvatarFallback>{request.requestedBy.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {request.requestedBy}
                        </div>
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} urgency={request.urgency} />
                      </TableCell>
                      <TableCell>
                        {request.completedBy || request.assignedTo || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {(request.status === "ventende" || request.status === "behandling") && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleReview(request.id)}>
                                Vurder
                              </Button>
                              <Button variant="default" size="sm" onClick={() => handleApprove(request.id)}>
                                Godkjenn
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleReject(request.id)}>
                                Avslå
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-200 p-6">
          <div className="text-sm text-muted-foreground">
            Viser {filteredRequests.length} forespørsler
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            Eksporter til CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApprovalWorkflowsPage;
