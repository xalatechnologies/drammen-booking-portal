import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import { mockOrgUsers } from './Overview';

const Users = () => {
  return (
    <div className="p-8">
        <PageHeader 
            title="Administrer brukere"
            description="Legg til eller fjern administratorer og trenere for din organisasjon."
            actions={<Button><PlusCircle className="mr-2 h-4 w-4" /> Legg til bruker</Button>}
        />
        <Card>
            <CardHeader>
                <CardTitle>Organisasjonsbrukere</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Navn</TableHead>
                        <TableHead>Rolle</TableHead>
                        <TableHead className="text-right">Handlinger</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockOrgUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">Fjern</Button>
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

export default Users; 