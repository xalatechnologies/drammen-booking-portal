
import React from "react";
import { Bell, Search, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminHeader = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md" />
          <div className="hidden md:flex">
            <Button 
              variant="ghost" 
              size="icon"
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-4 md:px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Søk"
              className="pl-10 h-10 text-base bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Søk i systemet"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
            aria-label="Globale innstillinger"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label="Velg språk"
              >
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4" />
                <span className="text-base">Norsk</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-base py-2">
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 mr-2" />
                Norsk
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base py-2">
                <img src="/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png" alt="EN" className="w-5 h-4 mr-2" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label="Varsler - 3 uleste"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-medium">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-base">Varsler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-3 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium">Ny forespørsel om lokale</p>
                  <p className="text-sm text-muted-foreground">Brandengen Skole ba om godkjenning</p>
                  <p className="text-sm text-muted-foreground">2 minutter siden</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium">Brukerrolle oppdatert</p>
                  <p className="text-sm text-muted-foreground">Thomas Hansen er nå administrator</p>
                  <p className="text-sm text-muted-foreground">1 time siden</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative h-10 gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label="Brukerprofil og innstillinger"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="admin user" />
                  <AvatarFallback className="bg-indigo-600 text-white">AU</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-base font-medium">admin user</span>
                  <span className="text-sm text-gray-500">Admin</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-base">Min Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-base py-2">Profil</DropdownMenuItem>
              <DropdownMenuItem className="text-base py-2">Innstillinger</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-base py-2">Logg ut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
