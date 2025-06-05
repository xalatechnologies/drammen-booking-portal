
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Fasilitetsstyring</h2>
          <p className="text-gray-600 mt-2">Administrer og overvåk alle kommunale fasiliteter</p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Legg til fasilitet</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-gray-600">Totalt antall fasiliteter</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Alle typer fasiliteter</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-green-700">Aktive fasiliteter</p>
              <p className="text-3xl font-bold text-green-800">{stats.active}</p>
              <p className="text-xs text-green-600">Tilgjengelig for booking</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-amber-700">Under vedlikehold</p>
              <p className="text-3xl font-bold text-amber-800">{stats.maintenance}</p>
              <p className="text-xs text-amber-600">Midlertidig utilgjengelig</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-red-700">Inaktive fasiliteter</p>
              <p className="text-3xl font-bold text-red-800">{stats.inactive}</p>
              <p className="text-xs text-red-600">Ikke tilgjengelig</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="w-full">
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="liste" className="px-6 py-2 rounded-md">Liste</TabsTrigger>
          <TabsTrigger value="kart" className="px-6 py-2 rounded-md">Kart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Fasilitetsøk & Filtre</CardTitle>
              <CardDescription className="text-gray-600">
                Søk etter fasiliteter etter navn, type, eller adresse
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Søk etter fasiliteter..."
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 h-11 px-4 border-gray-300 hover:border-gray-400">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-4 shadow-lg border-gray-200">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Filtrer etter status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="all"
                            name="status"
                            checked={activeFilter === "all"}
                            onChange={() => setActiveFilter("all")}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="all" className="text-sm font-medium">Alle</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="active"
                            name="status"
                            checked={activeFilter === "active"}
                            onChange={() => setActiveFilter("active")}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="active" className="text-sm font-medium">Aktive</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="maintenance"
                            name="status"
                            checked={activeFilter === "maintenance"}
                            onChange={() => setActiveFilter("maintenance")}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="maintenance" className="text-sm font-medium">Under vedlikehold</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="inactive"
                            name="status"
                            checked={activeFilter === "inactive"}
                            onChange={() => setActiveFilter("inactive")}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="inactive" className="text-sm font-medium">Inaktive</Label>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold text-gray-700 py-4">Fasilitet</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Kapasitet</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Neste ledig</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center space-y-2">
                            <Search className="h-8 w-8 text-gray-300" />
                            <p>Ingen fasiliteter funnet</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFacilities.map((facility) => (
                        <TableRow key={facility.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                          <TableCell className="py-4">
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">{facility.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                                {facility.address}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                              {facility.type}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                              ${facility.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                facility.status === 'maintenance' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                                'bg-red-100 text-red-800 border border-red-200'}`}>
                              {facility.status === 'active' ? 'Aktiv' : 
                                facility.status === 'maintenance' ? 'Vedlikehold' : 
                                'Inaktiv'}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 font-medium text-gray-900">{facility.capacity} personer</TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center text-sm text-blue-600 font-medium">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{facility.nextAvailable}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 shadow-lg border-gray-200">
                                <DropdownMenuItem className="py-2">Se detaljer</DropdownMenuItem>
                                <DropdownMenuItem className="py-2">Rediger</DropdownMenuItem>
                                <DropdownMenuItem className="py-2">Endre status</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 py-2">Slett</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-center">
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
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Kartvisning</CardTitle>
              <CardDescription className="text-gray-600">Fasiliteter vist på kart kommer snart</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-3 font-medium">Kartvisning er under utvikling</p>
                    <Button variant="outline" className="shadow-sm">Få varsel når dette er klart</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityManagementPage;
