import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Users, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/admin/PageHeader';

export const mockRammetid = [
  { id: 1, facility: 'Drammenshallen - Bane A', day: 'Mandager', time: '18:00 - 20:00', totalHours: 104, remainingHours: 40 },
  { id: 2, facility: 'Brandengen Skole - Gymsal', day: 'Onsdager', time: '19:00 - 21:00', totalHours: 104, remainingHours: 60 },
];

export const mockSubOrganizations = [
  { id: 'sub1', name: 'Drammen Håndballklubb', allocatedHours: 30 },
  { id: 'sub2', name: 'Glassverket IF Turn', allocatedHours: 20 },
  { id: 'sub3', name: 'Drammen Basketball', allocatedHours: 10 },
];

export const mockOrgUsers = [
    { id: 'user1', name: 'Geir Gulliksen', role: 'Trener, A-lag' },
    { id: 'user2', name: 'Heidi Løke', role: 'Oppmann, Junior' },
];


const UmbrellaOverview = () => {
    const navigate = useNavigate();

    const totalAllocatedHours = mockRammetid.reduce((acc, curr) => acc + curr.totalHours, 0);
    const totalRemainingHours = mockRammetid.reduce((acc, curr) => acc + curr.remainingHours, 0);

  return (
    <div className="p-8 space-y-8">
       <PageHeader 
        title="Velkommen, Paraplyadministrator"
        description="Her kan du administrere tildelt tid og brukere for din organisasjon."
      />
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <Clock className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{totalAllocatedHours}t</p>
            <p className="text-sm text-gray-600">Totalt tildelt tid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Clock className="h-6 w-6 text-green-500 mb-4" />
            <p className="text-2xl font-bold">{totalRemainingHours}t</p>
            <p className="text-sm text-gray-600">Gjenværende tid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Share2 className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{mockSubOrganizations.length}</p>
            <p className="text-sm text-gray-600">Tilknyttede aktører</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Users className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{mockOrgUsers.length}</p>
            <p className="text-sm text-gray-600">Organisasjonsbrukere</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Snarveier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-lg py-6" onClick={() => navigate('/minside/paraply/rammetid')}>
                    <Clock className="mr-4 h-5 w-5" />
                    Administrer tildelt tid
                </Button>
                <Button variant="outline" className="w-full justify-start text-lg py-6" onClick={() => navigate('/minside/paraply/fordeling')}>
                    <Share2 className="mr-4 h-5 w-5" />
                    Fordel tid til underaktører
                </Button>
                <Button variant="outline" className="w-full justify-start text-lg py-6" onClick={() => navigate('/minside/paraply/brukere')}>
                    <Users className="mr-4 h-5 w-5" />
                    Administrer brukere
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Nylig aktivitet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500">Ingen nylig aktivitet å vise.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UmbrellaOverview; 