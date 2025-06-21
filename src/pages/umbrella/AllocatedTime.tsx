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
import { Calendar, Clock, Users, Share2, Edit2, Trash2, Download, Search, Filter, Plus, History, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const AllocatedTimePage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState("table");
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<any>(null);
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);

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
      utilization: 60
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

  return (
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
            <div className="flex items-center space-x-2">
              <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList>
                  <TabsTrigger value="table">{t("umbrella.allocatedTime.overview.tableView", undefined, "Tabell")}</TabsTrigger>
                  <TabsTrigger value="calendar">{t("umbrella.allocatedTime.overview.calendarView", undefined, "Kalender")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtering */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder={t("umbrella.allocatedTime.overview.searchPlaceholder", undefined, "Søk etter lokasjon eller aktør...")}
              className="max-w-md"
            />
            <Select>
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
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("umbrella.allocatedTime.overview.filterStatus", undefined, "Filtrer status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("umbrella.common.all", undefined, "Alle statuser")}</SelectItem>
                <SelectItem value="fordelt">{t("umbrella.allocatedTime.overview.statusDistributed", undefined, "Fordelt")}</SelectItem>
                <SelectItem value="ufordelt">{t("umbrella.allocatedTime.overview.statusUndistributed", undefined, "Ufordelt")}</SelectItem>
                <SelectItem value="delvis">{t("umbrella.allocatedTime.overview.statusPartially", undefined, "Delvis fordelt")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t("umbrella.allocatedTime.overview.export", undefined, "Eksporter")}
            </Button>
          </div>

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
                {allocatedTimeBlocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.location}</TableCell>
                    <TableCell>{block.weekdays.join(", ")}</TableCell>
                    <TableCell>{block.timeSlot}</TableCell>
                    <TableCell>{block.period}</TableCell>
                    <TableCell>
                      <Badge variant={
                        block.status === "Fordelt" ? "default" : 
                        block.status === "Ufordelt" ? "secondary" : "outline"
                      }>
                        {block.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{block.distributedTo || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDistribute(block)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(block)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRelease(block)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t("umbrella.allocatedTime.overview.calendarComingSoon", undefined, "Kalendervisning kommer snart")}</p>
            </div>
          </TabsContent>
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
  );
};

export default AllocatedTimePage;
