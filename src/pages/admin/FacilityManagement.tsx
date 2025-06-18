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
    <Container className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <Heading1 className="mb-3">Lokaler</Heading1>
          <BodyMedium className="text-text-secondary">
            Administrer og overvåk alle kommunale lokaler
          </BodyMedium>
        </div>
        <ActionButton 
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
          className="shadow-sm"
        >
          Legg til lokale
        </ActionButton>
      </div>

      <Grid cols={4} gap="lg">
        <AdminCard title="Totalt antall lokaler" className="text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-text-primary">{stats.total}</div>
            <BodySmall className="text-text-secondary">Alle typer lokaler</BodySmall>
          </div>
        </AdminCard>
        
        <AdminCard title="Aktive lokaler" className="text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-text-primary">{stats.active}</div>
            <BodySmall className="text-text-secondary">Tilgjengelig for booking</BodySmall>
          </div>
        </AdminCard>
        
        <AdminCard title="Under vedlikehold" className="text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-text-primary">{stats.maintenance}</div>
            <BodySmall className="text-text-secondary">Midlertidig utilgjengelig</BodySmall>
          </div>
        </AdminCard>
        
        <AdminCard title="Inaktive lokaler" className="text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-text-primary">{stats.inactive}</div>
            <BodySmall className="text-text-secondary">Ikke tilgjengelig</BodySmall>
          </div>
        </AdminCard>
      </Grid>

      <Tabs defaultValue="liste" className="w-full">
        <TabsList className="mb-8 bg-surface-secondary">
          <TabsTrigger value="liste" className="px-8 py-3">Liste</TabsTrigger>
          <TabsTrigger value="kart" className="px-8 py-3">Kart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="space-y-8">
          <AdminCard title="Lokalsøk & Filtre" description="Søk etter lokaler etter navn, type, eller adresse">
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
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
                  >
                    Filter
                  </ActionButton>
                </PopoverTrigger>
                <PopoverContent className="w-80 surface-primary border-primary shadow-lg">
                  <div className="space-y-6">
                    <Heading2 className="text-lg">Filtrer etter status</Heading2>
                    <div className="space-y-4">
                      {[
                        { id: "all", label: "Alle" },
                        { id: "active", label: "Aktive" },
                        { id: "maintenance", label: "Under vedlikehold" },
                        { id: "inactive", label: "Inaktive" },
                      ].map((filter) => (
                        <div key={filter.id} className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id={filter.id}
                            name="status"
                            checked={activeFilter === filter.id}
                            onChange={() => setActiveFilter(filter.id)}
                            className="w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2"
                          />
                          <label htmlFor={filter.id} className="body-primary cursor-pointer font-medium">
                            {filter.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="rounded-lg border border-primary overflow-hidden">
              <Table>
                <TableHeader className="bg-surface-secondary">
                  <TableRow className="border-primary">
                    <TableHead className="heading-secondary py-6">Lokale</TableHead>
                    <TableHead className="heading-secondary py-6">Type</TableHead>
                    <TableHead className="heading-secondary py-6">Status</TableHead>
                    <TableHead className="heading-secondary py-6">Kapasitet</TableHead>
                    <TableHead className="heading-secondary py-6">Neste ledig</TableHead>
                    <TableHead className="heading-secondary py-6 sr-only">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12">
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
                        className="border-primary hover:bg-surface-secondary transition-colors"
                      >
                        <TableCell className="py-6">
                          <div>
                            <BodyMedium className="font-semibold mb-2">{facility.name}</BodyMedium>
                            <div className="flex items-center text-text-secondary">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <BodySmall>{facility.address}</BodySmall>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <StatusBadge status="info" showIcon={false} className="bg-blue-100 text-blue-900 border-blue-200">
                            {facility.type}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="py-6">
                          <StatusBadge status={getStatusBadgeType(facility.status) as any}>
                            {getStatusText(facility.status)}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="py-6">
                          <BodyMedium className="font-semibold">{facility.capacity} personer</BodyMedium>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex items-center text-brand-primary font-semibold">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <BodySmall>{facility.nextAvailable}</BodySmall>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <ActionButton 
                                variant="ghost" 
                                size="sm"
                                icon={<MoreHorizontal className="h-5 w-5" />}
                                className="h-10 w-10 p-0"
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="surface-primary border-primary shadow-lg">
                              <DropdownMenuItem className="hover:bg-surface-secondary">Se detaljer</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-surface-secondary">Rediger</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-surface-secondary">Endre status</DropdownMenuItem>
                              <DropdownMenuItem className="text-semantic-error hover:bg-red-50">Slett</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </AdminCard>
        </TabsContent>
        
        <TabsContent value="kart">
          <AdminCard title="Kartvisning" description="Lokaler vist på kart kommer snart">
            <div className="h-[500px] flex items-center justify-center bg-surface-secondary rounded-lg border-2 border-dashed border-primary">
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
