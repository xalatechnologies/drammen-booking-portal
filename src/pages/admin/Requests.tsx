
import React from "react";
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

const RequestsPage = () => {
  const requests = [
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Forespørsler</h1>
          <p className="text-gray-600 mt-1">Administrer alle booking-forespørsler</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ny Forespørsel
        </Button>
      </div>

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

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Søk i forespørsler..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Forespørsler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
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
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsPage;
