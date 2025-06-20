import React from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, FilePlus } from 'lucide-react';

const UserOverviewPage = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-8">
            <PageHeader 
                title="Velkommen, Ola Nordmann!"
                description="Dette er din personlige side. Her har du full oversikt over dine bookinger og søknader."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Snarveier</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start text-lg py-6" onClick={() => navigate('/minside/bruker/bookinger')}>
                            <Calendar className="mr-4 h-5 w-5" />
                            Se mine bookinger
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-lg py-6" onClick={() => navigate('/minside/bruker/soknad')}>
                            <FilePlus className="mr-4 h-5 w-5" />
                            Start ny søknad
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Dine varsler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">Du har ingen nye varsler.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default UserOverviewPage; 