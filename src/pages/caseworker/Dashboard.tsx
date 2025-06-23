import React from "react";
import { useLocation } from "react-router-dom";
import CaseworkerHeader from "./CaseworkerHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, LogOut, Building2, Inbox } from "lucide-react";

const mockStats = {
  activeBookings: 156,
  pendingRequests: 12,
};

const mockActivity = [
  { event: "Ny søknad om booking: Drammenshallen", user: "Ole Hansen", time: "10 min siden", status: "Avventer" },
  { event: "Booking godkjent: Svømmehallen", user: "Kari Nilsen", time: "25 min siden", status: "Godkjent" },
  { event: "Booking avvist: Møterom 2", user: "Per Persen", time: "1 time siden", status: "Avvist" },
  { event: "Tildelt ekstra tid: Gymsal", user: "Lise Olsen", time: "2 timer siden", status: "Tildelt" },
  { event: "Endret status på søknad: Klubbhus", user: "Nina Berg", time: "3 timer siden", status: "Endret" },
];

const sidebarNavItems = [
    { href: "/caseworker", title: "Overview", subtitle: "Dashboard og oversikt" },
    { href: "/caseworker/locations", title: "Facilities", subtitle: "Administrer fasiliteter" },
    { href: "/caseworker/bookings", title: "Bookings", subtitle: "Booking oversikt" },
    { href: "/caseworker/approval", title: "Approval Workflows", subtitle: "Godkjenningsprosesser" },
];

const SidebarNavItem = ({ title, subtitle, href, isActive }) => {
  return (
    <a
      href={href}
      className={`flex flex-col px-4 py-3 rounded-lg relative transition-colors duration-200 ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      {isActive && <div className="w-1 h-8 bg-blue-600 absolute left-0 top-1/2 -translate-y-1/2 rounded-r-md"></div>}
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-xs text-gray-500">{subtitle}</span>
    </a>
  );
};

const CaseworkerSidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-72 bg-white border-r flex flex-col fixed top-0 left-0 h-full z-10 pt-20">
      <nav className="flex-1 p-4 space-y-1">
        {sidebarNavItems.map(item => (
          <SidebarNavItem 
            key={item.href}
            {...item}
            isActive={location.pathname === item.href || (item.href !== "/caseworker" && location.pathname.startsWith(item.href))}
          />
        ))}
      </nav>
    </aside>
  );
};

const CaseworkerDashboard = () => {
  return (
    <div className="flex bg-gray-50">
      <CaseworkerSidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <CaseworkerHeader />
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="mb-6 text-muted-foreground">Velkommen! Her er en rask oversikt tilpasset din rolle.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Aktive bookinger</div>
                <div className="text-3xl font-bold">{mockStats.activeBookings}</div>
                <Button variant="link" className="mt-2 p-0 h-auto text-blue-600" asChild><a href="/caseworker/bookings">Se alle bookinger &rarr;</a></Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Ventende forespørsler</div>
                <div className="text-3xl font-bold">{mockStats.pendingRequests}</div>
                <Button variant="link" className="mt-2 p-0 h-auto text-blue-600" asChild><a href="/caseworker/applications">Behandle forespørsler &rarr;</a></Button>
              </CardContent>
            </Card>
          </div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Siste aktivitet</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                  {mockActivity.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.event}</TableCell>
                      <TableCell>{row.user}</TableCell>
                      <TableCell className="text-muted-foreground">{row.time}</TableCell>
                      <TableCell>
                        {row.status === "Avventer" && <Badge variant="secondary">Avventer</Badge>}
                        {row.status === "Godkjent" && <Badge variant="secondary" style={{color:'#22c55e'}}>Godkjent</Badge>}
                        {row.status === "Avvist" && <Badge variant="destructive">Avvist</Badge>}
                        {row.status === "Tildelt" && <Badge variant="outline" style={{borderColor:'#22c55e', color:'#22c55e'}}>Tildelt</Badge>}
                        {row.status === "Endret" && <Badge variant="outline">Endret</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hurtighandlinger</CardTitle>
              <CardDescription>Vanlige administrative oppgaver tilpasset din rolle</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Opprett nytt lokale</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CaseworkerDashboard; 