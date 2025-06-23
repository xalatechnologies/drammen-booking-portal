
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock, Users, FileText, Search, Filter, Eye, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface Application {
  id: string;
  facility: string;
  date: string;
  time: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  type: 'engangs' | 'fastlan' | 'rammetid';
  participants: number;
  purpose: string;
  submittedDate: string;
  priority: 'normal' | 'high' | 'urgent';
  location: string;
  contact: string;
  notes?: string;
  estimatedCost: number;
  isPaid: boolean;
  hasSpecialRequirements: boolean;
}

const mockApplications: Application[] = [
  {
    id: 'APP-2025-001',
    facility: 'Brandengen Skole - Gymsal',
    date: '2025-07-15',
    time: '18:00',
    duration: '2 timer',
    status: 'pending',
    type: 'engangs',
    participants: 25,
    purpose: 'Fotballtrening',
    submittedDate: '2025-06-20',
    priority: 'normal',
    location: 'Drammen',
    contact: 'Lars Hansen',
    estimatedCost: 800,
    isPaid: false,
    hasSpecialRequirements: false,
  },
  {
    id: 'APP-2025-002',
    facility: 'Åssiden Fotballhall',
    date: '2025-07-22',
    time: '20:00',
    duration: '1.5 timer',
    status: 'approved',
    type: 'fastlan',
    participants: 40,
    purpose: 'Kamper og turneringer',
    submittedDate: '2025-06-18',
    priority: 'high',
    location: 'Drammen',
    contact: 'Maria Andersen',
    notes: 'Trenger ekstra utstyr for lyd',
    estimatedCost: 1200,
    isPaid: true,
    hasSpecialRequirements: true,
  },
  {
    id: 'APP-2025-003',
    facility: 'Gulskogen Skole - Auditorium',
    date: '2025-08-05',
    time: '19:00',
    duration: '3 timer',
    status: 'under-review',
    type: 'engangs',
    participants: 80,
    purpose: 'Årsmøte og presentasjon',
    submittedDate: '2025-06-22',
    priority: 'normal',
    location: 'Drammen',
    contact: 'Erik Solberg',
    estimatedCost: 950,
    isPaid: false,
    hasSpecialRequirements: false,
  },
  {
    id: 'APP-2025-004',
    facility: 'Drammensbadet - Svømmehall',
    date: '2025-07-30',
    time: '17:00',
    duration: '2 timer',
    status: 'rejected',
    type: 'rammetid',
    participants: 15,
    purpose: 'Svømmetrening for barn',
    submittedDate: '2025-06-19',
    priority: 'normal',
    location: 'Drammen',
    contact: 'Anne Knutsen',
    notes: 'Avvist på grunn av overlapping med vedlikehold',
    estimatedCost: 600,
    isPaid: false,
    hasSpecialRequirements: false,
  },
];

const ApplicationsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under-review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Application['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    const matchesTab = selectedTab === 'all' || app.status === selectedTab;

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return mockApplications.length;
    return mockApplications.filter(app => app.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('user.applications.title', {}, 'Mine søknader')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('user.applications.subtitle', {}, 'Oversikt over alle dine anleggssøknader')}
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          {t('user.applications.newApplication', {}, 'Ny søknad')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('user.applications.search', {}, 'Søk i søknader...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all', {}, 'Alle')}</SelectItem>
                  <SelectItem value="pending">{t('booking.status.pending', {}, 'Venter')}</SelectItem>
                  <SelectItem value="approved">{t('booking.status.approved', {}, 'Godkjent')}</SelectItem>
                  <SelectItem value="rejected">{t('booking.status.rejected', {}, 'Avvist')}</SelectItem>
                  <SelectItem value="under-review">{t('booking.status.underReview', {}, 'Under vurdering')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all', {}, 'Alle')}</SelectItem>
                  <SelectItem value="engangs">{t('booking.types.engangs', {}, 'Engangs')}</SelectItem>
                  <SelectItem value="fastlan">{t('booking.types.fastlan', {}, 'Fast leie')}</SelectItem>
                  <SelectItem value="rammetid">{t('booking.types.rammetid', {}, 'Rammetid')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            {t('common.all', {}, 'Alle')} ({getTabCount('all')})
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('booking.status.pending', {}, 'Venter')} ({getTabCount('pending')})
          </TabsTrigger>
          <TabsTrigger value="approved">
            {t('booking.status.approved', {}, 'Godkjent')} ({getTabCount('approved')})
          </TabsTrigger>
          <TabsTrigger value="under-review">
            {t('booking.status.underReview', {}, 'Under vurdering')} ({getTabCount('under-review')})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            {t('booking.status.rejected', {}, 'Avvist')} ({getTabCount('rejected')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('user.applications.noApplications', {}, 'Ingen søknader funnet')}
                </h3>
                <p className="text-gray-500">
                  {t('user.applications.noApplicationsDescription', {}, 'Du har ingen søknader som matcher de valgte filtrene.')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.facility}
                          </h3>
                          <Badge className={getStatusColor(application.status)}>
                            {t(`booking.status.${application.status}`, {}, application.status)}
                          </Badge>
                          <Badge className={getPriorityColor(application.priority)}>
                            {t(`booking.priority.${application.priority}`, {}, application.priority)}
                          </Badge>
                          <Badge variant="outline">
                            {t(`booking.types.${application.type}`, {}, application.type)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{application.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{application.time} ({application.duration})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{application.participants} personer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{application.location}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{t('user.applications.purpose', {}, 'Formål')}:</span> {application.purpose}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{t('user.applications.contact', {}, 'Kontakt')}:</span> {application.contact}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{t('user.applications.submitted', {}, 'Innsendt')}:</span> {application.submittedDate}
                          </p>
                          {application.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">{t('user.applications.notes', {}, 'Notater')}:</span> {application.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-900">
                              {application.estimatedCost} NOK
                            </span>
                            <Badge variant={application.isPaid ? 'default' : 'secondary'}>
                              {application.isPaid ? t('user.applications.paid', {}, 'Betalt') : t('user.applications.unpaid', {}, 'Ikke betalt')}
                            </Badge>
                            {application.hasSpecialRequirements && (
                              <Badge variant="outline">
                                {t('user.applications.specialRequirements', {}, 'Spesielle krav')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t('common.view', {}, 'Se')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t('common.messages', {}, 'Meldinger')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsPage;

