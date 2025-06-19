import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  Building,
  Bell,
  BarChart3,
  Key,
  ShieldAlert,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for development
const mockStats = {
  activeBookings: 156,
  pendingRequests: 12,
  activeUsers: 1243,
  activeFacilities: 28,
  upcomingMaintenance: 3,
  openSupportTickets: 8,
};

const mockRecentActivity = [
  {
    id: 1,
    type: "booking",
    description: "Ny booking for Drammenshallen",
    user: "Ole Hansen",
    time: "10 min siden",
    status: "pending",
  },
  {
    id: 2,
    type: "support",
    description: "Support-sak: Problemer med adgang",
    user: "Kari Nilsen",
    time: "25 min siden",
    status: "high",
  },
  {
    id: 3,
    type: "system",
    description: "Systemvarsel: Høy CPU-bruk",
    user: "System",
    time: "1 time siden",
    status: "warning",
  },
];

const mockAlerts = [
  {
    id: 1,
    type: "error",
    message: "Feil i integrasjon med SimonsVoss låssystem",
    time: "2 timer siden",
  },
  {
    id: 2,
    type: "warning",
    message: "Drammenshallen nærmer seg kapasitetsgrense for neste uke",
    time: "3 timer siden",
  },
];

const mockUpcomingMaintenance = [
  {
    id: 1,
    facility: "Drammenshallen",
    type: "Rengjøring",
    date: "I morgen, 06:00-08:00",
  },
  {
    id: 2,
    facility: "Galterud gymsal",
    type: "Teknisk vedlikehold",
    date: "23. juni, 12:00-16:00",
  },
];

const Overview: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "pending":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Oversikt
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Oversikt over bookinger, brukere og systemstatus
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aktive bookinger</p>
                <p className="text-2xl font-bold">{mockStats.activeBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-sm"
              onClick={() => navigate("/admin/bookings-overview")}
            >
              Se alle bookinger →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ventende forespørsler</p>
                <p className="text-2xl font-bold">{mockStats.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-sm"
              onClick={() => navigate("/admin/requests")}
            >
              Behandle forespørsler →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aktive brukere</p>
                <p className="text-2xl font-bold">{mockStats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-sm"
              onClick={() => navigate("/admin/users")}
            >
              Administrer brukere →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aktive lokaler</p>
                <p className="text-2xl font-bold">{mockStats.activeFacilities}</p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-sm"
              onClick={() => navigate("/admin/facilities")}
            >
              Se alle lokaler →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Planlagt vedlikehold</p>
                <p className="text-2xl font-bold">{mockStats.upcomingMaintenance}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-sm"
              onClick={() => navigate("/admin/facilities")}
            >
              Se vedlikeholdsplan →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Åpne support-saker</p>
                <p className="text-2xl font-bold">{mockStats.openSupportTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-red-500" />
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-sm"
              onClick={() => navigate("/admin/support-tickets")}
            >
              Se support-saker →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Siste aktivitet</CardTitle>
            <CardDescription>
              Oversikt over nylige hendelser i systemet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hendelse</TableHead>
                  <TableHead>Bruker</TableHead>
                  <TableHead>Tid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.time}</TableCell>
                    <TableCell>
                      <span className={getStatusColor(activity.status)}>
                        ● {activity.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card className="border-red-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Systemvarsler</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {alert.type === "error" ? (
                      <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Planlagt vedlikehold</CardTitle>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingMaintenance.map((maintenance) => (
                  <div
                    key={maintenance.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{maintenance.facility}</p>
                      <p className="text-sm text-gray-600">{maintenance.type}</p>
                      <p className="text-sm text-gray-500">{maintenance.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtighandlinger</CardTitle>
          <CardDescription>
            Vanlige administrative oppgaver
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/admin/facilities")}
            >
              <Building className="h-6 w-6" />
              <span>Opprett nytt lokale</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/admin/support-tickets")}
            >
              <Ticket className="h-6 w-6" />
              <span>Opprett support-sak</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/admin/notifications")}
            >
              <Bell className="h-6 w-6" />
              <span>Send melding</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/admin/reports")}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Generer rapport</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
