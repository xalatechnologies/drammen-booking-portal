import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, MoreHorizontal, FileText, Send, FileDown, Search, X } from 'lucide-react';
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";


const generateMockInvoices = (t: (key: string) => string) => [
    { 
        id: 'INV-001', date: '2024-08-01', dueDate: '2024-08-31', amount: 450.00, kid: '12345678901', 
        status: t('user.invoices.statusType.paid'), ubwStatus: 'Overført', actor: 'Drammen IF',
        lines: [
            { description: 'Leie Drammenshallen (August)', amount: 450.00, vat: 0 },
        ]
    },
    { 
        id: 'INV-002', date: '2024-09-01', dueDate: '2024-10-01', amount: 600.00, kid: '12345678902',
        status: t('user.invoices.statusType.paid'), ubwStatus: 'Overført', actor: 'Fjell SK',
        lines: [
            { description: 'Leie Fjellhallen (September)', amount: 600.00, vat: 0 },
        ]
    },
    { 
        id: 'INV-003', date: '2024-10-01', dueDate: '2024-10-31', amount: 450.00, kid: '12345678903',
        status: t('user.invoices.statusType.unpaid'), ubwStatus: 'Feilet', actor: 'Drammen IF',
        lines: [
            { description: 'Leie Drammenshallen (Oktober)', amount: 450.00, vat: 0 },
        ]
    },
    { 
        id: 'INV-004', date: '2024-10-05', dueDate: '2024-11-04', amount: 250.00, kid: '12345678904',
        status: t('user.invoices.statusType.sent'), ubwStatus: 'Avventer', actor: 'Privatleie Hansen',
        lines: [
            { description: 'Leie Møterom 1 (5 timer)', amount: 200.00, vat: 50.00 },
        ]
    },
];

const InvoicesPage = () => {
    const { t } = useTranslation();
    const mockInvoices = useMemo(() => generateMockInvoices(key => t(key)), [t]);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInvoices = useMemo(() => {
        return mockInvoices.filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            
            if (date?.from && invoiceDate < date.from) return false;
            if (date?.to && invoiceDate > addDays(date.to, 1)) return false;

            if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const inActor = invoice.actor.toLowerCase().includes(term);
                const inLineDescription = invoice.lines.some(line => line.description.toLowerCase().includes(term));
                const inId = invoice.id.toLowerCase().includes(term);
                if (!inActor && !inLineDescription && !inId) return false;
            }
            
            return true;
        }).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }, [mockInvoices, date, statusFilter, searchTerm]);

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            [t('user.invoices.statusType.paid')]: "text-green-600 border-green-200 bg-green-50",
            [t('user.invoices.statusType.unpaid')]: "text-red-600 border-red-200 bg-red-50",
            [t('user.invoices.statusType.sent')]: "text-blue-600 border-blue-200 bg-blue-50",
        };
        return <Badge variant="outline" className={statusMap[status] || ''}>{status}</Badge>;
    };
    
    const getUbwStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'Overført': "text-green-600",
            'Feilet': "text-red-600",
            'Avventer': "text-yellow-600",
        };
        return <Badge variant="secondary" className={statusMap[status] || ''}>{status}</Badge>;
    }

    const handleViewDetails = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-8">
            <PageHeader 
                title={t('user.invoices.title')}
                description={t('user.invoices.description')}
            />

            <Card>
                <CardHeader>
                    <CardTitle>{t('user.invoices.filters.title')}</CardTitle>
                    <CardDescription>{t('user.invoices.filters.description')}</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                    date.to ? (
                                        <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                    ) : (
                                    <span>{t('user.invoices.filters.dateRange')}</span>
                                    )}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={2}/>
                                </PopoverContent>
                            </Popover>
                            {date && (
                                <Button variant="ghost" size="icon" onClick={() => setDate(undefined)} className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('user.invoices.filters.status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('user.invoices.statusType.all')}</SelectItem>
                                <SelectItem value={t('user.invoices.statusType.paid')}>{t('user.invoices.statusType.paid')}</SelectItem>
                                <SelectItem value={t('user.invoices.statusType.unpaid')}>{t('user.invoices.statusType.unpaid')}</SelectItem>
                                <SelectItem value={t('user.invoices.statusType.sent')}>{t('user.invoices.statusType.sent')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input 
                                placeholder={t('user.invoices.filters.searchPlaceholder')} 
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                     <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">{t('user.invoices.filters.lastExport', { date: '2024-11-01 04:00' })}</p>
                        <Button variant="outline"><FileDown className="mr-2 h-4 w-4" />{t('user.invoices.filters.exportButton')}</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('user.invoices.history')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('user.invoices.invoiceNumber')}</TableHead>
                                <TableHead>{t('user.invoices.kid')}</TableHead>
                                <TableHead>{t('user.invoices.date')}</TableHead>
                                <TableHead>{t('user.invoices.dueDate')}</TableHead>
                                <TableHead className="text-right">{t('user.invoices.amount')}</TableHead>
                                <TableHead>{t('user.invoices.status')}</TableHead>
                                <TableHead>{t('user.invoices.ubwStatus')}</TableHead>
                                <TableHead className="text-right">{t('user.invoices.action')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.id}</TableCell>
                                        <TableCell className="font-mono text-xs">{invoice.kid}</TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.dueDate}</TableCell>
                                        <TableCell className="text-right">{invoice.amount.toFixed(2)} kr</TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell>{getUbwStatusBadge(invoice.ubwStatus)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDetails(invoice)}><FileText className="mr-2 h-4 w-4"/>{t('user.invoices.actions.viewDetails')}</DropdownMenuItem>
                                                    <DropdownMenuItem><Download className="mr-2 h-4 w-4"/>{t('user.invoices.actions.downloadPdf')}</DropdownMenuItem>
                                                    <DropdownMenuItem><FileDown className="mr-2 h-4 w-4"/>{t('user.invoices.actions.downloadEhf')}</DropdownMenuItem>
                                                    <DropdownMenuItem><Send className="mr-2 h-4 w-4"/>{t('user.invoices.actions.resend')}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        Ingen fakturaer funnet for de valgte filtrene.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('user.invoices.detailsDialog.title')} - {selectedInvoice?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedInvoice && (
                        <div className="py-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('user.invoices.detailsDialog.invoiceLine')}</TableHead>
                                        <TableHead className="text-right">{t('user.invoices.detailsDialog.price')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedInvoice.lines.map((line: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{line.description}</TableCell>
                                            <TableCell className="text-right">{line.amount.toFixed(2)} kr</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold border-t-2">
                                        <TableCell>{t('user.invoices.detailsDialog.total')}</TableCell>
                                        <TableCell className="text-right">{selectedInvoice.amount.toFixed(2)} kr</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>{t('user.invoices.detailsDialog.close')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InvoicesPage;
