import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Clock,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for initial development
const mockTickets = [
  {
    id: "TICK-2024-001",
    title: "Kan ikke logge inn med BankID",
    requester: "Ole Nordmann",
    status: "open",
    priority: "high",
    category: "Authentication",
    createdAt: "2024-02-15T10:30:00",
    slaDeadline: "2024-02-15T14:30:00",
    assignedTo: "Support Team A",
    description: "Bruker får feilmelding ved BankID innlogging",
  },
  {
    id: "TICK-2024-002",
    title: "Booking forsvant fra systemet",
    requester: "Kari Hansen",
    status: "in_progress",
    priority: "medium",
    category: "Booking",
    createdAt: "2024-02-14T15:20:00",
    slaDeadline: "2024-02-16T15:20:00",
    assignedTo: "Support Team B",
    description: "Bekreftet booking er ikke synlig i oversikten",
  },
  // Add more mock tickets as needed
];

const SupportTicketsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      escalated: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const calculateSLAProgress = (created: string, deadline: string) => {
    const now = new Date().getTime();
    const start = new Date(created).getTime();
    const end = new Date(deadline).getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Henvendelser</h1>
          <p className="text-gray-600 mt-1">
            Håndter support-henvendelser og følg opp SLA
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ny Henvendelse
        </Button>
      </div>

      {/* SLA Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Saker</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Brudd</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Timer className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gjennomsnittlig Responstid</p>
                <p className="text-2xl font-bold">2.5t</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Oppfyllelse</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Timer className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Søk i henvendelser..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statuser</SelectItem>
                <SelectItem value="open">Åpne</SelectItem>
                <SelectItem value="in_progress">Under behandling</SelectItem>
                <SelectItem value="resolved">Løst</SelectItem>
                <SelectItem value="escalated">Eskalert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prioritet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle prioriteter</SelectItem>
                <SelectItem value="high">Høy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Lav</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Flere filtre
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tittel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioritet</TableHead>
                <TableHead>Tildelt</TableHead>
                <TableHead>SLA Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono">{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-gray-500">{ticket.requester}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status === "open" && "Åpen"}
                      {ticket.status === "in_progress" && "Under behandling"}
                      {ticket.status === "resolved" && "Løst"}
                      {ticket.status === "escalated" && "Eskalert"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority === "high" && "Høy"}
                      {ticket.priority === "medium" && "Medium"}
                      {ticket.priority === "low" && "Lav"}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignedTo}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress
                        value={calculateSLAProgress(ticket.createdAt, ticket.slaDeadline)}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.slaDeadline).toLocaleString("nb-NO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketsPage; 