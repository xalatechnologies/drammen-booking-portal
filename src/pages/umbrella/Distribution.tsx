import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import { mockSubOrganizations } from './Overview';

const Distribution = () => {
  return (
    <div className="p-8">
        <PageHeader 
            title="Fordel tid til underaktører"
            description="Distribuer de tilgjengelige timene til tilknyttede klubber og lag."
            actions={<Button><ArrowRight className="mr-2 h-4 w-4" /> Start fordeling</Button>}
        />
        <Card>
            <CardHeader>
                <CardTitle>Tildelte timer per underaktør</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Underaktør</TableHead>
                      <TableHead>Tildelte timer</TableHead>
                      <TableHead className="text-right">Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.allocatedHours}t</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Endre</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
};

export default Distribution; 