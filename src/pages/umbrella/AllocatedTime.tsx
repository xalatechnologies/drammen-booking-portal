import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const AllocatedTimePage: React.FC = () => {
  const [allocatedTime, setAllocatedTime] = useState("8 timer");
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t("umbrella.allocatedTime.title", undefined, "Tildelt Rammetid")}
        description={t("umbrella.allocatedTime.description", undefined, "Oversikt over tildelt rammetid for organisasjonen")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("umbrella.allocatedTime.allocatedTime", undefined, "Tildelt tid")}</CardTitle>
          <CardDescription>
            {t("umbrella.allocatedTime.allocatedTimeDescription", undefined, "Se og administrer tildelt rammetid")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t("umbrella.allocatedTime.totalAllocated", undefined, "Totalt tildelt")}: {allocatedTime}</p>
          <Button>{t("umbrella.common.adjust", undefined, "Juster tid")}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllocatedTimePage;
