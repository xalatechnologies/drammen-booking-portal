
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
import Logo from "@/components/header/Logo";

const AdminHeader = () => {
  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-4 min-w-0">
          <Logo />
        </div>
        
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk i alt innhold..."
              className="pl-10 h-10 text-base bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
              aria-label="Søk i systemet"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-3 py-2 h-9 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label="Velg språk"
              >
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-4 h-3" />
                <span>Norsk</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50">
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-4 h-3 mr-2" />
                Norsk
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50">
                <img src="/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png" alt="EN" className="w-4 h-3 mr-2" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label="Varsler - 3 uleste"
              >
                <Bell className="h-4 w-4 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white shadow-lg border border-gray-200">
              <DropdownMenuLabel className="text-base font-semibold">Varsler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-3 cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-900">Ny forespørsel om lokale</p>
                  <p className="text-xs text-gray-600">Brandengen Skole ba om godkjenning</p>
                  <p className="text-xs text-gray-500">2 minutter siden</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-900">Brukerrolle oppdatert</p>
                  <p className="text-xs text-gray-600">Thomas Hansen er nå administrator</p>
                  <p className="text-xs text-gray-500">1 time siden</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative h-9 gap-2 px-2 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label="Brukerprofil og innstillinger"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" alt="Development User" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">DU</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">Development User</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
              <DropdownMenuLabel className="text-sm font-medium">Min Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50">Profil</DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50">Innstillinger</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50 text-red-600">Logg ut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
