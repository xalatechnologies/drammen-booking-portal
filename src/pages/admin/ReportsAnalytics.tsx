
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, 
  PieChart, Pie, LineChart, Line, ResponsiveContainer, Tooltip, Legend 
} from "recharts";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { RefreshCw, BarChart3, PieChart as PieIcon, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Enhanced data
const bookingData = [
  { måned: "Jan", verdi: 45, avbookinger: 12 },
  { måned: "Feb", verdi: 52, avbookinger: 8 },
  { måned: "Mar", verdi: 48, avbookinger: 10 },
  { måned: "Apr", verdi: 70, avbookinger: 15 },
  { måned: "Mai", verdi: 65, avbookinger: 12 },
  { måned: "Jun", verdi: 90, avbookinger: 20 },
];

const pieData = [
  { navn: "Idrettshaller", verdi: 45, color: "#0088FE" },
  { navn: "Kulturrom", verdi: 25, color: "#00C49F" },
  { navn: "Klasserom", verdi: 20, color: "#FFBB28" },
  { navn: "Andre", verdi: 10, color: "#FF8042" },
];

const trendsData = [
  { måned: "Jan", bookinger: 45, besøkende: 120 },
  { måned: "Feb", bookinger: 52, besøkende: 140 },
  { måned: "Mar", bookinger: 48, besøkende: 130 },
  { måned: "Apr", bookinger: 70, besøkende: 180 },
  { måned: "Mai", bookinger: 65, besøkende: 170 },
  { måned: "Jun", bookinger: 90, besøkende: 220 },
];

const popularFacilitiesData = [
  { name: "Brandengen Idrettshall", bookings: 125, utilization: "87%", status: "Høy" },
  { name: "Drammen Kulturscene", bookings: 98, utilization: "72%", status: "Medium" },
  { name: "Galterud Gymsal", bookings: 87, utilization: "64%", status: "Medium" },
  { name: "Konnerud Skole Auditorium", bookings: 76, utilization: "58%", status: "Medium" },
  { name: "Danvik Svømmehall", bookings: 68, utilization: "49%", status: "Lav" },
];

const ReportsAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<string>("6m");
  const [activeTab, setActiveTab] = useState<string>("oversikt");

  // Chart config
  const chartConfig = {
    verdi: { label: "Bookinger", color: "#0088FE" },
    avbookinger: { label: "Avbookinger", color: "#FF8042" },
    bookinger: { label: "Bookinger", color: "#0088FE" },
    besøkende: { label: "Besøkende", color: "#00C49F" }
  };

  const handleRefresh = () => {
    toast.success("Rapporter oppdatert");
  };

  const handleDownload = () => {
    toast.success("Rapport lastet ned");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Høy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Lav": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rapporter & Analytikk</h2>
          <p className="text-muted-foreground">Få innsikt i bookinger og bruk av Lokaler.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Velg periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Siste 30 dager</SelectItem>
              <SelectItem value="6m">Siste 6 måneder</SelectItem>
              <SelectItem value="1y">Siste år</SelectItem>
              <SelectItem value="all">Hele perioden</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            title="Oppdater rapporter"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Last ned</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="oversikt">Oversikt</TabsTrigger>
          <TabsTrigger value="Lokaler">Lokaler</TabsTrigger>
          <TabsTrigger value="trender">Trender</TabsTrigger>
          <TabsTrigger value="detaljer">Detaljert</TabsTrigger>
        </TabsList>
        
        <TabsContent value="oversikt" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totale Bookinger</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <div className="flex items-center">
                  <span className="text-xs text-green-600">+12.5%</span>
                  <span className="text-xs text-muted-foreground ml-1">fra forrige periode</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktive Brukere</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <div className="flex items-center">
                  <span className="text-xs text-green-600">+8.2%</span>
                  <span className="text-xs text-muted-foreground ml-1">fra forrige periode</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bruk av kapasitet</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.7%</div>
                <div className="flex items-center">
                  <span className="text-xs text-green-600">+5.1%</span>
                  <span className="text-xs text-muted-foreground ml-1">fra forrige periode</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Lokalfordeling</CardTitle>
                <CardDescription>Bookinger fordelt på Lokalstype</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[240px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="verdi"
                      nameKey="navn"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Bookingsoversikt</CardTitle>
                <CardDescription>Månedlige bookinger og avbookinger</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[240px]">
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="måned" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="verdi" name="Bookinger" fill="#0088FE" />
                    <Bar dataKey="avbookinger" name="Avbookinger" fill="#FF8042" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="Lokaler" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Populære Lokaler</CardTitle>
              <CardDescription>Oversikt over de mest brukte Lokalene</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Navn</TableHead>
                    <TableHead className="text-right">Bookinger</TableHead>
                    <TableHead className="text-right">Utnyttelse</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularFacilitiesData.map((facility) => (
                    <TableRow key={facility.name}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell className="text-right">{facility.bookings}</TableCell>
                      <TableCell className="text-right">{facility.utilization}</TableCell>
                      <TableCell className="text-right">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(facility.status)}`}>
                          {facility.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trender" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Bookingstrender</CardTitle>
              <CardDescription>Trender over tid for bookinger og besøkende</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[320px]">
                <LineChart
                  data={trendsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="måned" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="bookinger" stroke="#0088FE" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="besøkende" stroke="#00C49F" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detaljer" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Detaljert Rapport</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sammendrag</CardTitle>
              <CardDescription>Detaljert sammendrag av bookingaktivitet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Total Booking Verdi</div>
                  <div className="text-xl font-semibold">359,452 kr</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Gjennomsnittlig Booking</div>
                  <div className="text-xl font-semibold">1,248 kr</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Avbookinger</div>
                  <div className="text-xl font-semibold">67 (5.4%)</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Aktive Lokaler</div>
                  <div className="text-xl font-semibold">24 av 28</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  Denne rapporten viser en oversikt over aktiviteten i systemet for den valgte perioden. 
                  Total booking verdi er basert på faktiske bookinger, ikke avReservasjoner. 
                  For mer detaljerte rapporter, vennligst bruk nedlastingsfunksjonen.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalyticsPage;
