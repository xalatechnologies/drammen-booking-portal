import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useSearch } from '@/contexts/SearchContext';

const initialUserBookings = [
  { id: 1, facility: 'Fjell Skole - Aktivitetshall', date: '2024-09-10', time: '17:00 - 18:00', status: 'Godkjent' },
  { id: 2, facility: 'Drammenshallen - Bane B', date: '2024-09-12', time: '19:00 - 20:30', status: 'Venter på behandling' },
  { id: 3, facility: 'Åssiden Fotballhall', date: '2024-08-20', time: '16:00 - 17:00', status: 'Avvist' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
      case "Godkjent":
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{status}</Badge>;
      case "Venter på behandling":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">{status}</Badge>;
      case "Avvist":
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState(initialUserBookings);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const { searchTerm } = useSearch();

    const filteredBookings = useMemo(() => {
        if (!searchTerm) return bookings;
        return bookings.filter(booking => 
            booking.facility.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, bookings]);

    const handleDeleteClick = (id: number) => {
        setSelectedBookingId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedBookingId) {
            setBookings(bookings.filter(b => b.id !== selectedBookingId));
        }
        setIsDeleteDialogOpen(false);
        setSelectedBookingId(null);
    }

  return (
    <div className="space-y-8">
        <PageHeader 
            title="Mine Søknader"
            description="Her er en oversikt over dine tidligere og kommende søknader om tid."
            actions={<Button><PlusCircle className="mr-2 h-4 w-4" /> Ny søknad</Button>}
        />

        <Card>
            <CardHeader>
                <CardTitle>Søknadshistorikk</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Lokale</TableHead>
                    <TableHead>Dato</TableHead>
                    <TableHead>Tid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.facility}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Åpne meny</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Endre</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(booking.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Slett</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Er du helt sikker?</AlertDialogTitle>
                <AlertDialogDescription>
                    Denne handlingen kan ikke angres. Dette vil permanent slette din bookingforespørsel.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                    Ja, slett booking
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default UserBookingsPage; 