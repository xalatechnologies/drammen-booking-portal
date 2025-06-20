import React from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, FilePlus, Circle } from 'lucide-react';

const mockNotifications = [
    { id: "1", title: "Din booking er godkjent", description: "Booking for Drammenshallen er nå bekreftet.", timestamp: "10 minutter siden", read: false },
    { id: "2", title: "Påminnelse om trening", description: "Du har en trening i Fjell Skole - Aktivitetshall i morgen.", timestamp: "1 dag siden", read: true },
    { id: "3", title: "Ny melding fra kommunen", description: "Viktig info ang. vedlikehold neste uke.", timestamp: "3 dager siden", read: false },
];

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
                        <CardTitle>Dine siste varsler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {mockNotifications.length > 0 ? (
                            <div className="space-y-4">
                                {mockNotifications.sort((a, b) => a.read === b.read ? 0 : a.read ? 1 : -1).map(notification => (
                                    <div key={notification.id} className="flex items-start gap-3">
                                        {!notification.read && (
                                            <Circle className="h-2 w-2 mt-1.5 text-blue-500 fill-current" />
                                        )}
                                        <div className={`flex flex-col gap-0.5 ${notification.read ? 'pl-5 text-gray-500' : ''}`}>
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs">{notification.description}</p>
                                            <p className="text-xs text-gray-400">{notification.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Du har ingen nye varsler.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default UserOverviewPage; 