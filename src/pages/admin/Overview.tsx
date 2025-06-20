import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminRole } from "@/contexts/AdminRoleContext";

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

const mockNotifications = [
  { id: "1", title: "Ny forespørsel om lokale", description: "Brandengen Skole ba om godkjenning", timestamp: "2 minutter siden", read: false },
  { id: "2", title: "Brukerrolle oppdatert", description: "Thomas Hansen er nå administrator", timestamp: "1 time siden", read: false },
  { id: "3", title: "Systemvarsel", description: "Planlagt vedlikehold i kveld kl. 23:00.", timestamp: "4 timer siden", read: true },
  { id: "4", title: "Ny melding mottatt", description: "Du har en ny melding fra Per Olsen.", timestamp: "1 dag siden", read: false },
];

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useAdminRole();

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

  const translateStatus = (status: string) => {
    switch (status) {
      case "high":
        return "Høy";
      case "warning":
        return "Advarsel";
      case "pending":
        return "Venter";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Velkommen! Her er en rask oversikt tilpasset din rolle.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {['saksbehandler', 'admin', 'systemadmin'].includes(currentRole) && (
          <>
            <Card>
              <CardContent className="pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Aktive bookinger</p>
                  <p className="text-2xl font-bold">{mockStats.activeBookings}</p>
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate("/admin/bookings-overview")}>
                  Se alle bookinger →
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ventende forespørsler</p>
                  <p className="text-2xl font-bold">{mockStats.pendingRequests}</p>
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate("/admin/approvals")}>
                  Behandle forespørsler →
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {['admin', 'systemadmin'].includes(currentRole) && (
          <>
            <Card>
              <CardContent className="pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Aktive brukere</p>
                  <p className="text-2xl font-bold">{mockStats.activeUsers}</p>
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate("/admin/users")}>
                  Administrer brukere →
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Åpne support-saker</p>
                  <p className="text-2xl font-bold">{mockStats.openSupportTickets}</p>
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate("/admin/support-tickets")}>
                  Se support-saker →
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {['systemadmin'].includes(currentRole) && (
          <>
            <Card>
              <CardContent className="pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Aktive lokaler</p>
                  <p className="text-2xl font-bold">{mockStats.activeFacilities}</p>
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate("/admin/facilities")}>
                  Se alle lokaler →
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Planlagt vedlikehold</p>
                  <p className="text-2xl font-bold">{mockStats.upcomingMaintenance}</p>
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate("/admin/facilities")}>
                  Se vedlikeholdsplan →
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - visible to all */}
        <Card>
          <CardHeader>
            <CardTitle>Siste aktivitet</CardTitle>
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
                        {translateStatus(activity.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Alerts - only for system admins */}
        {currentRole === 'systemadmin' && (
          <Card>
            <CardHeader>
              <CardTitle>Systemvarsler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3">
                    <div
                      className={`h-2 w-2 rounded-full mt-1.5 ${
                        alert.type === "error" ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtighandlinger</CardTitle>
          <CardDescription>
            Vanlige administrative oppgaver tilpasset din rolle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['saksbehandler', 'admin', 'systemadmin'].includes(currentRole) && (
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center"
                onClick={() => navigate("/admin/facilities")}
              >
                <span>Opprett nytt lokale</span>
              </Button>
            )}
            
            {['admin', 'systemadmin'].includes(currentRole) && (
              <>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => navigate("/admin/support-tickets")}
                >
                  <span>Opprett support-sak</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => navigate("/admin/notifications")}
                >
                  <span>Send melding</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => navigate("/admin/reports")}
                >
                  <span>Generer rapport</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
