import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { nb } from 'date-fns/locale';
import PageHeader from "@/components/admin/PageHeader";
import { Check, Clock, Ban as BanIcon, List } from 'lucide-react';

// Ekstra CSS for å sikre at event-farger vises tydelig
const calendarStyle = `
.rbc-event {
  color: white !important;
  border: none !important;
  font-weight: 500;
  font-size: 0.95em;
  padding: 2px 6px;
  outline: 2px solid #fff;
  outline-offset: -2px;
}
.rbc-selected {
  box-shadow: 0 0 0 2px #2563eb !important;
  z-index: 2;
}
`;

const locales = {
  'nb': nb,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: nb }),
  getDay,
  locales,
});

// Mock data types
interface BookingOverview {
  id: string;
  facility: string;
  zone?: string;
  date: Date;
  endDate: Date;
  timeSlot: string;
  status: "active" | "pending" | "blocked" | "cancelled";
  user: string;
  organization?: string;
  bookingType: "engangslån" | "fastlån" | "rammetid" | "strøtimer";
}

const MOCK_BOOKINGS: BookingOverview[] = [
  // Overlappende bookinger på samme dag/tid for popup-demo (26. juni 2025)
  {
    id: "1",
    facility: "Brandengen Skole - Gymsal",
    zone: "Bane 1",
    date: new Date("2025-06-26T16:00:00"),
    endDate: new Date("2025-06-26T18:00:00"),
    timeSlot: "16:00-18:00",
    status: "active",
    user: "Ola Nordmann",
    organization: "Drammen IF",
    bookingType: "engangslån",
  },
  {
    id: "2",
    facility: "Brandengen Skole - Gymsal",
    zone: "Bane 2",
    date: new Date("2025-06-26T16:30:00"),
    endDate: new Date("2025-06-26T18:30:00"),
    timeSlot: "16:30-18:30",
    status: "pending",
    user: "Kari Nordmann",
    organization: "Drammen IF",
    bookingType: "fastlån",
  },
  {
    id: "3",
    facility: "Brandengen Skole - Gymsal",
    zone: "Bane 3",
    date: new Date("2025-06-26T17:00:00"),
    endDate: new Date("2025-06-26T19:00:00"),
    timeSlot: "17:00-19:00",
    status: "blocked",
    user: "System",
    organization: undefined,
    bookingType: "rammetid",
  },
  // Booking på 27. juni 2025
  {
    id: "4",
    facility: "Fjell Skole - Aktivitetshall",
    zone: undefined,
    date: new Date("2025-06-27T10:00:00"),
    endDate: new Date("2025-06-27T12:00:00"),
    timeSlot: "10:00-12:00",
    status: "blocked",
    user: "System",
    organization: undefined,
    bookingType: "rammetid",
  },
  // To bookinger på 29. juni 2025 (en overlapp)
  {
    id: "5",
    facility: "Åssiden Fotballhall",
    zone: "Hele hallen",
    date: new Date("2025-06-29T14:00:00"),
    endDate: new Date("2025-06-29T16:00:00"),
    timeSlot: "14:00-16:00",
    status: "active",
    user: "Per Hansen",
    organization: "Åssiden FK",
    bookingType: "strøtimer",
  },
  {
    id: "6",
    facility: "Åssiden Fotballhall",
    zone: "Hele hallen",
    date: new Date("2025-06-29T15:00:00"),
    endDate: new Date("2025-06-29T17:00:00"),
    timeSlot: "15:00-17:00",
    status: "cancelled",
    user: "Avlyst Bruker",
    organization: "Åssiden FK",
    bookingType: "strøtimer",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "active", label: "Aktiv" },
  { value: "pending", label: "Søknad" },
  { value: "blocked", label: "Blokkert" },
  { value: "cancelled", label: "Avlyst" },
];

const BOOKING_TYPE_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "engangslån", label: "Engangslån" },
  { value: "fastlån", label: "Fastlån" },
  { value: "rammetid", label: "Rammetid" },
  { value: "strøtimer", label: "Strøtimer" },
];

const FACILITY_OPTIONS = [
  { value: "all", label: "Alle lokaler" },
  ...Array.from(new Set(MOCK_BOOKINGS.map(b => b.facility))).map(fac => ({ value: fac, label: fac })),
];

