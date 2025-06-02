
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
          <SidebarTrigger />
          <div className="hidden md:flex">
            <Button variant="ghost" size="icon">
              <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk"
              className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Globe className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4" />
                <span className="text-sm">Norsk</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 mr-2" />
                Norsk
              </DropdownMenuItem>
              <DropdownMenuItem>
                <img src="/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png" alt="EN" className="w-5 h-4 mr-2" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">Varsler</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Varsler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Ny forespørsel om fasilitet</p>
                  <p className="text-xs text-muted-foreground">Brandengen Skole ba om godkjenning</p>
                  <p className="text-xs text-muted-foreground">2 minutter siden</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Brukerrolle oppdatert</p>
                  <p className="text-xs text-muted-foreground">Thomas Hansen er nå administrator</p>
                  <p className="text-xs text-muted-foreground">1 time siden</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Ibrahim Rahmani" />
                  <AvatarFallback className="bg-indigo-600 text-white">IR</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">Ibrahim Rahmani</span>
                  <span className="text-xs text-gray-500">Admin</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Min Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Innstillinger</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logg ut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
