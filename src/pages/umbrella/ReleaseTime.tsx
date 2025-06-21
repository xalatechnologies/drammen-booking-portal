import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const ReleaseTimePage = () => {
    return (
        <div className="space-y-8">
            <PageHeader 
                title="Frigi tid til strøtimer"
                description="Her kan du frigi tildelt tid som din organisasjon ikke skal benytte."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Frigi ubrukt tid</CardTitle>
                    <CardDescription>
                        Tid som frigis her blir tilgjengelig for andre som strøtimer. Handlingen kan ikke angres.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 mb-4">Funksjonalitet for å velge og frigi tid kommer her.</p>
                        <Button>
                            <Clock className="mr-2 h-4 w-4" />
                            Start frigjøringsprosess
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ReleaseTimePage;
