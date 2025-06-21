import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useTranslation } from "@/i18n/hooks/useTranslation";

const ReleaseTimePage = () => {
    const { t } = useTranslation();
    
    return (
        <div className="space-y-8">
            <PageHeader 
                title={t("umbrella.releaseTime.title", undefined, "Frigi Tid til Strøtimer")}
                description={t("umbrella.releaseTime.description", undefined, "Administrer frigivelse av tildelt tid til strøtimer")}
            />
            <Card>
                <CardHeader>
                    <CardTitle>{t("umbrella.releaseTime.releaseTime", undefined, "Frigi tid")}</CardTitle>
                    <CardDescription>
                        {t("umbrella.releaseTime.releaseTimeDescription", undefined, "Frigi tildelt tid som kan brukes av andre organisasjoner")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 mb-4">Funksjonalitet for å velge og frigi tid kommer her.</p>
                        <Button>
                            <Clock className="mr-2 h-4 w-4" />
                            {t("umbrella.releaseTime.confirmRelease", undefined, "Start frigjøringsprosess")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ReleaseTimePage;
