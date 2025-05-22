
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, FileText, TrendingUp } from "lucide-react";

// Eksempeldata for diagrammer
const bookingData = [
  { måned: "Jan", Idretts: 45, Kultur: 28, Møterom: 20, Annet: 10 },
  { måned: "Feb", Idretts: 52, Kultur: 30, Møterom: 22, Annet: 12 },
  { måned: "Mar", Idretts: 48, Kultur: 35, Møterom: 25, Annet: 15 },
  { måned: "Apr", Idretts: 70, Kultur: 40, Møterom: 30, Annet: 18 },
  { måned: "Mai", Idretts: 65, Kultur: 45, Møterom: 35, Annet: 20 },
  { måned: "Jun", Idretts: 75, Kultur: 50, Møterom: 38, Annet: 22 }
];

const trendData = [
  { måned: "Jan", verdi: 4000 },
  { måned: "Feb", verdi: 3500 },
  { måned: "Mar", verdi: 6000 },
  { måned: "Apr", verdi: 8100 },
  { måned: "Mai", verdi: 7800 },
  { måned: "Jun", verdi: 8900 }
];

const pieData = [
  { navn: "Idrettshaller", verdi: 45 },
  { navn: "Kulturrom", verdi: 25 },
  { navn: "Møterom", verdi: 15 },
  { navn: "Klasserom", verdi: 10 },
  { navn: "Annet", verdi: 5 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B042FF"];

// Tabell data
const facilitiesData = [
  { navn: "Brandengen Skole", antallBookinger: 245, gjennomsnittsTid: 2.5, tilgjengelighet: 80 },
  { navn: "Drammen Idrettspark", antallBookinger: 320, gjennomsnittsTid: 3.2, tilgjengelighet: 65 },
  { navn: "Fjell Skole", antallBookinger: 185, gjennomsnittsTid: 1.8, tilgjengelighet: 90 },
  { navn: "Gulskogen Skole", antallBookinger: 210, gjennomsnittsTid: 2.2, tilgjengelighet: 75 }
];

const ReportsAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<string>("6m");

  // Fixed chart config structure to match the expected ChartConfig type
  const chartConfig = {
    Idretts: { label: "Idrettshaller", color: "#0088FE" },
    Kultur: { label: "Kulturrom", color: "#00C49F" },
    Møterom: { label: "Møterom", color: "#FFBB28" },
    Annet: { label: "Annet", color: "#FF8042" },
    verdi: { label: "Bookingverdi", color: "#8884d8" }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Rapporter & Analytikk</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Velg tidsperiode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Siste 30 dager</SelectItem>
            <SelectItem value="3m">Siste 3 måneder</SelectItem>
            <SelectItem value="6m">Siste 6 måneder</SelectItem>
            <SelectItem value="1y">Siste år</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="oversikt" className="space-y-4">
        <TabsList>
          <TabsTrigger value="oversikt" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Oversikt</span>
          </TabsTrigger>
          <TabsTrigger value="detaljert" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Detaljert Analyse</span>
          </TabsTrigger>
          <TabsTrigger value="fasiliteter" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Fasilitetsrapporter</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="oversikt" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totale Bookinger</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12.5% fra forrige periode</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gjennomsnittlig Bookingtid</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 timer</div>
                <p className="text-xs text-muted-foreground">+0.3 timer fra forrige periode</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fasilitet Tilgjengelighet</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">-2% fra forrige periode</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bookinger etter Fasilitettype</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="måned" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="Idretts" name="Idrettshaller" fill="#0088FE" />
                  <Bar dataKey="Kultur" name="Kulturrom" fill="#00C49F" />
                  <Bar dataKey="Møterom" name="Møterom" fill="#FFBB28" />
                  <Bar dataKey="Annet" name="Annet" fill="#FF8042" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bookingtrender</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-72">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="måned" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="verdi" name="Bookingverdi" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fasilitetfordeling</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-72">
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
                      label={({ navn, percent }) => `${navn}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detaljert" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detaljert Analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Detaljert analytisk innhold vil vises her med utvidede diagrammer og data.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fasiliteter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fasilitetsrapporter</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fasilitet Navn</TableHead>
                    <TableHead className="text-right">Antall Bookinger</TableHead>
                    <TableHead className="text-right">Gjennomsnittlig Bookingtid (timer)</TableHead>
                    <TableHead className="text-right">Tilgjengelighet (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilitiesData.map((facility) => (
                    <TableRow key={facility.navn}>
                      <TableCell className="font-medium">{facility.navn}</TableCell>
                      <TableCell className="text-right">{facility.antallBookinger}</TableCell>
                      <TableCell className="text-right">{facility.gjennomsnittsTid}</TableCell>
                      <TableCell className="text-right">{facility.tilgjengelighet}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalyticsPage;
