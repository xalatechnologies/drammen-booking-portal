
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Map, List, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl flex-grow">
        {/* Hero Banner */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Drammen Kommune Facilities" 
              className="w-full h-[360px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    Finn ledige lokaler i Drammen Kommune
                  </h1>
                  <p className="text-lg text-blue-100 mb-6 max-w-lg">
                    Søk og book kommunale lokaler til møter, arrangementer og aktiviteter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <Card className="mb-8 overflow-hidden border-none shadow-md bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Søk etter lokaler</h2>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-blue-600" : ""}
                >
                  <List className="mr-1 h-4 w-4" />
                  <span>Liste</span>
                </Button>
                <Button 
                  variant={viewMode === "map" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode("map")}
                  className={viewMode === "map" ? "bg-blue-600" : ""}
                >
                  <Map className="mr-1 h-4 w-4" />
                  <span>Kart</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dato</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white border-gray-300 h-11",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd.MM.yyyy") : <span>dd.mm.åååå</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="bg-white pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Klokkeslett</label>
                <Select>
                  <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                    <SelectValue placeholder="Velg tid" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="morning">08:00 - 12:00</SelectItem>
                    <SelectItem value="afternoon">12:00 - 16:00</SelectItem>
                    <SelectItem value="evening">16:00 - 20:00</SelectItem>
                    <SelectItem value="night">20:00 - 23:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type lokale</label>
                <Select value={facilityType} onValueChange={setFacilityType}>
                  <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                    <SelectValue placeholder="Velg type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="sports-hall">Gymsal</SelectItem>
                    <SelectItem value="meeting-room">Møterom</SelectItem>
                    <SelectItem value="auditorium">Auditorium</SelectItem>
                    <SelectItem value="gymnasium">Idrettshall</SelectItem>
                    <SelectItem value="kitchen">Kjøkken</SelectItem>
                    <SelectItem value="classroom">Klasserom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">By / Bydel</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                    <SelectValue placeholder="Velg sted" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="drammen-sentrum">Drammen sentrum</SelectItem>
                    <SelectItem value="konnerud">Konnerud</SelectItem>
                    <SelectItem value="åssiden">Åssiden</SelectItem>
                    <SelectItem value="bragernes">Bragernes</SelectItem>
                    <SelectItem value="strømsø">Strømsø</SelectItem>
                    <SelectItem value="gulskogen">Gulskogen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                <Button 
                  className="w-full h-11 bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Søk</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Facility Card */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1577301886662-26e1b2e2a00b?auto=format&fit=crop&w=600&q=80`} 
                    alt="Facility" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">Gymsal {i} - Brandengen skole</h3>
                  <p className="text-sm text-gray-500 mb-2">Knoffs gate 8, Drammen</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Neste ledige tid:</span> I dag, 18:00
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-700 border-blue-200"
                      onClick={() => navigate(`/facilities/${i}`)}
                    >
                      Se detaljer →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mb-8">
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
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default Index;
