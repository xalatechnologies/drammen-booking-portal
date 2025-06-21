
import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Search, Filter, User, Calendar, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const initialRequests = [
  {
    id: "REQ-2024-001",
    title: "Drammen Idrettshall - Hovedhall",
    requester: "Drammen IL",
    date: "15. februar 2024",
    time: "18:00 - 22:00",
    status: "pending",
    description: "Trening for A-laget i håndball",
    priority: "normal",
    submittedDate: "10. februar 2024"
  },
  {
    id: "REQ-2024-002",
    title: "Brandengen Skole - Gymsal",
    requester: "Bragernes Kulturforening",
    date: "20. februar 2024",
    time: "19:00 - 23:00",
    status: "approved",
    description: "Årsmøte og kulturarrangement",
    priority: "high",
    submittedDate: "8. februar 2024"
  },
  {
    id: "REQ-2024-003",
    title: "Strømsø Samfunnshus - Storhall",
    requester: "Strømsø IL",
    date: "25. februar 2024",
    time: "16:00 - 20:00",
    status: "rejected",
    description: "Fotballtrening for junior",
    priority: "normal",
    submittedDate: "12. februar 2024"
  },
  {
    id: "REQ-2024-004",
    title: "Drammen Kulturhus - Konferanserom A",
    requester: "Tech Startup AS",
    date: "28. februar 2024",
    time: "09:00 - 17:00",
    status: "pending",
    description: "Bedriftsseminar og workshop",
    priority: "normal",
    submittedDate: "14. februar 2024"
  }
];

// Add type definition for a request to resolve linter error
type Request = (typeof initialRequests)[0] & {
    rejectionReason?: string;
};

const statusOptions = [
  { value: "all", label: "Alle statuser" },
  { value: "pending", label: "Venter" },
  { value: "approved", label: "Godkjent" },
  { value: "rejected", label: "Avvist" }
];
const priorityOptions = [
  { value: "all", label: "Alle prioriteter" },
  { value: "high", label: "Høy" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Lav" }
];

const ApprovalWorkflowsPage = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; request: any | null }>({ open: false, request: null });
  const [rejectionReason, setRejectionReason] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Venter</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Godkjent</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Avvist</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">Høy</Badge>;
      case "normal":
        return <Badge variant="secondary" className="text-xs">Normal</Badge>;
      case "low":
        return <Badge variant="outline" className="text-xs">Lav</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">-</Badge>;
    }
  };

  // Filtering logic
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.requester.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved" } : r
      )
    );
    setDetailsModal({ open: false, request: null });
  };
  
  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected", rejectionReason } : r
      )
    );
    setDetailsModal({ open: false, request: null });
    setRejectionReason("");
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-8 w-full p-8">
      <PageHeader 
        title="Forespørsler og Godkjenninger"
        description="Behandle og få oversikt over alle forespørsler for kommunale lokaler."
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-gray-600">Ventende</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{approvedCount}</p>
            <p className="text-sm text-gray-600">Godkjent</p>
          </CardContent>
        </Card>
          <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
            <p className="text-2xl font-bold">{rejectedCount}</p>
            <p className="text-sm text-gray-600">Avvist</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{requests.length}</p>
            <p className="text-sm text-gray-600">Totalt</p>
            </CardContent>
          </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Alle Forespørsler</CardTitle>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Søk i forespørsler..."
                        className="pl-10"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                className="w-full border rounded px-2 py-1"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Prioritet</label>
                            <select
                                className="w-full border rounded px-2 py-1"
                                value={priorityFilter}
                                onChange={e => setPriorityFilter(e.target.value)}
                            >
                                {priorityOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-blue-600">{request.id}</span>
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{request.requester}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{request.date} • {request.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Sendt: {request.submittedDate}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{request.description}</p>
                    {request.status === 'rejected' && request.rejectionReason && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md"><b>Begrunnelse for avslag:</b> {request.rejectionReason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="icon" onClick={() => setDetailsModal({ open: true, request })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === 'pending' && (
                      <>
                        <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700 hover:border-green-400" onClick={() => handleApprove(request.id)}>
                            <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:border-red-400" onClick={() => setDetailsModal({ open: true, request })}>
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <div className="text-center text-gray-500 py-12">Ingen forespørsler funnet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsModal.open} onOpenChange={open => setDetailsModal({ open, request: open ? detailsModal.request : null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detaljer for forespørsel</DialogTitle>
            <DialogDescription>
              {detailsModal.request?.status === 'pending' ? 'Godkjenn eller avslå forespørselen.' : 'Viser detaljer for en behandlet forespørsel.'}
            </DialogDescription>
          </DialogHeader>
          {detailsModal.request && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-600">{detailsModal.request.id}</span>
                {getStatusBadge(detailsModal.request.status)}
                {getPriorityBadge(detailsModal.request.priority)}
              </div>
              <div><b>Tittel:</b> {detailsModal.request.title}</div>
              <div><b>Forespurt av:</b> {detailsModal.request.requester}</div>
              <div><b>Dato:</b> {detailsModal.request.date} {detailsModal.request.time}</div>
              <div><b>Sendt:</b> {detailsModal.request.submittedDate}</div>
              <div>
                <b>Beskrivelse:</b>
                <div className="mt-1 text-gray-700">{detailsModal.request.description}</div>
              </div>

              {detailsModal.request.status === 'pending' && (
                <div>
                  <Label htmlFor="rejection-reason">Begrunnelse for avslag (valgfritt)</Label>
                  <Textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Oppgi en grunn dersom du avslår forespørselen..."
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsModal({ open: false, request: null })}>Lukk</Button>
            {detailsModal.request?.status === 'pending' && (
              <>
                <Button variant="destructive" onClick={() => handleReject(detailsModal.request.id)}>Avslå</Button>
                <Button onClick={() => handleApprove(detailsModal.request.id)}>Godkjenn</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalWorkflowsPage;
