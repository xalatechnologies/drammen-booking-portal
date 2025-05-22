
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, FileText, TrendingUp } from "lucide-react";

// Simplified example data
const bookingData = [
  { måned: "Jan", Idretts: 45, Kultur: 28 },
  { måned: "Feb", Idretts: 52, Kultur: 30 },
  { måned: "Mar", Idretts: 48, Kultur: 35 },
  { måned: "Apr", Idretts: 70, Kultur: 40 },
];

const pieData = [
  { navn: "Idrettshaller", verdi: 45 },
  { navn: "Kulturrom", verdi: 25 },
  { navn: "Møterom", verdi: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

// Simplified table data
const facilitiesData = [
  { navn: "Brandengen Skole", antallBookinger: 245, tilgjengelighet: 80 },
  { navn: "Drammen Idrettspark", antallBookinger: 320, tilgjengelighet: 65 },
];

const ReportsAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<string>("6m");

  // Simplified chart config
  const chartConfig = {
    Idretts: { label: "Idrettshaller", color: "#0088FE" },
    Kultur: { label: "Kulturrom", color: "#00C49F" }
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
          <TabsTrigger value="fasiliteter" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Fasiliteter</span>
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
                <CardTitle className="text-sm font-medium">Fasilitet Tilgjengelighet</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">-2% fra forrige periode</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bookinger</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-72">
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="måned" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="Idretts" name="Idrettshaller" fill="#0088FE" />
                    <Bar dataKey="Kultur" name="Kulturrom" fill="#00C49F" />
                  </BarChart>
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
                    <TableHead className="text-right">Tilgjengelighet (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilitiesData.map((facility) => (
                    <TableRow key={facility.navn}>
                      <TableCell className="font-medium">{facility.navn}</TableCell>
                      <TableCell className="text-right">{facility.antallBookinger}</TableCell>
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
