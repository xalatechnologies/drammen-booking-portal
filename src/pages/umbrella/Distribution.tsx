import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Settings,
  Eye,
  BarChart3,
  MapPin,
  CalendarDays
} from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface SubActor {
  id: number;
  name: string;
  users: number;
  allocated: number;
  used: number;
  location: string;
  status: string;
  lastUsed: string;
  utilization: number;
}

const Distribution = () => {
  const { t } = useTranslation();

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // State for modals
  const [isManageTimeModalOpen, setIsManageTimeModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedSubActor, setSelectedSubActor] = useState<SubActor | null>(null);

  // Mock data for demonstration
  const subActors: SubActor[] = [
    { 
      id: 1, 
      name: "Drammen IF", 
      users: 25, 
      allocated: 75, 
      used: 60,
      location: "Drammenshallen",
      status: "active",
      lastUsed: "2024-12-15",
      utilization: 80
    },
    { 
      id: 2, 
      name: "Åssiden IF", 
      users: 18, 
      allocated: 60, 
      used: 45,
      location: "Åssidenhallen",
      status: "active",
      lastUsed: "2024-12-18",
      utilization: 75
    },
    { 
      id: 3, 
      name: "Konnerud IL", 
      users: 32, 
      allocated: 90, 
      used: 70,
      location: "Konnerudhallen",
      status: "active",
      lastUsed: "2024-12-16",
      utilization: 78
    },
    { 
      id: 4, 
      name: "Strømsgodset IF", 
      users: 15, 
      allocated: 45, 
      used: 12,
      location: "Drammenshallen",
      status: "low_usage",
      lastUsed: "2024-12-10",
      utilization: 27
    },
    { 
      id: 5, 
      name: "Mjøndalen IF", 
      users: 22, 
      allocated: 55, 
      used: 8,
      location: "Åssidenhallen",
      status: "inactive",
      lastUsed: "2024-11-28",
      utilization: 15
    }
  ];

  // Filtered data
  const filteredSubActors = subActors.filter((actor) => {
    const searchMatch = searchQuery === "" || 
      actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.location.toLowerCase().includes(searchQuery.toLowerCase());

    const locationMatch = locationFilter === "all" || 
      actor.location.toLowerCase() === locationFilter.toLowerCase();

    const statusMatch = statusFilter === "all" || 
      actor.status === statusFilter;

    return searchMatch && locationMatch && statusMatch;
  });

  // Aggregated totals
  const totalAllocated = subActors.reduce((sum, item) => sum + item.allocated, 0);
  const totalUsed = subActors.reduce((sum, item) => sum + item.used, 0);
  const totalUtilization = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0;

  // Warning indicators
  const lowUsageActors = subActors.filter(actor => actor.utilization < 30);
  const inactiveActors = subActors.filter(actor => actor.status === "inactive");

  const handleManageTime = (actor: SubActor) => {
    setSelectedSubActor(actor);
    setIsManageTimeModalOpen(true);
  };

  const handleViewCalendar = (actor: SubActor) => {
    setSelectedSubActor(actor);
    setIsCalendarModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setPeriodFilter("all");
    setStatusFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Aktiv</Badge>;
      case "low_usage":
        return <Badge variant="secondary">Lav bruk</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inaktiv</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 70) return "text-green-600";
    if (utilization >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <PageHeader
          title={t("umbrella.distribution.title", undefined, "Tidsfordeling")}
          description={t("umbrella.distribution.description", undefined, "Administrer fordeling av tilgjengelig tid mellom organisasjoner")}
          actions={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("umbrella.distribution.addAllocation", undefined, "Legg til fordeling")}
            </Button>
          }
        />

        {/* Warning indicators */}
        {(lowUsageActors.length > 0 || inactiveActors.length > 0) && (
          <div className="space-y-3">
            {lowUsageActors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{lowUsageActors.length} organisasjon(er)</strong> har lav bruk (&lt;30%). 
                  Vurder å omfordele tid.
                </AlertDescription>
              </Alert>
            )}
            {inactiveActors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{inactiveActors.length} organisasjon(er)</strong> har ikke brukt tid på over 2 uker.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* 1. Tidsfordeling – aggregerte tall */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>{t("umbrella.distribution.timeAllocation", undefined, "Tidsfordeling")}</span>
            </CardTitle>
            <CardDescription>
              {t("umbrella.distribution.timeAllocationDescription", undefined, "Oversikt over hvordan tiden er fordelt mellom organisasjoner")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalAllocated}</div>
                <div className="text-sm text-gray-600">{t("umbrella.distribution.totalAllocated", undefined, "Total tildelt")}</div>
                <div className="text-xs text-gray-500">{t("umbrella.distribution.hours", undefined, "timer")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalUsed}</div>
                <div className="text-sm text-gray-600">{t("umbrella.distribution.totalUsed", undefined, "Total brukt")}</div>
                <div className="text-xs text-gray-500">{t("umbrella.distribution.hours", undefined, "timer")}</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getUtilizationColor(totalUtilization)}`}>
                  {totalUtilization.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">{t("umbrella.distribution.utilization", undefined, "Utnyttelse")}</div>
                <div className="text-xs text-gray-500">{t("umbrella.distribution.rate", undefined, "rate")}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t("umbrella.distribution.overallUtilization", undefined, "Samlet utnyttelse")}</span>
                <span className="text-sm text-gray-600">{totalUtilization.toFixed(1)}%</span>
              </div>
              <Progress value={totalUtilization} className="h-3" />
            </div>

            {/* Filter controls for aggregated view */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("umbrella.distribution.filterLocation", undefined, "Filtrer lokasjon")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("umbrella.common.all", undefined, "Alle lokasjoner")}</SelectItem>
                  <SelectItem value="drammenshallen">Drammenshallen</SelectItem>
                  <SelectItem value="assidenhallen">Åssidenhallen</SelectItem>
                  <SelectItem value="konnerudhallen">Konnerudhallen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("umbrella.distribution.filterPeriod", undefined, "Filtrer periode")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("umbrella.common.all", undefined, "Alle perioder")}</SelectItem>
                  <SelectItem value="current">Nåværende måned</SelectItem>
                  <SelectItem value="last3">Siste 3 måneder</SelectItem>
                  <SelectItem value="last6">Siste 6 måneder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 2. Liste over underaktører */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t("umbrella.distribution.subActors", undefined, "Underaktører")}</span>
            </CardTitle>
            <CardDescription>
              {t("umbrella.distribution.subActorsDescription", undefined, "Oversikt over klubber og foreninger")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtering and search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder={t("umbrella.distribution.searchPlaceholder", undefined, "Søk etter klubb/forening...")}
                className="max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("umbrella.distribution.filterLocation", undefined, "Filtrer lokasjon")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("umbrella.common.all", undefined, "Alle lokasjoner")}</SelectItem>
                  <SelectItem value="drammenshallen">Drammenshallen</SelectItem>
                  <SelectItem value="assidenhallen">Åssidenhallen</SelectItem>
                  <SelectItem value="konnerudhallen">Konnerudhallen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("umbrella.distribution.filterStatus", undefined, "Filtrer status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("umbrella.common.all", undefined, "Alle statuser")}</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="low_usage">Lav bruk</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                {t("umbrella.common.clear", undefined, "Nullstill")}
              </Button>
            </div>

            {/* Active filters indicator */}
            {(searchQuery || locationFilter !== "all" || statusFilter !== "all") && (
              <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Aktive filtre:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="text-xs">
                      Søk: "{searchQuery}"
                    </Badge>
                  )}
                  {locationFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Lokasjon: {locationFilter}
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Status: {statusFilter}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-blue-600">
                  {filteredSubActors.length} av {subActors.length} resultater
                </span>
              </div>
            )}

            {/* Sub-actors list */}
            <div className="space-y-4">
              {filteredSubActors.map((actor) => (
                <Card key={actor.id} className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-lg">{actor.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{actor.location}</span>
                            <span>•</span>
                            <Users className="w-4 h-4" />
                            <span>{actor.users} {t("umbrella.distribution.users", undefined, "Brukere")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(actor.status)}
                        {actor.utilization < 30 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Lav bruk - vurder omfordeling</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t("umbrella.distribution.allocatedHours", undefined, "Tildelte timer")}</span>
                          <span className="text-sm text-gray-600">{actor.allocated}</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t("umbrella.distribution.usedHours", undefined, "Brukte timer")}</span>
                          <span className="text-sm text-gray-600">{actor.used}</span>
                        </div>
                        <Progress value={(actor.used / actor.allocated) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t("umbrella.distribution.utilization", undefined, "Utnyttelse")}</span>
                          <span className={`text-sm font-medium ${getUtilizationColor(actor.utilization)}`}>
                            {actor.utilization}%
                          </span>
                        </div>
                        <Progress value={actor.utilization} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {t("umbrella.distribution.lastUsed", undefined, "Sist brukt")}: {actor.lastUsed}
                      </div>
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewCalendar(actor)}>
                              <Calendar className="w-4 h-4 mr-2" />
                              {t("umbrella.distribution.viewCalendar", undefined, "Se kalender")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Se kalender for {actor.name}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" onClick={() => handleManageTime(actor)}>
                              <Settings className="w-4 h-4 mr-2" />
                              {t("umbrella.distribution.manageTime", undefined, "Administrer tid")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Administrer tid for {actor.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manage Time Modal */}
        <Dialog open={isManageTimeModalOpen} onOpenChange={setIsManageTimeModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Administrer tid - {selectedSubActor?.name}</span>
              </DialogTitle>
              <DialogDescription>
                Visning av paraplyens tildelte tid og mulighet for omfordeling
              </DialogDescription>
            </DialogHeader>
            
            {selectedSubActor && (
              <div className="space-y-6">
                {/* Available time overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tilgjengelig tid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">45</div>
                        <div className="text-sm text-green-600">Ledige timer</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">120</div>
                        <div className="text-sm text-blue-600">Total tildelt</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">75</div>
                        <div className="text-sm text-gray-600">Brukt</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Time allocation form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tildel ny tid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Velg lokasjon</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Velg lokasjon..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drammenshallen">Drammenshallen</SelectItem>
                            <SelectItem value="assidenhallen">Åssidenhallen</SelectItem>
                            <SelectItem value="konnerudhallen">Konnerudhallen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Velg ukedag(er)</label>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                          {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day) => (
                            <Button key={day} variant="outline" size="sm" className="text-xs">
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Velg klokkeslett</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="time" placeholder="Starttid" />
                          <Input type="time" placeholder="Sluttid" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Velg periode</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="date" placeholder="Startdato" />
                          <Input type="date" placeholder="Sluttdato" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsManageTimeModalOpen(false)}>
                          Avbryt
                        </Button>
                        <Button>
                          Tildel tid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Calendar Modal */}
        <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Kalender - {selectedSubActor?.name}</span>
              </DialogTitle>
              <DialogDescription>
                Oversikt over tildelt og brukt tid
              </DialogDescription>
            </DialogHeader>
            
            {selectedSubActor && (
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Kalendervisning kommer snart</p>
                  <p className="text-sm">Her vil du kunne se detaljert oversikt over tildelt og brukt tid</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsCalendarModalOpen(false)}>
                    Lukk
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Distribution; 