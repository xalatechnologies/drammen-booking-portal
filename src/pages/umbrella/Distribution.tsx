import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Users, Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const Distribution = () => {
  const { t } = useTranslation();

  const [distributionData, setDistributionData] = useState([
    { id: 1, name: "Brandengen Skole", users: 25, allocated: 75, used: 60 },
    { id: 2, name: " পৌরসভা সিটি কর্পোরেশন উচ্চ বিদ্যালয়", users: 18, allocated: 60, used: 45 },
    { id: 3, name: "Hønefoss barneskole", users: 32, allocated: 90, used: 70 },
  ]);

  const totalAllocated = distributionData.reduce((sum, item) => sum + item.allocated, 0);
  const totalUsed = distributionData.reduce((sum, item) => sum + item.used, 0);

  return (
    <div>
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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{t("umbrella.distribution.timeAllocation", undefined, "Tidsfordeling")}</CardTitle>
          <CardDescription>{t("umbrella.distribution.timeAllocationDescription", undefined, "Oversikt over hvordan tiden er fordelt mellom organisasjoner")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>{t("umbrella.distribution.allocatedHours", undefined, "Tildelte timer")}</span>
                <span>{totalAllocated} {t("umbrella.distribution.hours", undefined, "timer")}</span>
              </div>
              <Progress value={(totalAllocated / (totalAllocated + totalUsed)) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>{t("umbrella.distribution.usedHours", undefined, "Brukte timer")}</span>
                <span>{totalUsed} {t("umbrella.distribution.hours", undefined, "timer")}</span>
              </div>
              <Progress value={(totalUsed / (totalAllocated + totalUsed)) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        {distributionData.map((item) => (
          <Card key={item.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {item.name}
                <Badge variant="secondary">
                  <Users className="w-4 h-4 mr-2" />
                  {item.users} {t("umbrella.distribution.users", undefined, "Brukere")}
                </Badge>
              </CardTitle>
              <CardDescription>
                {t("umbrella.distribution.timeManagement", undefined, "Tidsstyring for")} {item.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>{t("umbrella.distribution.allocatedHours", undefined, "Tildelte timer")}</span>
                    <span>{item.allocated} {t("umbrella.distribution.hours", undefined, "timer")}</span>
                  </div>
                  <Progress value={(item.used / item.allocated) * 100} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>{t("umbrella.distribution.usedHours", undefined, "Brukte timer")}</span>
                    <span>{item.used} {t("umbrella.distribution.hours", undefined, "timer")}</span>
                  </div>
                  <Progress value={(item.used / item.allocated) * 100} />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("umbrella.distribution.viewCalendar", undefined, "Se kalender")}
                </Button>
                <Button>
                  <Clock className="w-4 h-4 mr-2" />
                  {t("umbrella.distribution.manageTime", undefined, "Administrer tid")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Distribution;
