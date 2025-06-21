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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CalendarDays,
  CheckCircle,
  XCircle,
  Info
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

interface AvailableTimeSlot {
  id: string;
  location: string;
  weekday: string;
  startTime: string;
  endTime: string;
  date: string;
  isAvailable: boolean;
}

interface DistributionForm {
  location: string;
  weekdays: string[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  subActorId: number | null;
  description: string;
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
  const [isAddDistributionModalOpen, setIsAddDistributionModalOpen] = useState(false);
  const [selectedSubActor, setSelectedSubActor] = useState<SubActor | null>(null);

  // State for add distribution form
  const [distributionForm, setDistributionForm] = useState<DistributionForm>({
    location: "",
    weekdays: [],
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    subActorId: null,
    description: ""
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Mock available time slots (only showing available times from umbrella's allocation)
  const availableTimeSlots: AvailableTimeSlot[] = [
    { id: "1", location: "Drammenshallen", weekday: "mandag", startTime: "18:00", endTime: "20:00", date: "2024-12-23", isAvailable: true },
    { id: "2", location: "Drammenshallen", weekday: "tirsdag", startTime: "19:00", endTime: "21:00", date: "2024-12-24", isAvailable: true },
    { id: "3", location: "Åssidenhallen", weekday: "onsdag", startTime: "17:00", endTime: "19:00", date: "2024-12-25", isAvailable: true },
    { id: "4", location: "Konnerudhallen", weekday: "torsdag", startTime: "18:30", endTime: "20:30", date: "2024-12-26", isAvailable: true },
    { id: "5", location: "Drammenshallen", weekday: "fredag", startTime: "16:00", endTime: "18:00", date: "2024-12-27", isAvailable: false },
  ];

  const weekdays = [
    { value: "mandag", label: "Mandag" },
    { value: "tirsdag", label: "Tirsdag" },
    { value: "onsdag", label: "Onsdag" },
    { value: "torsdag", label: "Torsdag" },
    { value: "fredag", label: "Fredag" },
    { value: "lørdag", label: "Lørdag" },
    { value: "søndag", label: "Søndag" }
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

  const handleAddDistribution = () => {
    setIsAddDistributionModalOpen(true);
    // Reset form
    setDistributionForm({
      location: "",
      weekdays: [],
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
      subActorId: null,
      description: ""
    });
    setFormErrors({});
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

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!distributionForm.location) {
      errors.location = "Lokasjon er påkrevd";
    }

    if (distributionForm.weekdays.length === 0) {
      errors.weekdays = "Minst én ukedag må velges";
    }

    if (!distributionForm.startTime) {
      errors.startTime = "Starttid er påkrevd";
    }

    if (!distributionForm.endTime) {
      errors.endTime = "Sluttid er påkrevd";
    }

    if (distributionForm.startTime && distributionForm.endTime) {
      if (distributionForm.startTime >= distributionForm.endTime) {
        errors.timeRange = "Sluttid må være senere enn starttid";
      }
    }

    if (!distributionForm.startDate) {
      errors.startDate = "Startdato er påkrevd";
    }

    if (!distributionForm.endDate) {
      errors.endDate = "Sluttdato er påkrevd";
    }

    if (distributionForm.startDate && distributionForm.endDate) {
      if (distributionForm.startDate > distributionForm.endDate) {
        errors.dateRange = "Sluttdato må være senere enn startdato";
      }
    }

    if (!distributionForm.subActorId) {
      errors.subActor = "Underaktør må velges";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmitDistribution = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would make the actual API call to save the distribution
      console.log("Distributing time:", distributionForm);

      // Close modal and show success message
      setIsAddDistributionModalOpen(false);
      // You could add a toast notification here
      
    } catch (error) {
      console.error("Error distributing time:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available time slots for selected location
  const getAvailableTimeSlots = () => {
    return availableTimeSlots.filter(slot => 
      slot.location.toLowerCase() === distributionForm.location.toLowerCase() && 
      slot.isAvailable
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <PageHeader
          title={t("umbrella.distribution.title", undefined, "Tidsfordeling")}
          description={t("umbrella.distribution.description", undefined, "Administrer fordeling av tilgjengelig tid mellom organisasjoner")}
          actions={
            <Button onClick={handleAddDistribution}>
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

        {/* Add Distribution Modal */}
        <Dialog open={isAddDistributionModalOpen} onOpenChange={setIsAddDistributionModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Legg til fordeling</span>
              </DialogTitle>
              <DialogDescription>
                Tildel tilgjengelig tid til en underaktør
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* 1. Velg tildelt tid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>1. Velg tildelt tid</span>
                  </CardTitle>
                  <CardDescription>
                    Kun vis tider som paraplyen faktisk har fått tildelt (og som ikke er brukt)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lokasjon */}
                  <div>
                    <Label htmlFor="location">Lokasjon *</Label>
                    <Select 
                      value={distributionForm.location} 
                      onValueChange={(value) => setDistributionForm({...distributionForm, location: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Velg lokasjon..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Drammenshallen">Drammenshallen</SelectItem>
                        <SelectItem value="Åssidenhallen">Åssidenhallen</SelectItem>
                        <SelectItem value="Konnerudhallen">Konnerudhallen</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.location && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.location}</p>
                    )}
                  </div>

                  {/* Ukedager */}
                  <div>
                    <Label>Ukedag(er) *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {weekdays.map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={day.value}
                              checked={distributionForm.weekdays.includes(day.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDistributionForm({
                                    ...distributionForm,
                                    weekdays: [...distributionForm.weekdays, day.value]
                                  });
                                } else {
                                  setDistributionForm({
                                    ...distributionForm,
                                    weekdays: distributionForm.weekdays.filter(d => d !== day.value)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={day.value} className="text-sm">{day.label}</Label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {formErrors.weekdays && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.weekdays}</p>
                    )}
                  </div>

                  {/* Klokkeslett */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Starttid *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={distributionForm.startTime}
                        onChange={(e) => setDistributionForm({...distributionForm, startTime: e.target.value})}
                      />
                      {formErrors.startTime && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.startTime}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endTime">Sluttid *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={distributionForm.endTime}
                        onChange={(e) => setDistributionForm({...distributionForm, endTime: e.target.value})}
                      />
                      {formErrors.endTime && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.endTime}</p>
                      )}
                    </div>
                  </div>
                  {formErrors.timeRange && (
                    <p className="text-sm text-red-600">{formErrors.timeRange}</p>
                  )}

                  {/* Periode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Fra dato *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={distributionForm.startDate}
                        onChange={(e) => setDistributionForm({...distributionForm, startDate: e.target.value})}
                      />
                      {formErrors.startDate && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.startDate}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endDate">Til dato *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={distributionForm.endDate}
                        onChange={(e) => setDistributionForm({...distributionForm, endDate: e.target.value})}
                      />
                      {formErrors.endDate && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.endDate}</p>
                      )}
                    </div>
                  </div>
                  {formErrors.dateRange && (
                    <p className="text-sm text-red-600">{formErrors.dateRange}</p>
                  )}

                  {/* Available time slots preview */}
                  {distributionForm.location && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Tilgjengelige tidslotter for {distributionForm.location}:</h4>
                      <div className="space-y-2">
                        {getAvailableTimeSlots().map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{slot.weekday}</span>
                            <span>{slot.startTime} - {slot.endTime}</span>
                            <span className="text-green-600 font-medium">Ledig</span>
                          </div>
                        ))}
                        {getAvailableTimeSlots().length === 0 && (
                          <p className="text-sm text-gray-600">Ingen ledige tidslotter for valgt lokasjon</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 2. Velg underaktør */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>2. Velg underaktør</span>
                  </CardTitle>
                  <CardDescription>
                    Aktørliste filtrert på klubber/lag under paraplyorganisasjonen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subActorSearch">Søk etter klubb/lag</Label>
                      <Input
                        id="subActorSearch"
                        placeholder="Søk etter navn..."
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {subActors.map((actor) => (
                        <div
                          key={actor.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            distributionForm.subActorId === actor.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setDistributionForm({...distributionForm, subActorId: actor.id})}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{actor.name}</h4>
                              <p className="text-sm text-gray-600">{actor.location} • {actor.users} brukere</p>
                            </div>
                            {distributionForm.subActorId === actor.id && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {formErrors.subActor && (
                      <p className="text-sm text-red-600">{formErrors.subActor}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 3. Beskrivelse */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>3. Beskrivelse (valgfritt)</span>
                  </CardTitle>
                  <CardDescription>
                    F.eks. "Fordeles til G15 grunnet seriespill"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Beskriv formålet med tildelingen..."
                    value={distributionForm.description}
                    onChange={(e) => setDistributionForm({...distributionForm, description: e.target.value})}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* 4. Bekreft og tildel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>4. Bekreft og tildel</span>
                  </CardTitle>
                  <CardDescription>
                    Validering og bekreftelse av tildeling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Validation summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Validering:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center space-x-2">
                          {distributionForm.location ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Tidspunkt må være innenfor paraplyens tildeling</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          {distributionForm.weekdays.length > 0 ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Ingen overlapp med tidligere fordelinger</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          {distributionForm.subActorId ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Underaktør valgt</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddDistributionModalOpen(false)}
                        disabled={isSubmitting}
                      >
                        Avbryt
                      </Button>
                      <Button 
                        onClick={handleSubmitDistribution}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Tildeler...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Tildel tid
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

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