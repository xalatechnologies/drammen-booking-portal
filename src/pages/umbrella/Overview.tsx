import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const OverviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(50);
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t("umbrella.overview.title", "Oversikt")}
        description={t("umbrella.overview.description", "Dashboard oversikt og sammendrag av nøkkeltall")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{t("umbrella.overview.cards.bookings.title", "Reservasjoner")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.cards.bookings.description", "Totalt antall reservasjoner denne måneden")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">325</div>
            <div className="text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+12% {t("umbrella.overview.cards.bookings.trend", "fra forrige måned")}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{t("umbrella.overview.cards.users.title", "Brukere")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.cards.users.description", "Totalt antall aktive brukere")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,450</div>
            <div className="text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+5% {t("umbrella.overview.cards.bookings.trend", "fra forrige måned")}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{t("umbrella.overview.cards.avgBookingDuration.title", "Gjennomsnittlig reservasjonstid")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.cards.avgBookingDuration.description", "Gjennomsnittlig varighet av reservasjoner")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.5 hrs</div>
            <div className="text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+3% {t("umbrella.overview.cards.bookings.trend", "fra forrige måned")}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{t("umbrella.overview.cards.alerts.title", "Varsler")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.cards.alerts.description", "Systemvarsler og meldinger")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{t("umbrella.overview.alerts.lowServerResources", "Lave serverressurser")}</span>
                <Badge variant="destructive">{t("umbrella.common.high", "Høy")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("umbrella.overview.alerts.pendingUserApprovals", "Ventende brukergodkjenninger")}</span>
                <Badge variant="secondary">{t("umbrella.common.medium", "Medium")}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("umbrella.overview.cards.tasks.title", "Oppgaver")}</span>
            </CardTitle>
            <CardDescription>{t("umbrella.overview.cards.tasks.description", "Pågående oppgaver og fremdrift")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{t("umbrella.overview.tasks.databaseOptimization", "Databaseoptimalisering")}</span>
                <span>
                  <Progress value={progress} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("umbrella.overview.tasks.userInterfaceImprovements", "Brukergrensesnittforbedringer")}</span>
                <span>
                  <Progress value={70} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("umbrella.overview.cards.loadingState.title", "Laster tilstand")}</CardTitle>
            <CardDescription>{t("umbrella.overview.cards.loadingState.description", "Viser en lastende tilstand")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">{t("umbrella.overview.loading", "Laster...")}</div>
            ) : (
              <Button onClick={() => setLoading(true)}>{t("umbrella.overview.buttons.loadData", "Last data")}</Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("umbrella.overview.cards.errorState.title", "Feil tilstand")}</CardTitle>
            <CardDescription>{t("umbrella.overview.cards.errorState.description", "Viser en feil tilstand")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500">{t("umbrella.overview.error", "Feil: Kunne ikke hente data.")}</div>
            ) : (
              <Button onClick={() => setError(true)}>{t("umbrella.overview.buttons.triggerError", "Utløs feil")}</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
