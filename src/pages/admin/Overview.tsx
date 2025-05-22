
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip, 
  Legend 
} from "recharts";
import { ChartBarIcon } from "lucide-react";

const OverviewPage = () => {
  // Sample data for the overview page
  const statsData = [
    { name: "Totalt Antall Fasiliteter", value: 124 },
    { name: "Ventende Godkjenninger", value: 18 },
    { name: "Aktive Brukere", value: 543 },
  ];

  const chartData = [
    { month: "Jan", bookings: 65, approvals: 28 },
    { month: "Feb", bookings: 59, approvals: 25 },
    { month: "Mar", bookings: 80, approvals: 36 },
    { month: "Apr", bookings: 81, approvals: 32 },
    { month: "May", bookings: 56, approvals: 24 },
    { month: "Jun", bookings: 55, approvals: 20 },
  ];

  // Fixed chart config to match expected type
  const chartConfig = {
    bookings: { label: "Bookinger", color: "#4f46e5" },
    approvals: { label: "Godkjenninger", color: "#10b981" },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashbord Oversikt</h2>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Content Section with 3 columns */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Oversiktsstatistikk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nøkkelindikatorer og målinger for fasilitetsstyring
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex justify-between">
                <span className="text-sm">Gj.snitt godkjenningstid:</span>
                <span className="font-medium">2,4 dager</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm">Utnyttelsesgrad:</span>
                <span className="font-medium">76%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm">Månedlige bookinger:</span>
                <span className="font-medium">342</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fasilitetsstyring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nylige fasilitetoppdateringer og ventende handlinger
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">
                <span className="font-medium">3</span> nye fasiliteter lagt til
              </li>
              <li className="text-sm">
                <span className="font-medium">7</span> fasiliteter trenger vedlikehold
              </li>
              <li className="text-sm">
                <span className="font-medium">12</span> venter på verifisering
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Godkjenningsprosesser</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Status for nåværende godkjenningsprosesser
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">
                <span className="font-medium">8</span> venter på første gjennomgang
              </li>
              <li className="text-sm">
                <span className="font-medium">5</span> venter på endelig godkjenning
              </li>
              <li className="text-sm">
                <span className="font-medium">3</span> avvist denne måneden
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Rapporter & Analytikk Section */}
      <Card>
        <CardHeader>
          <CardTitle>Rapporter & Analytikk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Siste måneders aktivitet</p>
                <div className="text-2xl font-bold">215</div>
                <p className="text-xs text-green-600">+5.2% fra forrige periode</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" name="Bookinger" fill="#4f46e5" />
                  <Bar dataKey="approvals" name="Godkjenninger" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Section for Notification Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Varslingsinnstillinger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Konfigurer hvilke varsler du ønsker å motta
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">E-postvarsler</span>
                <span className="text-sm text-green-600">Aktivert</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SMS-varsler</span>
                <span className="text-sm text-red-600">Deaktivert</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nettleservarsler</span>
                <span className="text-sm text-green-600">Aktivert</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Admin Profile & Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Adminprofil & Innstillinger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src="/placeholder.svg"
                  alt="Admin profil"
                  className="h-16 w-16 rounded-full"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Adminbruker</h3>
                <p className="text-sm text-muted-foreground">admin@drammen.kommune.no</p>
                <p className="text-sm text-muted-foreground">Siste innlogging: 22. mai 2025 09:15</p>
                <p className="text-sm text-muted-foreground">Rolle: Systemadministrator</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
