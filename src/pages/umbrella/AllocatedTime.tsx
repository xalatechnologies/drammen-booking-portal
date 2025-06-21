import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Clock, Users, Share2, Edit2, Trash2, Download, Search, Filter, Plus, History, AlertCircle, Info, FileText, FileSpreadsheet, Settings } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const AllocatedTimePage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState("table");
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<any>(null);
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isPartialDetailsDialogOpen, setIsPartialDetailsDialogOpen] = useState(false);
  const [isComprehensiveEditDialogOpen, setIsComprehensiveEditDialogOpen] = useState(false);
  const [selectedPartialBlock, setSelectedPartialBlock] = useState<any>(null);
  const [activeEditTab, setActiveEditTab] = useState("distribute");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for demonstration
  const allocatedTimeBlocks = [
    {
      id: 1,
      location: "Drammenshallen",
      weekdays: ["Tirsdag", "Torsdag"],
      timeSlot: "18:00-20:00",
      period: "2024-09-01 - 2025-06-30",
      status: "Fordelt",
      distributedTo: "Drammen IF",
      utilization: 85
    },
    {
      id: 2,
      location: "Åssidenhallen",
      weekdays: ["Onsdag"],
      timeSlot: "19:00-21:00",
      period: "2024-09-01 - 2025-06-30",
      status: "Ufordelt",
      distributedTo: null,
      utilization: 0
    },
    {
      id: 3,
      location: "Konnerudhallen",
      weekdays: ["Fredag"],
      timeSlot: "17:00-19:00",
      period: "2024-09-01 - 2025-06-30",
      status: "Delvis fordelt",
      distributedTo: "Konnerud IL",
      utilization: 60,
      partialDetails: {
        distributed: [
          { date: "2024-12-20", actor: "Konnerud IL", timeSlot: "17:00-19:00" },
          { date: "2024-12-27", actor: "Konnerud IL", timeSlot: "17:00-19:00" }
        ],
        available: [
          { date: "2024-12-13", timeSlot: "17:00-19:00" },
          { date: "2025-01-03", timeSlot: "17:00-19:00" },
          { date: "2025-01-10", timeSlot: "17:00-19:00" }
        ]
      }
    }
  ];

  const subActors = [
    { id: 1, name: "Drammen IF", email: "drammen.if@example.com", phone: "98765432" },
    { id: 2, name: "Åssiden IF", email: "assiden.if@example.com", phone: "87654321" },
    { id: 3, name: "Konnerud IL", email: "konnerud.il@example.com", phone: "76543210" },
    { id: 4, name: "Strømsgodset IF", email: "stromsgodset.if@example.com", phone: "65432109" }
  ];

  const historyLog = [
    {
      id: 1,
      user: "Kari Nordmann",
      action: "Tildelte tid til Drammen IF",
      details: "Tirsdager og torsdager 18-20 i Drammenshallen",
      date: "2024-12-19 14:30",
      type: "distribution"
    },
    {
      id: 2,
      user: "System",
      action: "Automatisk frigivelse",
      details: "Onsdager 19-21 i Åssidenhallen (ikke brukt)",
      date: "2024-12-15 08:00",
      type: "release"
    },
    {
      id: 3,
      user: "Ola Hansen",
      action: "Endret fordeling",
      details: "Konnerud IL fikk ekstra tid på fredager",
      date: "2024-12-14 16:45",
      type: "edit"
    }
  ];

  // Filtered data
  const filteredTimeBlocks = allocatedTimeBlocks.filter((block) => {
    // Search filter
    const searchMatch = searchQuery === "" || 
      block.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (block.distributedTo && block.distributedTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      block.weekdays.some(day => day.toLowerCase().includes(searchQuery.toLowerCase())) ||
      block.timeSlot.toLowerCase().includes(searchQuery.toLowerCase());

    // Location filter
    const locationMatch = locationFilter === "all" || 
      block.location.toLowerCase() === locationFilter.toLowerCase();

    // Status filter
    const statusMatch = statusFilter === "all" || 
      block.status.toLowerCase() === statusFilter.toLowerCase();

    return searchMatch && locationMatch && statusMatch;
  });

  const handleDistribute = (timeBlock: any) => {
    setSelectedTimeBlock(timeBlock);
    setIsDistributionDialogOpen(true);
  };

  const handleEdit = (timeBlock: any) => {
    setSelectedTimeBlock(timeBlock);
    setIsEditDialogOpen(true);
  };

  const handleRelease = (timeBlock: any) => {
    setSelectedTimeBlock(timeBlock);
    setIsReleaseDialogOpen(true);
  };

  const handleAssign = (timeBlock: any) => {
    setSelectedTimeBlock(timeBlock);
    setIsAssignDialogOpen(true);
  };

  const handlePartialDetails = (timeBlock: any) => {
    setSelectedPartialBlock(timeBlock);
    setIsPartialDetailsDialogOpen(true);
  };

  const handleComprehensiveEdit = (timeBlock: any) => {
    setSelectedTimeBlock(timeBlock);
    setIsComprehensiveEditDialogOpen(true);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting to ${format}...`);
    // In real implementation, this would call an API endpoint
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setStatusFilter("all");
  };

  const getStatusBadge = (status: string, timeBlock: any) => {
    const baseBadge = (
      <Badge variant={
        status === "Fordelt" ? "default" : 
        status === "Ufordelt" ? "secondary" : "outline"
      }>
        {status}
      </Badge>
    );

    if (status === "Delvis fordelt") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => handlePartialDetails(timeBlock)}
                className="cursor-pointer hover:opacity-80"
              >
                {baseBadge}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Klikk for å se detaljer om fordeling</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return baseBadge;
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <PageHeader
          title={t("umbrella.allocatedTime.title", undefined, "Tildelt Rammetid")}
          description={t("umbrella.allocatedTime.description", undefined, "Full oversikt over tildelt tid og verktøy for viderefordeling")}
        />

        {/* 1. Oversikt over tildelt tid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{t("umbrella.allocatedTime.overview.title", undefined, "Oversikt over tildelt tid")}</span>
                </CardTitle>
                <CardDescription>
                  {t("umbrella.allocatedTime.overview.description", undefined, "Visning i tabell- og kalenderformat")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtering */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder={t("umbrella.allocatedTime.overview.searchPlaceholder", undefined, "Søk etter lokasjon eller aktør...")}
                className="max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("umbrella.allocatedTime.overview.filterLocation", undefined, "Filtrer lokasjon")} />
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
                  <SelectValue placeholder={t("umbrella.allocatedTime.overview.filterStatus", undefined, "Filtrer status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("umbrella.common.all", undefined, "Alle statuser")}</SelectItem>
                  <SelectItem value="fordelt">{t("umbrella.allocatedTime.overview.statusDistributed", undefined, "Fordelt")}</SelectItem>
                  <SelectItem value="ufordelt">{t("umbrella.allocatedTime.overview.statusUndistributed", undefined, "Ufordelt")}</SelectItem>
                  <SelectItem value="delvis fordelt">{t("umbrella.allocatedTime.overview.statusPartially", undefined, "Delvis fordelt")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => handleExport('excel')}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eksporter til Excel med metadata</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => handleExport('pdf')}>
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eksporter til PDF med metadata</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Nullstill filtre
                </Button>
              </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              Viser {filteredTimeBlocks.length} av {allocatedTimeBlocks.length} resultater
            </div>

            <Tabs value={selectedView} onValueChange={setSelectedView}>
              <TabsList className="mb-4">
                <TabsTrigger value="table">{t("umbrella.allocatedTime.overview.tableView", undefined, "Tabell")}</TabsTrigger>
                <TabsTrigger value="calendar">{t("umbrella.allocatedTime.overview.calendarView", undefined, "Kalender")}</TabsTrigger>
              </TabsList>

              {/* Table View */}
              <TabsContent value="table" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("umbrella.allocatedTime.overview.location", undefined, "Lokasjon")}</TableHead>
                      <TableHead>{t("umbrella.allocatedTime.overview.weekdays", undefined, "Ukedag(er)")}</TableHead>
                      <TableHead>{t("umbrella.allocatedTime.overview.timeSlot", undefined, "Klokkeslett")}</TableHead>
                      <TableHead>{t("umbrella.allocatedTime.overview.period", undefined, "Periode")}</TableHead>
                      <TableHead>{t("umbrella.allocatedTime.overview.status", undefined, "Status")}</TableHead>
                      <TableHead>{t("umbrella.allocatedTime.overview.distributedTo", undefined, "Fordelt til")}</TableHead>
                      <TableHead>{t("umbrella.allocatedTime.overview.actions", undefined, "Handlinger")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimeBlocks.map((block) => (
                      <TableRow key={block.id}>
                        <TableCell className="font-medium">{block.location}</TableCell>
                        <TableCell>{block.weekdays.join(", ")}</TableCell>
                        <TableCell>{block.timeSlot}</TableCell>
                        <TableCell>{block.period}</TableCell>
                        <TableCell>
                          {getStatusBadge(block.status, block)}
                        </TableCell>
                        <TableCell>{block.distributedTo || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleComprehensiveEdit(block)}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rediger handlinger</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mock calendar view with color coding */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Drammenshallen</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">Tirsdag 18-20 (Fordelt)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">Torsdag 18-20 (Fordelt)</span>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Åssidenhallen</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                        <span className="text-sm">Onsdag 19-21 (Ufordelt)</span>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Konnerudhallen</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-sm">Fredag 17-19 (Delvis fordelt)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Fordelt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Delvis fordelt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span>Ufordelt</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 2. Historikk og logg */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>{t("umbrella.allocatedTime.history.title", undefined, "Historikk og logg")}</span>
            </CardTitle>
            <CardDescription>
              {t("umbrella.allocatedTime.history.description", undefined, "Full loggvisning av alle endringer")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historyLog.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === 'distribution' ? 'bg-green-500' :
                    item.type === 'release' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.user}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{item.action}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                {t("umbrella.allocatedTime.history.exportLog", undefined, "Eksporter logg til Excel/PDF")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Edit Dialog with Tabs */}
        <Dialog open={isComprehensiveEditDialogOpen} onOpenChange={setIsComprehensiveEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Rediger handlinger - {selectedTimeBlock?.location}</span>
              </DialogTitle>
              <DialogDescription>
                Velg handling og administrer tildelt tid
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeEditTab} onValueChange={setActiveEditTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="distribute" className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Fordel</span>
                </TabsTrigger>
                <TabsTrigger value="assign" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Tildel</span>
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex items-center space-x-2">
                  <Edit2 className="w-4 h-4" />
                  <span>Endre</span>
                </TabsTrigger>
                <TabsTrigger value="release" className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Frigi</span>
                </TabsTrigger>
              </TabsList>

              {/* Distribute Tab */}
              <TabsContent value="distribute" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Velg aktør</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg aktør..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subActors.map((actor) => (
                          <SelectItem key={actor.id} value={actor.id.toString()}>
                            {actor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Velg dato(er)</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Velg klokkeslett</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="time" placeholder="Starttid" />
                      <Input type="time" placeholder="Sluttid" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsComprehensiveEditDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button>
                      Fordel tid
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Assign Tab */}
              <TabsContent value="assign" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Velg aktør</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg aktør..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subActors.map((actor) => (
                          <SelectItem key={actor.id} value={actor.id.toString()}>
                            {actor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Velg dato(er)</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Velg klokkeslett</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="time" placeholder="Starttid" />
                      <Input type="time" placeholder="Sluttid" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsComprehensiveEditDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button>
                      Tildel tid
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Edit Tab */}
              <TabsContent value="edit" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Ny aktør</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg ny aktør..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subActors.map((actor) => (
                          <SelectItem key={actor.id} value={actor.id.toString()}>
                            {actor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Endre klokkeslett</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="time" placeholder="Starttid" />
                      <Input type="time" placeholder="Sluttid" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsComprehensiveEditDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button variant="destructive">
                      Trekke tilbake
                    </Button>
                    <Button>
                      Lagre endringer
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Release Tab */}
              <TabsContent value="release" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Velg periode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" placeholder="Startdato" />
                      <Input type="date" placeholder="Sluttdato" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Velg klokkeslett</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="time" placeholder="Starttid" />
                      <Input type="time" placeholder="Sluttid" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="convertToSpare" />
                    <label htmlFor="convertToSpare" className="text-sm">
                      Konverter til strøtimer
                    </label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsComprehensiveEditDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button variant="destructive">
                      Frigi tid
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Distribution Dialog */}
        <Dialog open={isDistributionDialogOpen} onOpenChange={setIsDistributionDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("umbrella.allocatedTime.distribute.title", undefined, "Viderefordel rammetid")}</DialogTitle>
              <DialogDescription>
                {t("umbrella.allocatedTime.distribute.description", undefined, "Velg aktør og tildel tid")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("umbrella.allocatedTime.distribute.selectActor", undefined, "Velg aktør")}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t("umbrella.allocatedTime.distribute.selectActorPlaceholder", undefined, "Velg aktør...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {subActors.map((actor) => (
                      <SelectItem key={actor.id} value={actor.id.toString()}>
                        {actor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">{t("umbrella.allocatedTime.distribute.selectDates", undefined, "Velg dato(er)")}</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Velg klokkeslett</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" placeholder="Starttid" />
                  <Input type="time" placeholder="Sluttid" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDistributionDialogOpen(false)}>
                  {t("umbrella.common.cancel", undefined, "Avbryt")}
                </Button>
                <Button>
                  {t("umbrella.allocatedTime.distribute.assign", undefined, "Tildel")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Dialog for Undistributed Time */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tildel ufordelt tid</DialogTitle>
              <DialogDescription>
                Velg aktør og tildel tid som ikke er fordelt
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Velg aktør</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg aktør..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subActors.map((actor) => (
                      <SelectItem key={actor.id} value={actor.id.toString()}>
                        {actor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Velg dato(er)</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Velg klokkeslett</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" placeholder="Starttid" />
                  <Input type="time" placeholder="Sluttid" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button>
                  Tildel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Partial Details Dialog */}
        <Dialog open={isPartialDetailsDialogOpen} onOpenChange={setIsPartialDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detaljer for delvis fordeling</DialogTitle>
              <DialogDescription>
                Oversikt over fordelt og ledig tid
              </DialogDescription>
            </DialogHeader>
            {selectedPartialBlock && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Fordelt tid</h4>
                  <div className="space-y-2">
                    {selectedPartialBlock.partialDetails?.distributed.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 border rounded">
                        <span>{item.date}</span>
                        <span className="text-sm text-gray-600">{item.actor}</span>
                        <span className="text-sm">{item.timeSlot}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Ledig tid</h4>
                  <div className="space-y-2">
                    {selectedPartialBlock.partialDetails?.available.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded">
                        <span>{item.date}</span>
                        <span className="text-sm text-gray-600">Ledig</span>
                        <span className="text-sm">{item.timeSlot}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsPartialDetailsDialogOpen(false)}>
                    Lukk
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("umbrella.allocatedTime.edit.title", undefined, "Endre fordeling")}</DialogTitle>
              <DialogDescription>
                {t("umbrella.allocatedTime.edit.description", undefined, "Endre eller trekke tilbake tildeling")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("umbrella.allocatedTime.edit.newActor", undefined, "Ny aktør")}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t("umbrella.allocatedTime.edit.selectNewActor", undefined, "Velg ny aktør...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {subActors.map((actor) => (
                      <SelectItem key={actor.id} value={actor.id.toString()}>
                        {actor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t("umbrella.common.cancel", undefined, "Avbryt")}
                </Button>
                <Button variant="destructive">
                  {t("umbrella.allocatedTime.edit.recall", undefined, "Trekke tilbake")}
                </Button>
                <Button>
                  {t("umbrella.common.save", undefined, "Lagre")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Release Dialog */}
        <Dialog open={isReleaseDialogOpen} onOpenChange={setIsReleaseDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("umbrella.allocatedTime.release.title", undefined, "Frigi tid")}</DialogTitle>
              <DialogDescription>
                {t("umbrella.allocatedTime.release.description", undefined, "Velg dato(er) eller periode og frigi tid")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("umbrella.allocatedTime.release.selectPeriod", undefined, "Velg periode")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" placeholder={t("umbrella.allocatedTime.release.startDate", undefined, "Startdato")} />
                  <Input type="date" placeholder={t("umbrella.allocatedTime.release.endDate", undefined, "Sluttdato")} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Velg klokkeslett</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" placeholder="Starttid" />
                  <Input type="time" placeholder="Sluttid" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="convertToSpare" />
                <label htmlFor="convertToSpare" className="text-sm">
                  {t("umbrella.allocatedTime.release.convertToSpare", undefined, "Konverter til strøtimer")}
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReleaseDialogOpen(false)}>
                  {t("umbrella.common.cancel", undefined, "Avbryt")}
                </Button>
                <Button variant="destructive">
                  {t("umbrella.allocatedTime.release.confirm", undefined, "Frigi tid")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AllocatedTimePage;
