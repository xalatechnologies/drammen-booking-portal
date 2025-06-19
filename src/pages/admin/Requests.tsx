// import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  User,
  Plus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const initialRequests = [
  {
    id: "REQ-2024-001",
    title: "Drammen Idrettshall - Hovedhall",
    requester: "Drammen IL",
    date: "15. februar 2024",
    time: "18:00 - 22:00",
    status: "pending",
    statusText: "Venter på godkjenning",
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
    statusText: "Godkjent",
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
    statusText: "Avvist",
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
    statusText: "Under behandling",
    description: "Bedriftsseminar og workshop",
    priority: "normal",
    submittedDate: "14. februar 2024"
  }
];

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

const RequestsPage = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; request: any | null }>({ open: false, request: null });
  const [newModal, setNewModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    requester: "",
    date: "",
    time: "",
    description: "",
    priority: "normal"
  });

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
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Approve/Reject logic
  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved", statusText: "Godkjent" } : r
      )
    );
    setDetailsModal({ open: false, request: null });
  };
  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected", statusText: "Avvist" } : r
      )
    );
    setDetailsModal({ open: false, request: null });
  };

  // New request logic
  const handleNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `REQ-${new Date().getFullYear()}-${(requests.length + 1).toString().padStart(3, "0")}`;
    setRequests([
      {
        id: nextId,
        ...newRequest,
        status: "pending",
        statusText: "Venter på godkjenning",
        submittedDate: new Date().toLocaleDateString("no-NO"),
      },
      ...requests,
    ]);
    setNewModal(false);
    setNewRequest({
      title: "",
      requester: "",
      date: "",
      time: "",
      description: "",
      priority: "normal"
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">12</p>
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
            <p className="text-2xl font-bold">28</p>
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
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-gray-600">Avvist</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-gray-600">Totalt denne måneden</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-4">
            Alle Forespørsler
          </CardTitle>
          <Button className="gap-2" onClick={() => setNewModal(true)}>
            <Plus className="h-4 w-4" />
            Ny Forespørsel
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1 w-full">
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
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
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
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => setDetailsModal({ open: true, request })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(request.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleReject(request.id)}>
                          <XCircle className="h-4 w-4" />
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
          </DialogHeader>
          {detailsModal.request && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-600">{detailsModal.request.id}</span>
                {getStatusBadge(detailsModal.request.status)}
                {getPriorityBadge(detailsModal.request.priority)}
              </div>
              <div>
                <b>Tittel:</b> {detailsModal.request.title}
              </div>
              <div>
                <b>Forespurt av:</b> {detailsModal.request.requester}
              </div>
              <div>
                <b>Dato:</b> {detailsModal.request.date} {detailsModal.request.time}
              </div>
              <div>
                <b>Sendt:</b> {detailsModal.request.submittedDate}
              </div>
              <div>
                <b>Beskrivelse:</b>
                <div className="mt-1 text-gray-700">{detailsModal.request.description}</div>
              </div>
              {detailsModal.request.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(detailsModal.request.id)}>
                    <CheckCircle className="h-4 w-4" /> Godkjenn
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleReject(detailsModal.request.id)}>
                    <XCircle className="h-4 w-4" /> Avslå
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsModal({ open: false, request: null })}>Lukk</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Request Modal */}
      <Dialog open={newModal} onOpenChange={setNewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ny forespørsel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tittel</label>
              <Input value={newRequest.title} onChange={e => setNewRequest({ ...newRequest, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Forespurt av</label>
              <Input value={newRequest.requester} onChange={e => setNewRequest({ ...newRequest, requester: e.target.value })} required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Dato</label>
                <Input type="date" value={newRequest.date} onChange={e => setNewRequest({ ...newRequest, date: e.target.value })} required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Tid</label>
                <Input type="text" value={newRequest.time} onChange={e => setNewRequest({ ...newRequest, time: e.target.value })} placeholder="f.eks. 18:00 - 22:00" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioritet</label>
              <select className="w-full border rounded px-2 py-1" value={newRequest.priority} onChange={e => setNewRequest({ ...newRequest, priority: e.target.value })}>
                <option value="high">Høy</option>
                <option value="normal">Normal</option>
                <option value="low">Lav</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beskrivelse</label>
              <textarea className="w-full border rounded px-2 py-1" rows={3} value={newRequest.description} onChange={e => setNewRequest({ ...newRequest, description: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setNewModal(false)}>Avbryt</Button>
              <Button type="submit">Opprett forespørsel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsPage;
