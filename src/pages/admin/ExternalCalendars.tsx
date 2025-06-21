
import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Settings, Calendar, Search, AlertCircle } from "lucide-react";
import { PageLayout } from "@/components/layouts";
import { useTranslation } from "@/hooks/useTranslation";

const ExternalCalendarsPage = () => {
  const { tSync } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);

  const handleSyncToggle = () => {
    setIsSyncEnabled(!isSyncEnabled);
  };

  const externalCalendars = [{
    id: "1",
    name: "Google Calendar",
    type: "Google",
    status: "Active",
    lastSync: "2024-03-15 10:00",
    syncFrequency: "Daily"
  }, {
    id: "2",
    name: "Outlook Calendar",
    type: "Outlook",
    status: "Inactive",
    lastSync: "Never",
    syncFrequency: "Weekly"
  }, {
    id: "3",
    name: "iCalendar",
    type: "iCal",
    status: "Active",
    lastSync: "2024-03-14 14:30",
    syncFrequency: "Daily"
  }];
  
  const filteredCalendars = externalCalendars.filter(calendar => 
    calendar.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterType === "all" || calendar.type === filterType)
  );

  return (
    <PageLayout>
      <PageHeader 
        title={tSync("admin.externalCalendars.title", "External Calendars")} 
        description={tSync("admin.externalCalendars.description", "Manage external calendar integrations")} 
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {tSync("admin.externalCalendars.addCalendar", "Add Calendar")}
          </Button>
        } 
      />
      <Card>
        <CardHeader>
          <CardTitle>{tSync("admin.externalCalendars.calendarList", "Calendar List")}</CardTitle>
          <CardDescription>{tSync("admin.externalCalendars.configureSync", "Configure synchronization settings for external calendars")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Input 
              type="search" 
              placeholder={tSync("admin.externalCalendars.searchCalendar", "Search calendar...")} 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tSync("admin.externalCalendars.selectType", "Select Type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tSync("admin.externalCalendars.allTypes", "All Types")}</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Outlook">Outlook</SelectItem>
                <SelectItem value="iCal">iCalendar</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-end">
              <Label htmlFor="syncToggle" className="text-sm font-medium mr-3">{tSync("admin.externalCalendars.enableSync", "Enable Sync")}</Label>
              <Switch id="syncToggle" checked={isSyncEnabled} onCheckedChange={handleSyncToggle} />
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.externalCalendars.name", "Name")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.externalCalendars.type", "Type")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.externalCalendars.status", "Status")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.externalCalendars.lastSync", "Last Sync")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.externalCalendars.syncFrequency", "Sync Frequency")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.externalCalendars.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCalendars.map(calendar => 
                  <tr key={calendar.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{calendar.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calendar.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant={calendar.status === "Active" ? "default" : "secondary"}>{calendar.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calendar.lastSync}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calendar.syncFrequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        {tSync("admin.externalCalendars.settings", "Settings")}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        {tSync("admin.externalCalendars.syncNow", "Sync Now")}
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredCalendars.length === 0 && 
              <div className="text-center py-4">
                <AlertCircle className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{tSync("admin.externalCalendars.noCalendars", "No external calendars found")}</p>
              </div>
            }
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ExternalCalendarsPage;