const statusColors: Record<string, string> = {
  active: '#22c55e', // grønn
  pending: '#eab308', // gul
  blocked: '#ef4444', // rød
  cancelled: '#6b7280', // grå
};

const BookingsOverview: React.FC = () => {
  const [facility, setFacility] = useState("all");
  const [status, setStatus] = useState("all");
  const [bookingType, setBookingType] = useState("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<string>("");
  const [tab, setTab] = useState<"table" | "calendar">("table");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDayBookings, setSelectedDayBookings] = useState<BookingOverview[] | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const activeBookings = MOCK_BOOKINGS.filter(b => b.status === 'active').length;
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending').length;
  const cancelledBookings = MOCK_BOOKINGS.filter(b => b.status === 'cancelled').length;
  const totalBookings = MOCK_BOOKINGS.length;

  const filtered = MOCK_BOOKINGS.filter(b =>
    (facility === "all" || b.facility === facility) &&
    (status === "all" || b.status === status) &&
    (bookingType === "all" || b.bookingType === bookingType) &&
    (!date || format(b.date, "yyyy-MM-dd") === date) &&
    (
      !search ||
      b.user.toLowerCase().includes(search.toLowerCase()) ||
      (b.organization && b.organization.toLowerCase().includes(search.toLowerCase())) ||
      b.facility.toLowerCase().includes(search.toLowerCase()) ||
      (b.zone && b.zone.toLowerCase().includes(search.toLowerCase()))
    )
  );

  // Bookinger for valgt dag i kalenderen
  const bookingsForSelectedDay = (day: Date) => filtered.filter(b => isSameDay(b.date, day));

  // Map til BigCalendar events
  const calendarEvents = filtered.map(b => ({
    id: b.id,
    title: `${b.facility}${b.zone ? ' / ' + b.zone : ''} (${BOOKING_TYPE_OPTIONS.find(opt => opt.value === b.bookingType)?.label})`,
    start: b.date,
    end: b.endDate,
    resource: b,
    allDay: false,
  }));

  // Custom event style for status color
  function eventStyleGetter(event: any) {
    const color = statusColors[event.resource.status] || '#2563eb';
    return {
      style: {
        backgroundColor: `${color} !important`,
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        fontWeight: 500,
        fontSize: '0.95em',
        padding: '2px 6px',
        outline: '2px solid #fff',
        outlineOffset: '-2px',
        zIndex: 2,
      },
    };
  }

  // Når man klikker på en dag i kalenderen
  function handleSelectSlot(slotInfo: any) {
    const day = slotInfo.start;
    const bookings = bookingsForSelectedDay(day);
    setSelectedDay(day);
    setSelectedDayBookings(bookings);
  }

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <style>{calendarStyle}</style>
      <PageHeader
        title="Bookingoversikt"
        description="Se og filtrer alle bookinger, søknader og sperringer på tvers av lokaler og soner."
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <List className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{totalBookings}</p>
            <p className="text-sm text-gray-600">Totalt antall bookinger</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Check className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{activeBookings}</p>
            <p className="text-sm text-gray-600">Aktive bookinger</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Clock className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{pendingBookings}</p>
            <p className="text-sm text-gray-600">Ventende søknader</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <BanIcon className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{cancelledBookings}</p>
            <p className="text-sm text-gray-600">Avlyste bookinger</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as "table" | "calendar") }>
        <TabsList className="mb-6">
          <TabsTrigger value="table">Tabell</TabsTrigger>
          <TabsTrigger value="calendar">Kalender</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Filtrer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-48">
                  <label className="block mb-1 font-medium">Lokale</label>
                  <Select value={facility} onValueChange={setFacility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg lokale" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACILITY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <label className="block mb-1 font-medium">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <label className="block mb-1 font-medium">Bookingtype</label>
                  <Select value={bookingType} onValueChange={setBookingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKING_TYPE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <label className="block mb-1 font-medium">Dato</label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block mb-1 font-medium">Søk</label>
                  <Input
                    type="search"
                    placeholder="Bruker, organisasjon, lokale, sone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alle bookinger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lokale</TableHead>
                      <TableHead>Sone</TableHead>
                      <TableHead>Dato</TableHead>
                      <TableHead>Tid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bruker</TableHead>
                      <TableHead>Organisasjon</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          Ingen bookinger funnet for valgt filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map(b => (
                        <TableRow key={b.id}>
                          <TableCell>{b.facility}</TableCell>
                          <TableCell>{b.zone || <span className="text-gray-400">-</span>}</TableCell>
                          <TableCell>{format(b.date, "yyyy-MM-dd")}</TableCell>
                          <TableCell>{b.timeSlot}</TableCell>
                          <TableCell>
                            {b.status === "active" && <span className="text-green-700 font-semibold">Aktiv</span>}
                            {b.status === "pending" && <span className="text-yellow-700 font-semibold">Søknad</span>}
                            {b.status === "blocked" && <span className="text-red-700 font-semibold">Blokkert</span>}
                            {b.status === "cancelled" && <span className="text-gray-500 font-semibold">Avlyst</span>}
                          </TableCell>
                          <TableCell>{b.user}</TableCell>
                          <TableCell>{b.organization || <span className="text-gray-400">-</span>}</TableCell>
                          <TableCell>
                            {BOOKING_TYPE_OPTIONS.find(opt => opt.value === b.bookingType)?.label}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600, background: 'white', borderRadius: 12, padding: 8 }}
                  views={[Views.MONTH, Views.WEEK, Views.DAY]}
                  defaultView={Views.MONTH}
                  popup
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={event => setSelectedEvent(event.resource)}
                  onNavigate={date => setCalendarDate(date)}
                  date={calendarDate}
                  messages={{
                    month: 'Måned',
                    week: 'Uke',
                    day: 'Dag',
                    today: 'I dag',
                    previous: 'Forrige',
                    next: 'Neste',
                    showMore: total => `+${total} flere`,
                  }}
                  selectable
                  onSelectSlot={handleSelectSlot}
                />
              </div>
              {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Bookingdetaljer</h2>
                    <div className="space-y-2 mb-6">
                      <div><b>Lokale:</b> {selectedEvent.facility}</div>
                      <div><b>Sone:</b> {selectedEvent.zone || <span className="text-gray-400">-</span>}</div>
                      <div><b>Dato:</b> {format(selectedEvent.date, 'yyyy-MM-dd')}</div>
                      <div><b>Tid:</b> {selectedEvent.timeSlot}</div>
                      <div><b>Status:</b> <span style={{ color: statusColors[selectedEvent.status] }}>{STATUS_OPTIONS.find(opt => opt.value === selectedEvent.status)?.label}</span></div>
                      <div><b>Bruker:</b> {selectedEvent.user}</div>
                      <div><b>Organisasjon:</b> {selectedEvent.organization || <span className="text-gray-400">-</span>}</div>
                      <div><b>Type:</b> {BOOKING_TYPE_OPTIONS.find(opt => opt.value === selectedEvent.bookingType)?.label}</div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setSelectedEvent(null)}>Lukk</button>
                  </div>
                </div>
              )}
              {selectedDay !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                    <h2 className="text-xl font-bold mb-4">Bookinger for valgt dag</h2>
                    <div className="space-y-4 mb-6">
                      {selectedDayBookings && selectedDayBookings.length > 0 ? (
                        selectedDayBookings.map((b, idx) => (
                          <div key={b.id} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                            <div><b>Lokale:</b> {b.facility}</div>
                            <div><b>Sone:</b> {b.zone || <span className="text-gray-400">-</span>}</div>
                            <div><b>Dato:</b> {format(b.date, 'yyyy-MM-dd')}</div>
                            <div><b>Tid:</b> {b.timeSlot}</div>
                            <div><b>Status:</b> <span style={{ color: statusColors[b.status] }}>{STATUS_OPTIONS.find(opt => opt.value === b.status)?.label}</span></div>
                            <div><b>Bruker:</b> {b.user}</div>
                            <div><b>Organisasjon:</b> {b.organization || <span className="text-gray-400">-</span>}</div>
                            <div><b>Type:</b> {BOOKING_TYPE_OPTIONS.find(opt => opt.value === b.bookingType)?.label}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center py-8">Ingen bookinger for valgt dag.</div>
                      )}
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => { setSelectedDay(null); setSelectedDayBookings(null); }}>Lukk</button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsOverview; 