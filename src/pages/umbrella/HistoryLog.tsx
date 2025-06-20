import React from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockHistory = [
  { id: 1, user: 'Admin Bruker', userAvatar: 'https://i.pravatar.cc/150?u=admin', action: 'Endret fordeling for Drammen Turn', date: '2024-10-25 14:30' },
  { id: 2, user: 'Admin Bruker', userAvatar: 'https://i.pravatar.cc/150?u=admin', action: 'Tildelte 2 timer til Åssiden IF i Drammenshallen', date: '2024-10-25 11:15' },
  { id: 3, user: 'System', userAvatar: '', action: 'Rammetid for sesongen 2024/2025 ble generert', date: '2024-08-01 08:00' },
];

const HistoryLogPage = () => {
    return (
        <div className="space-y-8">
            <PageHeader 
                title="Logg og Historikk"
                description="Se en fullstendig oversikt over alle endringer gjort i fordelingsprosessen."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Endringslogg</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hvem</TableHead>
                                <TableHead>Handling</TableHead>
                                <TableHead>Dato og Tid</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockHistory.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={entry.userAvatar} />
                                                <AvatarFallback>{entry.user.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <span>{entry.user}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{entry.action}</TableCell>
                                    <TableCell>{entry.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default HistoryLogPage; 