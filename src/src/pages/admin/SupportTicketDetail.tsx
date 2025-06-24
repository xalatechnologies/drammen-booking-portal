import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Clock,
  MessageSquare,
  Timer,
  User,
  History,
  AlertTriangle,
} from "lucide-react";
import {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineConnector,
  TimelineContent,
} from "@/components/ui/timeline";

// Mock data for development
const mockTicket = {
  id: "TICK-2024-001",
  title: "Kan ikke logge inn med BankID",
  requester: "Ole Nordmann",
  requesterEmail: "ole.nordmann@example.com",
  status: "in_progress",
  priority: "high",
  category: "Authentication",
  createdAt: "2024-02-15T10:30:00",
  slaDeadline: "2024-02-15T14:30:00",
  assignedTo: "Support Team A",
  description: "Bruker får feilmelding ved BankID innlogging. Har prøvd å logge inn flere ganger uten hell.",
  timeline: [
    {
      id: 1,
      type: "created",
      content: "Henvendelse opprettet",
      timestamp: "2024-02-15T10:30:00",
      user: "System",
    },
    {
      id: 2,
      type: "assigned",
      content: "Tildelt Support Team A",
      timestamp: "2024-02-15T10:35:00",
      user: "System",
    },
    {
      id: 3,
      type: "status_update",
      content: "Status endret til Under behandling",
      timestamp: "2024-02-15T10:40:00",
      user: "Support Agent",
    },
    {
      id: 4,
      type: "comment",
      content: "Har bedt bruker om å sende skjermbilde av feilmeldingen",
      timestamp: "2024-02-15T10:45:00",
      user: "Support Agent",
    },
  ],
};

const SupportTicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [newComment, setNewComment] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(mockTicket.priority);
  const [selectedStatus, setSelectedStatus] = useState(mockTicket.status);

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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "created":
        return <AlertCircle className="h-4 w-4" />;
      case "assigned":
        return <User className="h-4 w-4" />;
      case "status_update":
        return <History className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "escalated":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // TODO: Implement comment addition
    setNewComment("");
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    // TODO: Implement status update
  };

  const handlePriorityChange = (newPriority: string) => {
    setSelectedPriority(newPriority);
    // TODO: Implement priority update
  };

  const handleEscalate = () => {
    // TODO: Implement escalation logic
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="font-mono text-gray-500">{mockTicket.id}</span>
            {mockTicket.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Opprettet av {mockTicket.requester} ({mockTicket.requesterEmail})
          </p>
        </div>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={handleEscalate}
        >
          <AlertTriangle className="h-4 w-4" />
          Eskaler sak
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Ticket Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beskrivelse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{mockTicket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tidslinje</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline>
                {mockTicket.timeline.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineIcon>
                      {getTimelineIcon(event.type)}
                    </TimelineIcon>
                    {index < mockTicket.timeline.length - 1 && <TimelineConnector />}
                    <TimelineContent>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">{event.content}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{event.user}</span>
                          <span>•</span>
                          <span>
                            {new Date(event.timestamp).toLocaleString("nb-NO", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Textarea
                placeholder="Skriv en kommentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                className="self-end gap-2"
                onClick={handleAddComment}
              >
                <MessageSquare className="h-4 w-4" />
                Legg til kommentar
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status og prioritet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Åpen</SelectItem>
                    <SelectItem value="in_progress">Under behandling</SelectItem>
                    <SelectItem value="resolved">Løst</SelectItem>
                    <SelectItem value="escalated">Eskalert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioritet</label>
                <Select value={selectedPriority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Høy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Lav</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SLA Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tidsfrist</span>
                  <span className="font-medium">
                    {new Date(mockTicket.slaDeadline).toLocaleString("nb-NO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <Progress
                  value={calculateSLAProgress(mockTicket.createdAt, mockTicket.slaDeadline)}
                  className="h-2"
                />
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">SLA Parametere</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responstid</span>
                    <span>4 timer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Løsningstid</span>
                    <span>24 timer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prioritet</span>
                    <Badge className={getPriorityColor(selectedPriority)}>
                      {selectedPriority === "high" && "Høy"}
                      {selectedPriority === "medium" && "Medium"}
                      {selectedPriority === "low" && "Lav"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tildeling</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue={mockTicket.assignedTo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support Team A">Support Team A</SelectItem>
                  <SelectItem value="Support Team B">Support Team B</SelectItem>
                  <SelectItem value="Tier 2 Support">Tier 2 Support</SelectItem>
                  <SelectItem value="System Specialists">System Specialists</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetail; 