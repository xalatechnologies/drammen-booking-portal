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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Filter, Plus, Search, MoreHorizontal, MapPin, Clock, Wrench, CalendarX, Users } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ZoneManagement from "@/components/admin/ZoneManagement";
import { Zone, ConflictRule } from "@/types/facility";

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
  zones?: Zone[];
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
  const [editingZonesFacility, setEditingZonesFacility] = useState<Facility | null>(null);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockFacility, setBlockFacility] = useState<Facility | null>(null);
  const [blockType, setBlockType] = useState("maintenance");
  const [blockFrom, setBlockFrom] = useState("");
  const [blockTo, setBlockTo] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockNotify, setBlockNotify] = useState(true);
  const [blockOverride, setBlockOverride] = useState(false);
  const [blockedPeriods, setBlockedPeriods] = useState<{facilityId: number, type: string, from: string, to: string, reason: string}[]>([
    { facilityId: 1, type: "maintenance", from: "2025-07-01T08:00", to: "2025-07-01T16:00", reason: "Årlig vedlikehold" },
    { facilityId: 2, type: "internal", from: "2025-07-03T10:00", to: "2025-07-03T12:00", reason: "Kommunalt arrangement" },
  ]);
  const [rammetidModalOpen, setRammetidModalOpen] = useState(false);
  const [rammetidFacility, setRammetidFacility] = useState<Facility | null>(null);
  const [rammetidOrg, setRammetidOrg] = useState("");
  const [rammetidWeekday, setRammetidWeekday] = useState("Mandag");
  const [rammetidFrom, setRammetidFrom] = useState("");
  const [rammetidTo, setRammetidTo] = useState("");
  const [rammetidPeriodFrom, setRammetidPeriodFrom] = useState("");
  const [rammetidPeriodTo, setRammetidPeriodTo] = useState("");
  const [rammetidDelegation, setRammetidDelegation] = useState(false);
  const [rammetidAllocations, setRammetidAllocations] = useState<{
    facilityId: number,
    org: string,
    weekday: string,
    from: string,
    to: string,
    periodFrom: string,
    periodTo: string,
    delegation?: boolean
  }[]>([
    { facilityId: 1, org: "Drammen IF", weekday: "Mandag", from: "16:00", to: "18:00", periodFrom: "2025-08-01", periodTo: "2025-12-31", delegation: true },
    { facilityId: 1, org: "Åssiden FK", weekday: "Mandag", from: "17:00", to: "19:00", periodFrom: "2025-08-01", periodTo: "2025-12-31", delegation: false },
  ]);
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: "",
    address: "",
    type: "",
    capacity: "",
    allowedBookingTypes: [] as string[],
    openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
    bookingInterval: "30",
    season: { from: "", to: "" }
  });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"active" | "maintenance" | "inactive">("active");
  const [newCapacity, setNewCapacity] = useState("");
  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bookingtyper");
  
  // Mock paraplyorganisasjoner
  const umbrellaOrgs = [
    "Drammen IF", "Åssiden FK", "Fjell IL", "Strømsgodset IF"
  ];
  
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

  // Zone management handlers
  const handleZoneCreate = (facilityId: string, zone: Omit<Zone, 'id'>) => {
    // In a real app, this would make an API call
    const newZone = {
      ...zone,
      id: Math.random().toString(36).substr(2, 9), // Temporary ID generation
    };
    
    setFacilities(facilities.map(f => {
      if (f.id === parseInt(facilityId)) {
        return {
          ...f,
          zones: [...(f.zones || []), newZone],
        };
      }
      return f;
    }));
  };

  const handleZoneUpdate = (facilityId: string, zone: Zone) => {
    setFacilities(facilities.map(f => {
      if (f.id === parseInt(facilityId)) {
        return {
          ...f,
          zones: (f.zones || []).map(z => z.id === zone.id ? zone : z),
        };
      }
      return f;
    }));
  };

  const handleZoneDelete = (facilityId: string, zoneId: string) => {
    setFacilities(facilities.map(f => {
      if (f.id === parseInt(facilityId)) {
        return {
          ...f,
          zones: (f.zones || []).filter(z => z.id !== zoneId),
        };
      }
      return f;
    }));
  };

  const handleConflictRuleCreate = (facilityId: string, rule: Omit<ConflictRule, 'id'>) => {
    const newRule = {
      ...rule,
      id: Math.random().toString(36).substr(2, 9), // Temporary ID generation
    };

    setFacilities(facilities.map(f => {
      if (f.id === parseInt(facilityId)) {
        return {
          ...f,
          zones: (f.zones || []).map(z => {
            if (z.id === rule.zoneId) {
              return {
                ...z,
                conflictRules: [...z.conflictRules, newRule],
              };
            }
            return z;
          }),
        };
      }
      return f;
    }));
  };

  const handleConflictRuleDelete = (facilityId: string, ruleId: string) => {
    setFacilities(facilities.map(f => {
      if (f.id === parseInt(facilityId)) {
        return {
          ...f,
          zones: (f.zones || []).map(z => ({
            ...z,
            conflictRules: z.conflictRules.filter(r => r.id !== ruleId),
          })),
        };
      }
      return f;
    }));
  };

  // Update the dropdown menu items to include zone management
  const dropdownMenuItems = (facility: Facility) => (
    <DropdownMenuContent 
      align="end" 
      className="w-52 shadow-lg border-gray-300"
      role="menu"
      aria-label="Handlingsmeny"
    >
      <DropdownMenuItem 
        className="py-3 text-base cursor-pointer focus:bg-gray-100"
        role="menuitem"
        onClick={() => {
          setSelectedFacility(facility);
          setDetailsModalOpen(true);
        }}
      >
        Se detaljer
      </DropdownMenuItem>
      <DropdownMenuItem 
        className="py-3 text-base cursor-pointer focus:bg-gray-100"
        role="menuitem"
        onClick={() => {
          setSelectedFacility(facility);
          setEditFacility(facility);
          setEditBookingTypes(facility.allowedBookingTypes);
          setNewStatus(facility.status);
          setNewCapacity(facility.capacity.toString());
          setEditOpeningHours(facility.openingHours);
          setEditBookingInterval(facility.bookingInterval);
          setEditSeason(facility.season);
          setEditDetailsModalOpen(true);
        }}
      >
        Rediger detaljer
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
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
                <Button 
                  className="gap-3 h-12 px-6 text-base min-w-[160px] shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Legg til nytt lokale"
                  onClick={() => setAddFacilityModalOpen(true)}
                >
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  <span>Legg til lokale</span>
                </Button>
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
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2
                              ${facility.status === 'active' ? 'bg-green-100 text-green-900 border border-green-300' : 
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
                              {dropdownMenuItems(facility)}
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

      {/* Modal for å redigere alle detaljer */}
      <Dialog open={editDetailsModalOpen} onOpenChange={setEditDetailsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Rediger {selectedFacility?.name}</DialogTitle>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-6">
              <Tabs defaultValue="bookingtyper" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full border-b justify-start mb-6">
                  <TabsTrigger value="bookingtyper" className="px-4 py-2">
                    Bookingtyper
                  </TabsTrigger>
                  <TabsTrigger value="status" className="px-4 py-2">
                    Status og kapasitet
                  </TabsTrigger>
                  <TabsTrigger value="apningstider" className="px-4 py-2">
                    Åpningstider og regler
                  </TabsTrigger>
                  <TabsTrigger value="soner" className="px-4 py-2">
                    Soner
                  </TabsTrigger>
                  <TabsTrigger value="blokkering" className="px-4 py-2">
                    Blokkering
                  </TabsTrigger>
                  <TabsTrigger value="rammetid" className="px-4 py-2">
                    Rammetid
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bookingtyper" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tillatte bookingtyper</h3>
                    <div className="space-y-3">
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
                            className="w-4 h-4"
                          />
                          <span>{bt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="status" className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Status</Label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={newStatus === "active"}
                          onChange={(e) => setNewStatus("active")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-600"></span>
                          Aktiv
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="status"
                          value="maintenance"
                          checked={newStatus === "maintenance"}
                          onChange={(e) => setNewStatus("maintenance")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                          Under vedlikehold
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={newStatus === "inactive"}
                          onChange={(e) => setNewStatus("inactive")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          Inaktiv
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-lg font-semibold">
                      Kapasitet
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(e.target.value)}
                        className="w-32"
                      />
                      <span className="text-gray-600">personer</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="apningstider" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Åpningstider</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {editOpeningHours.map((oh, idx) => (
                        <div key={oh.day} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                          <span className="w-28 font-medium">{oh.day}</span>
                          <input
                            type="time"
                            value={oh.open}
                            disabled={oh.closed}
                            onChange={e => {
                              const newHours = [...editOpeningHours];
                              newHours[idx].open = e.target.value;
                              setEditOpeningHours(newHours);
                            }}
                            className="border rounded px-2 py-1 w-28"
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
                            className="border rounded px-2 py-1 w-28"
                          />
                          <label className="flex items-center gap-2">
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

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Bookingintervall</h3>
                    <select
                      value={editBookingInterval}
                      onChange={e => setEditBookingInterval(e.target.value)}
                      className="border rounded px-3 py-2"
                    >
                      {BOOKING_INTERVALS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sesong</h3>
                    <div className="flex items-center gap-4">
                      <div>
                        <Label>Fra dato</Label>
                        <Input
                          type="date"
                          value={editSeason.from}
                          onChange={e => setEditSeason({ ...editSeason, from: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Til dato</Label>
                        <Input
                          type="date"
                          value={editSeason.to}
                          onChange={e => setEditSeason({ ...editSeason, to: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="soner">
                  <ZoneManagement
                    facilityId={selectedFacility.id.toString()}
                    zones={selectedFacility.zones || []}
                    onZoneCreate={(zone) => handleZoneCreate(selectedFacility.id.toString(), zone)}
                    onZoneUpdate={(zone) => handleZoneUpdate(selectedFacility.id.toString(), zone)}
                    onZoneDelete={(zoneId) => handleZoneDelete(selectedFacility.id.toString(), zoneId)}
                    onConflictRuleCreate={(rule) => handleConflictRuleCreate(selectedFacility.id.toString(), rule)}
                    onConflictRuleDelete={(ruleId) => handleConflictRuleDelete(selectedFacility.id.toString(), ruleId)}
                  />
                </TabsContent>

                <TabsContent value="blokkering" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Blokker tid</h3>
                    <form className="space-y-4">
                      <div>
                        <Label>Type blokkering</Label>
                        <select
                          className="w-full border rounded px-3 py-2 mt-1"
                          value={blockType}
                          onChange={e => setBlockType(e.target.value)}
                          required
                        >
                          <option value="maintenance">Vedlikehold</option>
                          <option value="internal">Internt arrangement</option>
                          <option value="other">Annet</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fra</Label>
                          <Input
                            type="datetime-local"
                            value={blockFrom}
                            onChange={e => setBlockFrom(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label>Til</Label>
                          <Input
                            type="datetime-local"
                            value={blockTo}
                            onChange={e => setBlockTo(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Årsak/merknad</Label>
                        <Input
                          type="text"
                          value={blockReason}
                          onChange={e => setBlockReason(e.target.value)}
                          placeholder="F.eks. årlig service, intern samling..."
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={blockNotify}
                          onChange={e => setBlockNotify(e.target.checked)}
                          id="block-notify"
                          className="w-4 h-4"
                        />
                        <Label htmlFor="block-notify">Varsle berørte brukere</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={blockOverride}
                          onChange={e => setBlockOverride(e.target.checked)}
                          id="block-override"
                          className="w-4 h-4"
                        />
                        <Label htmlFor="block-override">Tillat booking likevel (override)</Label>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Eksisterende blokkerte perioder</h3>
                    <div className="bg-gray-50 border rounded p-4 max-h-48 overflow-y-auto">
                      {blockedPeriods.filter(b => b.facilityId === selectedFacility.id).length === 0 ? (
                        <p className="text-gray-500">Ingen blokkerte perioder</p>
                      ) : (
                        <ul className="space-y-2">
                          {blockedPeriods
                            .filter(b => b.facilityId === selectedFacility.id)
                            .map((b, i) => (
                              <li key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                  <span className="font-medium">
                                    {b.type === "maintenance" ? "Vedlikehold" : 
                                     b.type === "internal" ? "Internt" : "Annet"}
                                  </span>
                                  <p className="text-sm text-gray-600">{b.reason}</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(b.from).toLocaleString('no')} - {new Date(b.to).toLocaleString('no')}
                                </div>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rammetid" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tildel rammetid</h3>
                    <form className="space-y-4">
                      <div>
                        <Label>Paraplyorganisasjon</Label>
                        <select
                          className="w-full border rounded px-3 py-2 mt-1"
                          value={rammetidOrg}
                          onChange={e => setRammetidOrg(e.target.value)}
                          required
                        >
                          <option value="">Velg organisasjon</option>
                          {umbrellaOrgs.map(org => (
                            <option key={org} value={org}>{org}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Ukedag</Label>
                          <select
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={rammetidWeekday}
                            onChange={e => setRammetidWeekday(e.target.value)}
                            required
                          >
                            {WEEKDAYS.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Fra kl.</Label>
                          <Input
                            type="time"
                            value={rammetidFrom}
                            onChange={e => setRammetidFrom(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label>Til kl.</Label>
                          <Input
                            type="time"
                            value={rammetidTo}
                            onChange={e => setRammetidTo(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Periode fra</Label>
                          <Input
                            type="date"
                            value={rammetidPeriodFrom}
                            onChange={e => setRammetidPeriodFrom(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label>Periode til</Label>
                          <Input
                            type="date"
                            value={rammetidPeriodTo}
                            onChange={e => setRammetidPeriodTo(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rammetidDelegation}
                          onChange={e => setRammetidDelegation(e.target.checked)}
                          id="rammetid-delegation"
                          className="w-4 h-4"
                        />
                        <Label htmlFor="rammetid-delegation">
                          Tillat delegasjon (paraply kan fordele/gi slipp på rammetid)
                        </Label>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Eksisterende rammetider</h3>
                    <div className="bg-gray-50 border rounded p-4 max-h-48 overflow-y-auto">
                      {rammetidAllocations.filter(a => a.facilityId === selectedFacility.id).length === 0 ? (
                        <p className="text-gray-500">Ingen tildelte rammetider</p>
                      ) : (
                        <ul className="space-y-2">
                          {rammetidAllocations
                            .filter(a => a.facilityId === selectedFacility.id)
                            .map((a, i) => (
                              <li key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                  <span className="font-medium">{a.org}</span>
                                  <p className="text-sm text-gray-600">
                                    {a.weekday} {a.from}-{a.to}
                                    {a.delegation && <span className="ml-2 text-blue-600">[Delegasjon]</span>}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(a.periodFrom).toLocaleDateString('no')} - {new Date(a.periodTo).toLocaleDateString('no')}
                                </div>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDetailsModalOpen(false)}
                >
                  Avbryt
                </Button>
                <Button
                  onClick={() => {
                    // Lagre alle endringer
                    setFacilities(facilities.map(f => {
                      if (f.id === selectedFacility.id) {
                        return {
                          ...f,
                          status: newStatus,
                          capacity: parseInt(newCapacity) || f.capacity,
                          allowedBookingTypes: editBookingTypes,
                          openingHours: editOpeningHours,
                          bookingInterval: editBookingInterval,
                          season: editSeason
                        };
                      }
                      return f;
                    }));
                    setEditDetailsModalOpen(false);
                  }}
                >
                  Lagre alle endringer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for å legge til nytt lokale */}
      <Dialog open={addFacilityModalOpen} onOpenChange={setAddFacilityModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Legg til nytt lokale</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              const newId = Math.max(...facilities.map(f => f.id)) + 1;
              setFacilities([
                ...facilities,
                {
                  id: newId,
                  name: newFacility.name,
                  address: newFacility.address,
                  type: newFacility.type,
                  status: "active",
                  capacity: parseInt(newFacility.capacity),
                  lastBooking: "",
                  nextAvailable: "Nå",
                  allowedBookingTypes: newFacility.allowedBookingTypes,
                  openingHours: newFacility.openingHours,
                  bookingInterval: newFacility.bookingInterval,
                  season: newFacility.season
                }
              ]);
              setAddFacilityModalOpen(false);
              setNewFacility({
                name: "",
                address: "",
                type: "",
                capacity: "",
                allowedBookingTypes: [],
                openingHours: WEEKDAYS.map(day => ({ day, open: "08:00", close: "22:00", closed: false })),
                bookingInterval: "30",
                season: { from: "", to: "" }
              });
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="facility-name">Navn på lokale</Label>
                <Input
                  id="facility-name"
                  value={newFacility.name}
                  onChange={e => setNewFacility({ ...newFacility, name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="facility-type">Type lokale</Label>
                <Input
                  id="facility-type"
                  value={newFacility.type}
                  onChange={e => setNewFacility({ ...newFacility, type: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="facility-address">Adresse</Label>
                <Input
                  id="facility-address"
                  value={newFacility.address}
                  onChange={e => setNewFacility({ ...newFacility, address: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="facility-capacity">Kapasitet (personer)</Label>
                <Input
                  id="facility-capacity"
                  type="number"
                  min="1"
                  value={newFacility.capacity}
                  onChange={e => setNewFacility({ ...newFacility, capacity: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Tillatte bookingtyper</Label>
              <div className="mt-2 space-y-2">
                {BOOKING_TYPES.map(type => (
                  <label key={type.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newFacility.allowedBookingTypes.includes(type.value)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNewFacility({
                            ...newFacility,
                            allowedBookingTypes: [...newFacility.allowedBookingTypes, type.value]
                          });
                        } else {
                          setNewFacility({
                            ...newFacility,
                            allowedBookingTypes: newFacility.allowedBookingTypes.filter(t => t !== type.value)
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Sesong</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="season-from">Fra dato</Label>
                  <Input
                    id="season-from"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newFacility.season.from}
                    onChange={e => {
                      const fromDate = e.target.value;
                      setNewFacility({
                        ...newFacility,
                        season: { 
                          ...newFacility.season, 
                          from: fromDate,
                          // Hvis til-dato er før fra-dato, oppdater til-dato
                          to: newFacility.season.to && fromDate > newFacility.season.to ? fromDate : newFacility.season.to
                        }
                      });
                    }}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="season-to">Til dato</Label>
                  <Input
                    id="season-to"
                    type="date"
                    min={newFacility.season.from || new Date().toISOString().split('T')[0]}
                    value={newFacility.season.to}
                    onChange={e => setNewFacility({
                      ...newFacility,
                      season: { ...newFacility.season, to: e.target.value }
                    })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddFacilityModalOpen(false)}
              >
                Avbryt
              </Button>
              <Button type="submit">
                Legg til lokale
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal for å vise detaljer */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detaljer for {selectedFacility?.name}</DialogTitle>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label className="font-semibold">Navn</Label>
                  <p className="mt-1">{selectedFacility.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Type</Label>
                  <p className="mt-1">{selectedFacility.type}</p>
                </div>
                <div>
                  <Label className="font-semibold">Adresse</Label>
                  <p className="mt-1">{selectedFacility.address}</p>
                </div>
                <div>
                  <Label className="font-semibold">Kapasitet</Label>
                  <p className="mt-1">{selectedFacility.capacity} personer</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${selectedFacility.status === 'active' ? 'bg-green-100 text-green-800 border border-green-300' : 
                        selectedFacility.status === 'maintenance' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 
                        'bg-red-100 text-red-800 border border-red-300'}`}>
                      {selectedFacility.status === 'active' ? 'Aktiv' : 
                        selectedFacility.status === 'maintenance' ? 'Under vedlikehold' : 
                        'Inaktiv'}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Bookingintervall</Label>
                  <p className="mt-1">
                    {selectedFacility.bookingInterval === 'daily' ? 'Daglig' : 
                      `${selectedFacility.bookingInterval} minutter`}
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Tillatte bookingtyper</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedFacility.allowedBookingTypes.map(type => {
                    const bookingType = BOOKING_TYPES.find(bt => bt.value === type);
                    return bookingType ? (
                      <span key={type} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                        {bookingType.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <Label className="font-semibold">Åpningstider</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {selectedFacility.openingHours.map(oh => (
                    <div key={oh.day} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                      <span className="font-medium">{oh.day}:</span>
                      <span>
                        {oh.closed ? 'Stengt' : `${oh.open} - ${oh.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-semibold">Sesong</Label>
                <p className="mt-1">
                  {new Date(selectedFacility.season.from).toLocaleDateString('no')} - {new Date(selectedFacility.season.to).toLocaleDateString('no')}
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setDetailsModalOpen(false)}>
                  Lukk
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for å endre status og kapasitet */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Endre status og kapasitet for {selectedFacility?.name}</DialogTitle>
          </DialogHeader>
          {selectedFacility && (
            <form onSubmit={(e) => {
              e.preventDefault();
              setFacilities(facilities.map(f => 
                f.id === selectedFacility.id 
                  ? { 
                      ...f, 
                      status: newStatus,
                      capacity: parseInt(newCapacity) || f.capacity
                    } 
                  : f
              ));
              setStatusModalOpen(false);
            }} className="space-y-6">
              <div>
                <Label htmlFor="status" className="text-base font-semibold">Status</Label>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={newStatus === "active"}
                      onChange={(e) => setNewStatus("active")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600"></span>
                      Aktiv
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      value="maintenance"
                      checked={newStatus === "maintenance"}
                      onChange={(e) => setNewStatus("maintenance")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      Under vedlikehold
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={newStatus === "inactive"}
                      onChange={(e) => setNewStatus("inactive")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      Inaktiv
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-base font-semibold">
                  Kapasitet
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    placeholder={selectedFacility.capacity.toString()}
                    className="w-32"
                  />
                  <span className="text-gray-600">personer</span>
                </div>
                <p className="text-sm text-gray-500">
                  Nåværende kapasitet: {selectedFacility.capacity} personer
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatusModalOpen(false)}
                >
                  Avbryt
                </Button>
                <Button type="submit">
                  Lagre endringer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacilityManagementPage;
