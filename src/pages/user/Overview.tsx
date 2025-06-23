import React from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { ArrowRight, FilePlus, Calendar, Receipt, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Assume these mock data sources are available for summary
// In a real app, these would be dedicated API calls for summaries
const mockApplications = [
    { id: 'APP-002', type: 'Engangslån', location: 'Åssidenhallen', time: '2024-11-20, 10:00 - 16:00', applicant: 'Privatperson', status: 'Under behandling' },
    { id: 'APP-001', type: 'Fastlån', location: 'Drammenshallen', time: 'Tirsdager 18:00 - 20:00 (Høst 2024)', applicant: 'Drammen IF', status: 'Godkjent' },
];
const mockBookings = [
    { id: 'BOOK-001', facilityName: 'Drammenshallen', bookingDate: '2024-11-05', timeSlot: '18:00 - 20:00' },
    { id: 'BOOK-002', facilityName: 'Brandengen Skole - Gymsal', bookingDate: '2024-11-10', timeSlot: '15:00 - 16:00' },
];
const mockInvoices = [
    { id: 'INV-123', amount: '1500 NOK', status: 'Ubetalt' },
];

const OverviewPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getStatusBadge = (status: string) => {
        // @ts-ignore
        const statusKey = Object.keys(t('user.applications.status', { returnObjects: true })).find(key => t(`user.applications.status.${key}`) === status);
        switch (statusKey) {
            case 'approved': return <Badge variant="default" className="bg-green-600">{status}</Badge>;
            case 'pending': return <Badge variant="secondary">{status}</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };
    
    return (
        <div>
            <PageHeader
                title={t('user.overview.title')}
                description={t('user.overview.description')}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Summaries */}
                <div className="md:col-span-2 space-y-6">
                    {/* Latest Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('user.overview.latestApplications')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mockApplications.length > 0 ? (
                                <ul className="space-y-4">
                                    {mockApplications.slice(0, 3).map(app => (
                                        <li key={app.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{app.location}</p>
                                                <p className="text-sm text-gray-500">{app.id} - {app.time}</p>
                                            </div>
                                            {getStatusBadge(app.status)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">{t('user.overview.noRecentApplications')}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('user.overview.upcomingBookings')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {mockBookings.length > 0 ? (
                                <ul className="space-y-4">
                                    {mockBookings.slice(0, 3).map(booking => (
                                        <li key={booking.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{booking.facilityName}</p>
                                                <p className="text-sm text-gray-500">{booking.bookingDate} @ {booking.timeSlot}</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => navigate('/minside/bruker/bookinger')}>{t('user.overview.view')}</Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">{t('user.overview.noUpcomingBookings')}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Quick Actions & Invoices */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('user.overview.quickActions')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <Button onClick={() => navigate('/minside/bruker/soknader')} className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" /> {t('user.overview.allApplications')}
                            </Button>
                            <Button onClick={() => navigate('/minside/bruker/bookinger')} className="w-full justify-start">
                                <Calendar className="mr-2 h-4 w-4" /> {t('user.overview.allBookings')}
                            </Button>
                            <Button onClick={() => navigate('/minside/bruker/fakturaer')} className="w-full justify-start">
                                <Receipt className="mr-2 h-4 w-4" /> {t('user.overview.viewInvoices')}
                            </Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>{t('user.overview.unpaidInvoices')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mockInvoices.filter(inv => inv.status === 'Ubetalt').length > 0 ? (
                                <div>
                                    <p className="text-2xl font-bold">{mockInvoices.filter(inv => inv.status === 'Ubetalt').length} Ubetalt</p>
                                    <Button size="sm" className="mt-2" onClick={() => navigate('/minside/bruker/fakturaer')}>
                                        {t('user.overview.viewInvoices')} <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                </div>
                            ) : (
                                 <p className="text-sm text-gray-500">{t('user.overview.noUnpaidInvoices')}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
