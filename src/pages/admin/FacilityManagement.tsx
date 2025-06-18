import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Filter, Plus, Search, MoreHorizontal, MapPin, Clock } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define facility type
interface OpeningHours {
  day: string; // f.eks. 'Mandag'
  open: string; // '08:00'
  close: string; // '16:00'
  closed?: boolean;
}

interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  status: "active" | "maintenance" | "inactive";
  capacity: number;
  lastBooking: string;
  nextAvailable: string;
  allowedBookingTypes: string[];
  openingHours: OpeningHours[];
  bookingInterval: string; // '15', '30', 'daily'
  season: { from: string; to: string };
}

const WEEKDAYS = [
  "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"
];
const BOOKING_INTERVALS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "daily", label: "Daglig" },
];

const BOOKING_TYPES = [
  { value: "engangslan", label: "Engangslån" },
  { value: "fastlan", label: "Fastlån" },
  { value: "rammetid", label: "Rammetid" },
  { value: "strotimer", label: "Strøtimer" },
];

const FacilityManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      status: "active",
      capacity: 120,
      lastBooking: "2025-05-20",
      nextAvailable: "I dag, 18:00",
      allowedBookingTypes: ["engangslan", "fastlan"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 2,
      name: "Fjell Skole - Aktivitetshall",
      address: "Lauritz Grønlands vei 40, 3035 Drammen",
      type: "Aktivitetshall",
      status: "active",
      capacity: 200,
      lastBooking: "2025-05-21",
      nextAvailable: "Fredag, 17:00",
      allowedBookingTypes: ["engangslan", "rammetid", "strotimer"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 3,
      name: "Gulskogen Skole - Auditorium",
      address: "Smithestrømsveien 13, 3048 Drammen",
      type: "Auditorium",
      status: "maintenance",
      capacity: 150,
      lastBooking: "2025-05-15",
      nextAvailable: "Torsdag, 19:00",
      allowedBookingTypes: ["engangslan"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 4,
      name: "Marienlyst Stadion - Møtesal",
      address: "Marienlyst 14, 3045 Drammen",
      type: "Møtesal",
      status: "active",
      capacity: 80,
      lastBooking: "2025-05-18",
      nextAvailable: "Lørdag, 10:00",
      allowedBookingTypes: ["fastlan", "rammetid"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 5,
      name: "Drammensbadet - Svømmehall",
      address: "Ormåsen 1, 3048 Drammen",
      type: "Svømmehall",
      status: "inactive",
      capacity: 250,
      lastBooking: "2025-05-10",
      nextAvailable: "Søndag, 12:00",
      allowedBookingTypes: ["engangslan", "strotimer"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 6,
      name: "Åssiden Fotballhall",
      address: "Buskerudveien 54, 3024 Drammen",
      type: "Fotballhall",
      status: "active",
      capacity: 300,
      lastBooking: "2025-05-19",
      nextAvailable: "Lørdag, 18:30",
      allowedBookingTypes: ["engangslan", "fastlan", "rammetid", "strotimer"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 7,
      name: "Drammen Bibliotek - Møterom",
      address: "Grønland 32, 3045 Drammen",
      type: "Møterom",
      status: "active",
      capacity: 40,
      lastBooking: "2025-05-21",
      nextAvailable: "I morgen, 14:00",
      allowedBookingTypes: ["engangslan"],
      openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
  ]);
  const [editFacility, setEditFacility] = useState<Facility | null>(null);
  const [editBookingTypes, setEditBookingTypes] = useState<string[]>([]);
  const [editRulesFacility, setEditRulesFacility] = useState<Facility | null>(null);
  const [editOpeningHours, setEditOpeningHours] = useState<OpeningHours[]>([]);
  const [editBookingInterval, setEditBookingInterval] = useState<string>("");
  const [editSeason, setEditSeason] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  
  // Filter facilities based on search query and active filter
  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          facility.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || 
                          (activeFilter === "active" && facility.status === "active") ||
                          (activeFilter === "maintenance" && facility.status === "maintenance") ||
                          (activeFilter === "inactive" && facility.status === "inactive");
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    total: facilities.length,
    active: facilities.filter(f => f.status === "active").length,
    maintenance: facilities.filter(f => f.status === "maintenance").length,
    inactive: facilities.filter(f => f.status === "inactive").length,
  };

  return (
    <div className="space-y-8 max-w-full" role="main" aria-labelledby="page-title">
      {/* Skip to content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Hopp til hovedinnhold
      </a>

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 id="page-title" className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Lokaler
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Administrer og overvåk alle kommunale lokaler
          </p>
        </div>
        <Button 
          className="gap-3 text-base px-6 py-3 min-h-[48px] shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Legg til nytt lokale"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span>Legg til lokale</span>
        </Button>
      </header>

      {/* Statistics Cards - All using same neutral styling */}
      <section aria-labelledby="statistics-heading">
        <h2 id="statistics-heading" className="sr-only">Statistikk over lokaler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-3">
                <p className="text-base font-semibold text-gray-700">Totalt antall lokaler</p>
                <p className="text-4xl font-bold text-gray-900" aria-label={`${stats.total} totalt antall lokaler`}>
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Alle typer lokaler</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-3">
                <p className="text-base font-semibold text-gray-700">Aktive lokaler</p>
                <p className="text-4xl font-bold text-gray-900" aria-label={`${stats.active} aktive lokaler`}>
                  {stats.active}
                </p>
                <p className="text-sm text-gray-600">Tilgjengelig for booking</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-3">
                <p className="text-base font-semibold text-gray-700">Under vedlikehold</p>
                <p className="text-4xl font-bold text-gray-900" aria-label={`${stats.maintenance} lokaler under vedlikehold`}>
                  {stats.maintenance}
                </p>
                <p className="text-sm text-gray-600">Midlertidig utilgjengelig</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-3">
                <p className="text-base font-semibold text-gray-700">Inaktive lokaler</p>
                <p className="text-4xl font-bold text-gray-900" aria-label={`${stats.inactive} inaktive lokaler`}>
                  {stats.inactive}
                </p>
                <p className="text-sm text-gray-600">Ikke tilgjengelig</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Tabs defaultValue="liste" className="w-full">
        <TabsList className="mb-8 bg-gray-100 p-2 rounded-lg" role="tablist" aria-label="Velg visningstype">
          <TabsTrigger 
            value="liste" 
            className="px-8 py-3 rounded-md text-base font-medium min-h-[48px]"
            role="tab"
            aria-controls="liste-panel"
            aria-selected="true"
          >
            Liste
          </TabsTrigger>
          <TabsTrigger 
            value="kart" 
            className="px-8 py-3 rounded-md text-base font-medium min-h-[48px]"
            role="tab"
            aria-controls="kart-panel"
            aria-selected="false"
          >
            Kart
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="space-y-8" id="liste-panel" role="tabpanel">
          <Card className="shadow-sm border-gray-300">
            <CardHeader className="bg-gray-50 border-b border-gray-300 rounded-t-lg pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Lokalsøk & Filtre
              </CardTitle>
              <CardDescription className="text-base text-gray-700 leading-relaxed">
                Søk etter lokaler etter navn, type, eller adresse
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="relative flex-grow">
                  <Label htmlFor="facility-search" className="sr-only">
                    Søk etter lokaler
                  </Label>
                  <Search 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" 
                    aria-hidden="true" 
                  />
                  <Input
                    id="facility-search"
                    type="search"
                    placeholder="Søk etter lokaler..."
                    className="pl-12 h-12 text-base border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Skriv inn navn, type eller adresse for å søke etter lokaler
                  </div>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-3 h-12 px-6 text-base border-gray-400 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[120px]"
                      aria-label="Åpne filtermeny"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <Filter className="h-5 w-5" aria-hidden="true" />
                      <span>Filter</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-6 shadow-lg border-gray-300" role="dialog" aria-label="Filtreringsalternativer">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Filtrer etter status
                      </h3>
                      <fieldset className="space-y-4" role="radiogroup" aria-labelledby="filter-legend">
                        <legend id="filter-legend" className="sr-only">Velg status filter</legend>
                        
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="all"
                            name="status"
                            checked={activeFilter === "all"}
                            onChange={() => setActiveFilter("all")}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            aria-describedby="all-desc"
                          />
                          <Label htmlFor="all" className="text-base font-medium cursor-pointer">
                            Alle
                          </Label>
                          <span id="all-desc" className="sr-only">Vis alle lokaler uavhengig av status</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="active"
                            name="status"
                            checked={activeFilter === "active"}
                            onChange={() => setActiveFilter("active")}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            aria-describedby="active-desc"
                          />
                          <Label htmlFor="active" className="text-base font-medium cursor-pointer">
                            Aktive
                          </Label>
                          <span id="active-desc" className="sr-only">Vis kun aktive lokaler</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="maintenance"
                            name="status"
                            checked={activeFilter === "maintenance"}
                            onChange={() => setActiveFilter("maintenance")}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            aria-describedby="maintenance-desc"
                          />
                          <Label htmlFor="maintenance" className="text-base font-medium cursor-pointer">
                            Under vedlikehold
                          </Label>
                          <span id="maintenance-desc" className="sr-only">Vis kun lokaler under vedlikehold</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="inactive"
                            name="status"
                            checked={activeFilter === "inactive"}
                            onChange={() => setActiveFilter("inactive")}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            aria-describedby="inactive-desc"
                          />
                          <Label htmlFor="inactive" className="text-base font-medium cursor-pointer">
                            Inaktive
                          </Label>
                          <span id="inactive-desc" className="sr-only">Vis kun inaktive lokaler</span>
                        </div>
                      </fieldset>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-lg border-2 border-gray-300 overflow-hidden shadow-sm" id="main-content">
                <Table role="table" aria-label="Lokaleliste">
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-gray-300">
                      <TableHead className="font-semibold text-gray-900 py-6 text-base" scope="col">
                        Lokale
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-6 text-base" scope="col">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-6 text-base" scope="col">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-6 text-base" scope="col">
                        Kapasitet
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-6 text-base" scope="col">
                        Neste ledig
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-6 text-base" scope="col">
                        Bookingtyper
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-6 text-base sr-only" scope="col">
                        Handlinger
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-600">
                          <div className="flex flex-col items-center space-y-4">
                            <Search className="h-12 w-12 text-gray-400" aria-hidden="true" />
                            <p className="text-lg font-medium">Ingen lokaler funnet</p>
                            <p className="text-base text-gray-500">Prøv å endre søkekriteriene eller filteret</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFacilities.map((facility) => (
                        <TableRow 
                          key={facility.id} 
                          className="border-gray-200 hover:bg-gray-50 transition-colors focus-within:bg-gray-50"
                        >
                          <TableCell className="py-6">
                            <div>
                              <div className="font-semibold text-gray-900 mb-2 text-base leading-relaxed">
                                {facility.name}
                              </div>
                              <div className="text-base text-gray-600 flex items-center leading-relaxed">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" aria-hidden="true" />
                                <span>{facility.address}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <span className="bg-blue-100 text-blue-900 px-3 py-2 rounded-md text-sm font-semibold border border-blue-200">
                              {facility.type}
                            </span>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2
                              ${facility.status === 'active' ? 'bg-green-100 text-green-900 border-green-300' : 
                                facility.status === 'maintenance' ? 'bg-amber-100 text-amber-900 border-amber-300' : 
                                'bg-red-100 text-red-900 border-red-300'}`}>
                              <span className={`w-2 h-2 rounded-full mr-2 
                                ${facility.status === 'active' ? 'bg-green-600' : 
                                  facility.status === 'maintenance' ? 'bg-amber-600' : 
                                  'bg-red-600'}`} 
                                aria-hidden="true"
                              ></span>
                              {facility.status === 'active' ? 'Aktiv' : 
                                facility.status === 'maintenance' ? 'Vedlikehold' : 
                                'Inaktiv'}
                            </div>
                          </TableCell>
                          <TableCell className="py-6 font-semibold text-gray-900 text-base">
                            {facility.capacity} personer
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center text-base text-blue-700 font-semibold">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
                              <span>{facility.nextAvailable}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex flex-wrap gap-2">
                              {facility.allowedBookingTypes.length === 0 ? (
                                <span className="text-gray-400 text-sm">Ingen</span>
                              ) : (
                                facility.allowedBookingTypes.map(type => {
                                  const t = BOOKING_TYPES.find(bt => bt.value === type);
                                  return t ? (
                                    <span key={type} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-200">
                                      {t.label}
                                    </span>
                                  ) : null;
                                })
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-10 w-10 p-0 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                                  aria-label={`Handlinger for ${facility.name}`}
                                  aria-haspopup="true"
                                >
                                  <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-52 shadow-lg border-gray-300"
                                role="menu"
                                aria-label="Handlingsmeny"
                              >
                                <DropdownMenuItem 
                                  className="py-3 text-base cursor-pointer focus:bg-gray-100"
                                  role="menuitem"
                                >
                                  Se detaljer
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="py-3 text-base cursor-pointer focus:bg-gray-100"
                                  role="menuitem"
                                  onClick={() => {
                                    setEditFacility(facility);
                                    setEditBookingTypes(facility.allowedBookingTypes);
                                    setModalOpen(true);
                                  }}
                                >
                                  Rediger bookingtyper
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="py-3 text-base cursor-pointer focus:bg-gray-100"
                                  role="menuitem"
                                >
                                  Endre status
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="py-3 text-base cursor-pointer focus:bg-gray-100"
                                  role="menuitem"
                                  onClick={() => {
                                    setEditRulesFacility(facility);
                                    setEditOpeningHours(facility.openingHours);
                                    setEditBookingInterval(facility.bookingInterval);
                                    setEditSeason(facility.season);
                                    setRulesModalOpen(true);
                                  }}
                                >
                                  Rediger åpningstider/bookingregler
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-700 py-3 text-base cursor-pointer focus:bg-red-50"
                                  role="menuitem"
                                >
                                  Slett
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <nav className="mt-8 flex justify-center" aria-label="Paginering for lokaleliste">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        className="text-base px-4 py-2 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Gå til forrige side"
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        isActive 
                        className="text-base px-4 py-2 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Side 1, nåværende side"
                        aria-current="page"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        className="text-base px-4 py-2 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Gå til side 2"
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        className="text-base px-4 py-2 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Gå til side 3"
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        className="text-base px-4 py-2 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Gå til neste side"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </nav>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kart" id="kart-panel" role="tabpanel">
          <Card className="shadow-sm border-gray-300">
            <CardHeader className="bg-gray-50 border-b border-gray-300 rounded-t-lg pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900">Kartvisning</CardTitle>
              <CardDescription className="text-base text-gray-700 leading-relaxed">
                Lokaler vist på kart kommer snart
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-400">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-10 w-10 text-gray-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-4 font-semibold text-lg">Kartvisning er under utvikling</p>
                    <Button 
                      variant="outline" 
                      className="shadow-sm text-base px-6 py-3 min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Registrer deg for å få varsel når kartvisning er klar"
                    >
                      Få varsel når dette er klart
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {modalOpen && editFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Rediger bookingtyper for {editFacility.name}</h2>
            <div className="space-y-3 mb-6">
              {BOOKING_TYPES.map(bt => (
                <label key={bt.value} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={editBookingTypes.includes(bt.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setEditBookingTypes([...editBookingTypes, bt.value]);
                      } else {
                        setEditBookingTypes(editBookingTypes.filter(val => val !== bt.value));
                      }
                    }}
                  />
                  <span>{bt.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Avbryt</Button>
              <Button
                onClick={() => {
                  setFacilities(facilities.map(f =>
                    f.id === editFacility.id ? { ...f, allowedBookingTypes: editBookingTypes } : f
                  ));
                  setModalOpen(false);
                }}
              >
                Lagre
              </Button>
            </div>
          </div>
        </div>
      )}

      {rulesModalOpen && editRulesFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Rediger åpningstider og bookingregler for {editRulesFacility.name}</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-lg">Åpningstider</h3>
              <div className="grid grid-cols-1 gap-2">
                {editOpeningHours.map((oh, idx) => (
                  <div key={oh.day} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-b-0">
                    <span className="w-28 font-medium text-base">{oh.day}</span>
                    <input
                      type="time"
                      value={oh.open}
                      disabled={oh.closed}
                      onChange={e => {
                        const newHours = [...editOpeningHours];
                        newHours[idx].open = e.target.value;
                        setEditOpeningHours(newHours);
                      }}
                      className="border rounded px-2 py-1 text-base w-28"
                    />
                    <span className="mx-1">-</span>
                    <input
                      type="time"
                      value={oh.close}
                      disabled={oh.closed}
                      onChange={e => {
                        const newHours = [...editOpeningHours];
                        newHours[idx].close = e.target.value;
                        setEditOpeningHours(newHours);
                      }}
                      className="border rounded px-2 py-1 text-base w-28"
                    />
                    <label className="ml-2 flex items-center gap-1 text-base">
                      <input
                        type="checkbox"
                        checked={oh.closed}
                        onChange={e => {
                          const newHours = [...editOpeningHours];
                          newHours[idx].closed = e.target.checked;
                          setEditOpeningHours(newHours);
                        }}
                        className="w-4 h-4"
                      />
                      Stengt
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-lg">Bookingintervall</h3>
              <div className="flex flex-col gap-2 w-48">
                <select
                  value={editBookingInterval}
                  onChange={e => setEditBookingInterval(e.target.value)}
                  className="border rounded px-2 py-2 text-base"
                >
                  {BOOKING_INTERVALS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-lg">Sesong (tilgjengelighet)</h3>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="date"
                  value={editSeason.from}
                  onChange={e => setEditSeason({ ...editSeason, from: e.target.value })}
                  className="border rounded px-2 py-2 text-base w-40"
                />
                <span className="text-gray-500 text-base">til</span>
                <input
                  type="date"
                  value={editSeason.to}
                  onChange={e => setEditSeason({ ...editSeason, to: e.target.value })}
                  className="border rounded px-2 py-2 text-base w-40"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" size="default" onClick={() => setRulesModalOpen(false)}>Avbryt</Button>
              <Button size="default"
                onClick={() => {
                  setFacilities(facilities.map(f =>
                    f.id === editRulesFacility.id
                      ? { ...f, openingHours: editOpeningHours, bookingInterval: editBookingInterval, season: editSeason }
                      : f
                  ));
                  setRulesModalOpen(false);
                }}
              >
                Lagre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityManagementPage;
