
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Simplified data
const bookingData = [
  { måned: "Jan", verdi: 45 },
  { måned: "Feb", verdi: 52 },
  { måned: "Mar", verdi: 48 },
  { måned: "Apr", verdi: 70 },
];

const pieData = [
  { navn: "Idrettshaller", verdi: 45 },
  { navn: "Kulturrom", verdi: 25 },
];

const COLORS = ["#0088FE", "#00C49F"];

const ReportsAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<string>("6m");

  // Simplified chart config
  const chartConfig = {
    verdi: { label: "Bookinger", color: "#0088FE" }
  };

  const handleRefresh = () => {
    toast.success("Rapporter oppdatert");
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Rapporter & Analytikk</h2>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Fasilitetfordeling</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-40">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={50}
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

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Bookingsoversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-56">
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="måned" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="verdi" name="Bookinger" fill="#0088FE" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalyticsPage;
