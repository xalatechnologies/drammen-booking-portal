import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/admin/PageHeader';
import { mockRammetid } from './Overview';

const AllocatedTime = () => {
  return (
    <div className="p-8">
        <PageHeader 
            title="Tildelt Tid (Rammetid)"
            description="Oversikt over den totale tiden tildelt til din paraplyorganisasjon for sesongen."
        />
        <Card>
            <CardHeader>
                <CardTitle>Rammetid</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Lokale</TableHead>
                        <TableHead>Dag og Tid</TableHead>
                        <TableHead>Totalt antall timer</TableHead>
                        <TableHead>Gjenværende timer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRammetid.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.facility}</TableCell>
                            <TableCell>{item.day}, {item.time}</TableCell>
                            <TableCell>{item.totalHours}t</TableCell>
                            <TableCell className="font-semibold">{item.remainingHours}t</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
};

export default AllocatedTime; 