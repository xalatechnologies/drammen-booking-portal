import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Tag, XCircle, AlertTriangle, Receipt, Send, Download, Info } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "sonner";

let mockBookingsData = [
    { id: 'BOOK-001', facilityName: 'Drammenshallen', bookedBy: 'Drammen IF', role: 'Forening', bookingDate: '2024-11-05', startTime: '18:00', endTime: '20:00', type: 'Fastlån', status: 'Bekreftet', purpose: 'Trening G16', rules: 'Husk å rydde etter bruk.' },
    { id: 'BOOK-002', facilityName: 'Brandengen Skole - Gymsal', bookedBy: 'Ola Nordmann', role: 'Privatperson', bookingDate: '2024-11-10', startTime: '15:00', endTime: '16:00', type: 'Strøtime', status: 'Bekreftet', purpose: 'Innebandy', rules: 'Kun innesko er tillatt.' },
    { id: 'BOOK-003', facilityName: 'Åssidenhallen', bookedBy: 'Åssiden IF', role: 'Forening', bookingDate: '2024-10-12', startTime: '19:00', endTime: '21:00', type: 'Fastlån', status: 'Gjennomført', purpose: 'Håndballkamp', rules: '' },
    { id: 'BOOK-004', facilityName: 'Konnerudhallen', bookedBy: 'Konnerud IL', role: 'Forening', bookingDate: '2024-10-20', startTime: '10:00', endTime: '12:00', type: 'Strøtime', status: 'Kansellert', purpose: 'Fotballtrening', rules: '' },
];

const BookingsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("confirmed");
  
  const [dialogs, setDialogs] = useState({ cancel: false, receipt: false });
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const { data: bookings } = useQuery({
    queryKey: ['user-bookings', activeTab],
    queryFn: async () => {
      const statusMapping = {
        confirmed: "Bekreftet",
        completed: "Gjennomført",
        cancelled: "Kansellert",
      };
      // @ts-ignore
      return mockBookingsData.filter(b => b.status === statusMapping[activeTab]);
    },
  });
  
  const bookingMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string, newStatus: string }) => {
        const bookingIndex = mockBookingsData.findIndex(b => b.id === id);
        if (bookingIndex !== -1) {
            mockBookingsData[bookingIndex].status = newStatus;
        }
        return mockBookingsData[bookingIndex];
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    }
  });

  const handleActionClick = (dialog: 'cancel' | 'receipt', booking: any) => {
    setSelectedBooking(booking);
    setDialogs(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: 'cancel' | 'receipt') => {
    setDialogs(prev => ({ ...prev, [dialog]: false }));
    setSelectedBooking(null);
  };
  
  const handleConfirmCancel = () => {
    if (!selectedBooking) return;
    bookingMutation.mutate({ id: selectedBooking.id, newStatus: 'Kansellert' });
    toast.success(`Bookingen for ${selectedBooking.facilityName} er kansellert.`);
    closeDialog('cancel');
  };

  const handleSendReceipt = () => {
    if (!selectedBooking) return;
    toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
        loading: "Sender kvittering...",
        success: () => t('user.bookings.receiptDialog.receiptSent'),
        error: () => t('user.bookings.receiptDialog.receiptError'),
    });
  }

  const handleDownloadIcs = () => {
    if (!selectedBooking) return;
    const { bookingDate, startTime, endTime, facilityName, purpose } = selectedBooking;
    const formatTime = (date: string, time: string) => new Date(`${date}T${time}:00`).toISOString().replace(/[-:.]/g, '');
    
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatTime(bookingDate, startTime)}`,
        `DTEND:${formatTime(bookingDate, endTime)}`,
        `SUMMARY:${purpose || facilityName}`,
        `LOCATION:${facilityName}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `booking-${selectedBooking.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const bookedDays = mockBookingsData.filter(b => b.status === 'Bekreftet').map(b => new Date(b.bookingDate));

  return (
    <div className="space-y-8">
      <PageHeader 
        title={t('user.bookings.title')}
        description={t('user.bookings.description')}
      />
      
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <main className="lg:col-span-2">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="confirmed">{t('user.bookings.tabs.confirmed')}</TabsTrigger>
          <TabsTrigger value="completed">{t('user.bookings.tabs.completed')}</TabsTrigger>
          <TabsTrigger value="cancelled">{t('user.bookings.tabs.cancelled')}</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                   <CardHeader className="pb-4">
                     <div className="flex items-start justify-between">
                       <div>
                         <CardTitle className="text-lg">{booking.facilityName}</CardTitle>
                         <p className="text-sm text-gray-600">{t('user.bookings.card.bookedBy')}: {booking.bookedBy} ({booking.role})</p>
                       </div>
                       <Badge variant={booking.type === 'Strøtime' ? 'outline' : 'default'}>
                         <Tag className="mr-2 h-3 w-3" />
                         {booking.type}
                       </Badge>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="flex items-center space-x-2">
                       <CalendarIcon className="h-4 w-4 text-gray-400" />
                       <span className="text-sm font-medium">{booking.bookingDate}</span>
                       <span className="text-sm text-gray-500">{booking.startTime} - {booking.endTime}</span>
                     </div>
                     <div className="flex flex-wrap items-center justify-end gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleActionClick('receipt', booking)}>
                         <Receipt className="mr-2 h-4 w-4" />{t('user.bookings.card.receipt')}
                       </Button>
                       {booking.status === 'Bekreftet' && (
                         <>
                           <Button variant="outline" size="sm" onClick={() => handleActionClick('cancel', booking)}>
                             <XCircle className="mr-2 h-4 w-4" />{t('user.bookings.cancelBooking')}
                           </Button>
                           <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); handleDownloadIcs(); }}>
                             <Download className="mr-2 h-4 w-4" />{t('user.bookings.card.addToCalendar')}
                           </Button>
                         </>
                       )}
                     </div>
                   </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">{t('user.bookings.noBookings')}</p>
            </div>
          )}
        </div>
      </Tabs>
      </main>
      <aside className="space-y-6">
         <Card>
            <CardHeader><CardTitle>{t('user.bookings.miniCalendar')}</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
                <DayPicker
                    mode="multiple"
                    min={1}
                    selected={bookedDays}
                    styles={{ caption: { textTransform: 'capitalize' } }}
                    modifiersClassNames={{ selected: 'bg-primary text-primary-foreground' }}
                />
            </CardContent>
         </Card>
      </aside>
    </div>
      
      {/* Cancel Dialog */}
      <Dialog open={dialogs.cancel} onOpenChange={() => closeDialog('cancel')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center"><AlertTriangle className="mr-2 text-red-500" />{t('user.bookings.cancelDialog.title')}</DialogTitle>
            <DialogDescription>{t('user.bookings.cancelDialog.description', { facilityName: selectedBooking?.facilityName, bookingDate: selectedBooking?.bookingDate })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="cancel-reason">{t('user.bookings.cancelDialog.reasonLabel')}</Label>
            <Textarea id="cancel-reason" placeholder={t('user.bookings.cancelDialog.reasonPlaceholder')} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog('cancel')}>{t('user.bookings.cancelDialog.cancel')}</Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>{t('user.bookings.cancelDialog.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog open={dialogs.receipt} onOpenChange={() => closeDialog('receipt')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('user.bookings.receiptDialog.title')}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
                <div className="flex justify-between"><span className="font-semibold">{t('user.bookings.receiptDialog.bookingId')}</span><span>{selectedBooking.id}</span></div>
                <div className="flex justify-between"><span className="font-semibold">{t('user.bookings.receiptDialog.location')}</span><span>{selectedBooking.facilityName}</span></div>
                <div className="flex justify-between"><span className="font-semibold">{t('user.bookings.receiptDialog.time')}</span><span>{selectedBooking.bookingDate}, {selectedBooking.startTime}-{selectedBooking.endTime}</span></div>
                <div className="flex justify-between"><span className="font-semibold">{t('user.bookings.receiptDialog.bookedAs')}</span><span>{selectedBooking.role}</span></div>
                <div>
                    <h4 className="font-semibold mb-2">{t('user.bookings.receiptDialog.rules')}</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {selectedBooking.rules || t('user.bookings.receiptDialog.rulesPlaceholder')}
                    </p>
                </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
             <Button type="button" variant="outline" onClick={handleSendReceipt}><Send className="mr-2 h-4 w-4" />{t('user.bookings.card.sendReceipt')}</Button>
            <Button type="button" onClick={() => closeDialog('receipt')}>{t('user.bookings.receiptDialog.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsPage; 