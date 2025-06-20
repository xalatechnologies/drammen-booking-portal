import React from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail, Phone, ArrowRight } from 'lucide-react';

const HelpPage = () => {
    return (
        <div className="space-y-8">
            <PageHeader 
                title="Hjelp og Støtte"
                description="Trenger du hjelp? Her finner du svar på vanlige spørsmål og hvordan du kan kontakte oss."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <LifeBuoy className="mr-3 h-6 w-6 text-blue-600" />
                            Ofte Stilte Spørsmål (FAQ)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            Har du lurt på hvordan du endrer en booking eller hva statusene betyr? Svarene finner du i vår FAQ-seksjon.
                        </p>
                        <Button variant="outline">
                            Gå til FAQ <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className="mr-3 h-6 w-6 text-blue-600" />
                            Kontakt Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-gray-600">
                            Finner du ikke svaret du leter etter? Vårt support-team er klare til å hjelpe deg.
                        </p>
                        <div className="flex items-center gap-3 text-gray-800">
                            <Mail className="h-5 w-5" />
                            <span>support@drammen.kommune.no</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-800">
                            <Phone className="h-5 w-5" />
                            <span>32 04 00 00</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default HelpPage; 