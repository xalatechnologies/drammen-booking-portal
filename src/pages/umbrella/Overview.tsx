import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock, AlertCircle, CheckCircle, TrendingUp, CalendarDays, Share2, History, Bell } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const OverviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  // Mock data for demonstration
  const allocatedTimeData = {
    total: 120,
    used: 85,
    remaining: 35,
    percentage: 71
  };

  const distributions = [
    { id: 1, club: "Drammen IF", time: "Tirsdager 18-20", facility: "Drammenshallen", status: "Aktiv", allocated: 20, used: 15 },
    { id: 2, club: "Åssiden IF", time: "Onsdager 19-21", facility: "Åssidenhallen", status: "Aktiv", allocated: 15, used: 12 },
    { id: 3, club: "Konnerud IL", time: "Fredager 17-19", facility: "Konnerudhallen", status: "Ventende", allocated: 10, used: 0 },
  ];

  const releasedTime = [
    { id: 1, time: "Mandager 20-22", facility: "Drammenshallen", released: "2024-12-15", converted: true, reason: "Automatisk frigivelse" },
    { id: 2, time: "Torsdager 18-20", facility: "Åssidenhallen", released: "2024-12-10", converted: false, reason: "Manuell frigivelse" },
  ];

  const notifications = [
    { id: 1, type: "warning", message: "Tid til Konnerud IL utløper om 2 uker", date: "2024-12-25" },
    { id: 2, type: "info", message: "5 timer ikke brukt siste 3 uker", date: "2024-12-20" },
    { id: 3, type: "success", message: "Ny tildeling godkjent for Drammen IF", date: "2024-12-18" },
  ];

  const recentHistory = [
    { id: 1, user: "Kari Nordmann", action: "Tildelt tid til Konnerud IL", date: "2024-12-19 14:30", details: "Fredager 17-19 i Konnerudhallen" },
    { id: 2, user: "System", action: "Automatisk frigivelse", date: "2024-12-15 08:00", details: "Mandager 20-22 i Drammenshallen" },
    { id: 3, user: "Ola Hansen", action: "Endret fordeling", date: "2024-12-14 16:45", details: "Drammen IF fikk 2 ekstra timer" },
  ];

  return (
    <div>
      <PageHeader
        title={t("umbrella.overview.title", undefined, "Oversiktsside for Paraplyorganisasjon")}
        description={t("umbrella.overview.description", undefined, "Administrer tildelt rammetid og fordeling til underaktører")}
      />

      {/* 1. Mine tildelte tider (Rammetid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5" />
              <span>{t("umbrella.overview.allocatedTime.title", undefined, "Mine tildelte tider (Rammetid)")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.allocatedTime.description", undefined, "Kalenderoversikt over rammetid og status")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{allocatedTimeData.total}</div>
                <div className="text-sm text-gray-600">{t("umbrella.overview.allocatedTime.total", undefined, "Totalt tildelt")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{allocatedTimeData.used}</div>
                <div className="text-sm text-gray-600">{t("umbrella.overview.allocatedTime.used", undefined, "Fordelt")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{allocatedTimeData.remaining}</div>
                <div className="text-sm text-gray-600">{t("umbrella.overview.allocatedTime.remaining", undefined, "Ufordelt")}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("umbrella.overview.allocatedTime.utilization", undefined, "Utnyttelse")}</span>
                <span>{allocatedTimeData.percentage}%</span>
              </div>
              <Progress value={allocatedTimeData.percentage} className="h-2" />
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                {t("umbrella.overview.allocatedTime.viewCalendar", undefined, "Se kalenderoversikt")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>{t("umbrella.overview.notifications.title", undefined, "Varsler")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.notifications.description", undefined, "Kun relevante varsler")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${
                    notification.type === 'warning' ? 'text-orange-500' : 
                    notification.type === 'info' ? 'text-blue-500' : 'text-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Fordelinger til klubber/foreninger */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>{t("umbrella.overview.distributions.title", undefined, "Fordelinger til klubber/foreninger")}</span>
          </CardTitle>
          <CardDescription>{t("umbrella.overview.distributions.description", undefined, "Liste over hvilke tider som er fordelt til hvem")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributions.map((distribution) => (
              <div key={distribution.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{distribution.club}</h4>
                      <p className="text-sm text-gray-600">{distribution.time} • {distribution.facility}</p>
                    </div>
                    <Badge variant={distribution.status === 'Aktiv' ? 'default' : 'secondary'}>
                      {distribution.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <span className="font-medium">{distribution.used}</span>
                    <span className="text-gray-500">/{distribution.allocated} {t("umbrella.overview.distributions.hours", undefined, "timer")}</span>
                  </div>
                  <Progress value={(distribution.used / distribution.allocated) * 100} className="w-20 h-1 mt-1" />
                </div>
                <div className="ml-4 space-x-2">
                  <Button variant="outline" size="sm">
                    {t("umbrella.overview.distributions.edit", undefined, "Endre")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("umbrella.overview.distributions.recall", undefined, "Tilbakekall")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Frigitt tid */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>{t("umbrella.overview.releasedTime.title", undefined, "Frigitt tid")}</span>
          </CardTitle>
          <CardDescription>{t("umbrella.overview.releasedTime.description", undefined, "Oversikt over tider som er frigitt (automatisk eller manuelt)")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {releasedTime.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.time} • {item.facility}</h4>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                  <p className="text-xs text-gray-500">{t("umbrella.overview.releasedTime.released", undefined, "Frigitt")}: {item.released}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.converted ? 'default' : 'secondary'}>
                    {item.converted ? t("umbrella.overview.releasedTime.converted", undefined, "Konvertert til strøtimer") : t("umbrella.overview.releasedTime.notConverted", undefined, "Ikke konvertert")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Historikk og logg */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>{t("umbrella.overview.history.title", undefined, "Historikk og logg")}</span>
          </CardTitle>
          <CardDescription>{t("umbrella.overview.history.description", undefined, "Hvem som har gjort hva")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentHistory.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
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
              <History className="w-4 h-4 mr-2" />
              {t("umbrella.overview.history.viewAll", undefined, "Se all historikk")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
