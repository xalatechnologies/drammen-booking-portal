
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Filter, Plus, Search, MoreHorizontal, MapPin, Clock } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Container, Grid } from "@/components/common/Layout";
import { Heading1, Heading2, BodyMedium, BodySmall } from "@/components/common/Typography";
import { ActionButton } from "@/components/common/ActionButton";
import { InputField } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AdminCard } from "@/components/admin/AdminCard";
import { EmptyState } from "@/components/common/EmptyState";

// Define facility type
interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  status: "active" | "maintenance" | "inactive";
  capacity: number;
  lastBooking: string;
  nextAvailable: string;
}

const FacilityManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Mock data for facilities
  const facilities: Facility[] = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      status: "active",
      capacity: 120,
      lastBooking: "2025-05-20",
      nextAvailable: "I dag, 18:00",
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
    },
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

  const getStatusBadgeType = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "maintenance": return "warning";
      case "inactive": return "error";
      default: return "info";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Aktiv";
      case "maintenance": return "Vedlikehold";
      case "inactive": return "Inaktiv";
      default: return status;
    }
  };

  return (
    <Container className="space-y-spacing-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-spacing-xl">
        <div>
          <Heading1 className="mb-spacing-md text-text-primary font-bold tracking-tight">
            Lokaler
          </Heading1>
          <BodyMedium className="text-text-secondary leading-relaxed">
            Administrer og overvåk alle kommunale lokaler
          </BodyMedium>
        </div>
        <ActionButton 
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
          className="shadow-md hover:shadow-lg transition-all duration-200"
        >
          Legg til lokale
        </ActionButton>
      </div>

      <Grid cols={4} gap="lg">
        <AdminCard title="Totalt antall lokaler" className="text-center">
          <div className="space-y-spacing-sm">
            <div className="text-4xl font-bold text-text-primary">{stats.total}</div>
            <BodySmall className="text-text-secondary">Alle typer lokaler</BodySmall>
          </div>
        </AdminCard>
        
        <AdminCard title="Aktive lokaler" className="text-center">
          <div className="space-y-spacing-sm">
            <div className="text-4xl font-bold text-text-primary">{stats.active}</div>
            <BodySmall className="text-text-secondary">Tilgjengelig for booking</BodySmall>
          </div>
        </AdminCard>
        
        <AdminCard title="Under vedlikehold" className="text-center">
          <div className="space-y-spacing-sm">
            <div className="text-4xl font-bold text-text-primary">{stats.maintenance}</div>
            <BodySmall className="text-text-secondary">Midlertidig utilgjengelig</BodySmall>
          </div>
        </AdminCard>
        
        <AdminCard title="Inaktive lokaler" className="text-center">
          <div className="space-y-spacing-sm">
            <div className="text-4xl font-bold text-text-primary">{stats.inactive}</div>
            <BodySmall className="text-text-secondary">Ikke tilgjengelig</BodySmall>
          </div>
        </AdminCard>
      </Grid>

      <Tabs defaultValue="liste" className="w-full">
        <TabsList className="mb-spacing-xl surface-secondary border border-primary rounded-lg">
          <TabsTrigger 
            value="liste" 
            className="px-spacing-xl py-spacing-md text-text-primary hover:surface-tertiary rounded-lg transition-all duration-200"
          >
            Liste
          </TabsTrigger>
          <TabsTrigger 
            value="kart" 
            className="px-spacing-xl py-spacing-md text-text-primary hover:surface-tertiary rounded-lg transition-all duration-200"
          >
            Kart
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="space-y-spacing-xl">
          <AdminCard title="Lokalsøk & Filtre" description="Søk etter lokaler etter navn, type, eller adresse">
            <div className="flex flex-col sm:flex-row gap-spacing-xl mb-spacing-xl">
              <InputField
                placeholder="Søk etter lokaler..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-grow"
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <ActionButton 
                    variant="secondary"
                    icon={<Filter className="h-5 w-5" />}
                    className="focus-ring"
                  >
                    Filter
                  </ActionButton>
                </PopoverTrigger>
                <PopoverContent className="w-80 surface-primary border-primary shadow-lg rounded-xl">
                  <div className="space-y-spacing-xl">
                    <Heading2 className="text-lg font-semibold text-text-primary">Filtrer etter status</Heading2>
                    <div className="space-y-spacing-lg">
                      {[
                        { id: "all", label: "Alle" },
                        { id: "active", label: "Aktive" },
                        { id: "maintenance", label: "Under vedlikehold" },
                        { id: "inactive", label: "Inaktive" },
                      ].map((filter) => (
                        <div key={filter.id} className="flex items-center space-x-spacing-lg">
                          <input
                            type="radio"
                            id={filter.id}
                            name="status"
                            checked={activeFilter === filter.id}
                            onChange={() => setActiveFilter(filter.id)}
                            className="w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 focus-ring"
                          />
                          <label htmlFor={filter.id} className="body-primary cursor-pointer font-medium text-text-primary">
                            {filter.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="rounded-xl border border-primary overflow-hidden">
              <Table>
                <TableHeader className="surface-secondary">
                  <TableRow className="border-primary">
                    <TableHead className="heading-secondary py-spacing-xl font-semibold text-text-primary">Lokale</TableHead>
                    <TableHead className="heading-secondary py-spacing-xl font-semibold text-text-primary">Type</TableHead>
                    <TableHead className="heading-secondary py-spacing-xl font-semibold text-text-primary">Status</TableHead>
                    <TableHead className="heading-secondary py-spacing-xl font-semibold text-text-primary">Kapasitet</TableHead>
                    <TableHead className="heading-secondary py-spacing-xl font-semibold text-text-primary">Neste ledig</TableHead>
                    <TableHead className="heading-secondary py-spacing-xl sr-only">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-spacing-3xl">
                        <EmptyState 
                          icon={<Search className="h-12 w-12" />}
                          title="Ingen lokaler funnet"
                          description="Prøv å endre søkekriteriene eller filteret"
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFacilities.map((facility) => (
                      <TableRow 
                        key={facility.id} 
                        className="border-primary hover:surface-secondary transition-colors"
                      >
                        <TableCell className="py-spacing-xl">
                          <div>
                            <BodyMedium className="font-semibold mb-spacing-sm text-text-primary">{facility.name}</BodyMedium>
                            <div className="flex items-center text-text-secondary">
                              <MapPin className="h-4 w-4 mr-spacing-sm flex-shrink-0" />
                              <BodySmall>{facility.address}</BodySmall>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-spacing-xl">
                          <StatusBadge status="info" showIcon={false} className="bg-blue-100 text-blue-900 border-blue-200">
                            {facility.type}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="py-spacing-xl">
                          <StatusBadge status={getStatusBadgeType(facility.status) as any}>
                            {getStatusText(facility.status)}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="py-spacing-xl">
                          <BodyMedium className="font-semibold text-text-primary">{facility.capacity} personer</BodyMedium>
                        </TableCell>
                        <TableCell className="py-spacing-xl">
                          <div className="flex items-center text-brand-primary font-semibold">
                            <Clock className="h-4 w-4 mr-spacing-sm flex-shrink-0" />
                            <BodySmall>{facility.nextAvailable}</BodySmall>
                          </div>
                        </TableCell>
                        <TableCell className="py-spacing-xl">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <ActionButton 
                                variant="ghost" 
                                size="sm"
                                icon={<MoreHorizontal className="h-5 w-5" />}
                                className="h-10 w-10 p-0 focus-ring"
                              >
                                Meny
                              </ActionButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="surface-primary border-primary shadow-lg rounded-xl">
                              <DropdownMenuItem className="hover:surface-secondary rounded-lg">Se detaljer</DropdownMenuItem>
                              <DropdownMenuItem className="hover:surface-secondary rounded-lg">Rediger</DropdownMenuItem>
                              <DropdownMenuItem className="hover:surface-secondary rounded-lg">Endre status</DropdownMenuItem>
                              <DropdownMenuItem className="text-semantic-error hover:bg-red-50 rounded-lg">Slett</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-spacing-xl flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" className="focus-ring" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="focus-ring">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="focus-ring">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="focus-ring">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="focus-ring" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </AdminCard>
        </TabsContent>
        
        <TabsContent value="kart">
          <AdminCard title="Kartvisning" description="Lokaler vist på kart kommer snart">
            <div className="h-[500px] flex items-center justify-center surface-secondary rounded-xl border-2 border-dashed border-primary">
              <EmptyState 
                icon={<MapPin className="h-20 w-20" />}
                title="Kartvisning er under utvikling"
                action={{
                  label: "Få varsel når dette er klart",
                  onClick: () => console.log("Registering for notifications")
                }}
              />
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default FacilityManagementPage;
