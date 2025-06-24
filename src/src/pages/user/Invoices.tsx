import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-001', date: '2024-08-01', amount: '450,00 kr', status: 'Betalt' },
  { id: 'INV-002', date: '2024-09-01', amount: '600,00 kr', status: 'Betalt' },
  { id: 'INV-003', date: '2024-10-01', amount: '450,00 kr', status: 'Ubetalt' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
      case "Betalt":
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{status}</Badge>;
      case "Ubetalt":
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
};

const InvoicesPage = () => {
    return (
        <div className="space-y-8">
            <PageHeader 
                title="Mine Fakturaer"
                description="Oversikt over dine fakturaer for leie av lokaler og anlegg."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Fakturahistorikk</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fakturanr.</TableHead>
                                <TableHead>Dato</TableHead>
                                <TableHead>Beløp</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Handling</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Last ned
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default InvoicesPage;
