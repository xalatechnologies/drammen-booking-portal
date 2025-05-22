
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
    {
      id: 6,
      name: "Åssiden Fotballhall",
      address: "Buskerudveien 54, 3024 Drammen",
      type: "Fotballhall",
      status: "active",
      capacity: 300,
      lastBooking: "2025-05-19",
      nextAvailable: "Lørdag, 18:30",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Fasilitetsstyring</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Legg til fasilitet</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground">Totalt antall fasiliteter</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground">Aktive fasiliteter</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground">Under vedlikehold</p>
              <p className="text-2xl font-bold text-amber-700">{stats.maintenance}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground">Inaktive fasiliteter</p>
              <p className="text-2xl font-bold text-red-700">{stats.inactive}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="kart">Kart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fasilitetsøk & Filtre</CardTitle>
              <CardDescription>
                Søk etter fasiliteter etter navn, type, eller adresse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Søk etter fasiliteter..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none mb-3">Filtrer etter status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="all"
                            name="status"
                            checked={activeFilter === "all"}
                            onChange={() => setActiveFilter("all")}
                          />
                          <Label htmlFor="all">Alle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="active"
                            name="status"
                            checked={activeFilter === "active"}
                            onChange={() => setActiveFilter("active")}
                          />
                          <Label htmlFor="active">Aktive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="maintenance"
                            name="status"
                            checked={activeFilter === "maintenance"}
                            onChange={() => setActiveFilter("maintenance")}
                          />
                          <Label htmlFor="maintenance">Under vedlikehold</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="inactive"
                            name="status"
                            checked={activeFilter === "inactive"}
                            onChange={() => setActiveFilter("inactive")}
                          />
                          <Label htmlFor="inactive">Inaktive</Label>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fasilitet</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Kapasitet</TableHead>
                      <TableHead>Neste ledig</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Ingen fasiliteter funnet
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFacilities.map((facility) => (
                        <TableRow key={facility.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{facility.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {facility.address}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{facility.type}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${facility.status === 'active' ? 'bg-green-100 text-green-800' : 
                                facility.status === 'maintenance' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {facility.status === 'active' ? 'Aktiv' : 
                                facility.status === 'maintenance' ? 'Vedlikehold' : 
                                'Inaktiv'}
                            </div>
                          </TableCell>
                          <TableCell>{facility.capacity} personer</TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Clock className="h-3 w-3 mr-1 text-blue-600" />
                              <span>{facility.nextAvailable}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Se detaljer</DropdownMenuItem>
                                <DropdownMenuItem>Rediger</DropdownMenuItem>
                                <DropdownMenuItem>Endre status</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Slett</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kart">
          <Card>
            <CardHeader>
              <CardTitle>Kartvisning</CardTitle>
              <CardDescription>Fasiliteter vist på kart kommer snart</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-gray-100 rounded-md">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Kartvisning er under utvikling</p>
                <Button variant="outline">Få varsel når dette er klart</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityManagementPage;
