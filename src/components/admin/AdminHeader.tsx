
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
    <header className="glass sticky top-0 z-50 border-b border-white/10 shadow-medium animate-fade-in">
      <div className="flex h-20 items-center px-8">
        <div className="flex items-center gap-6 min-w-0">
          <Logo />
          <div className="hidden md:flex items-center gap-2 text-sm text-navy-500">
            <span>Admin</span>
            <span>/</span>
            <span className="text-navy-700 font-medium">Dashboard</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-8">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-400" />
              <Input
                placeholder="Søk i alt innhold..."
                className="pl-12 h-12 text-base bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white/80 focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-300 rounded-2xl shadow-soft"
                aria-label="Søk i systemet"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="glass flex items-center gap-3 px-4 py-2 h-12 text-sm font-medium text-navy-700 hover:bg-white/20 focus-ring rounded-2xl border border-white/10 transition-all duration-300"
                aria-label="Velg språk"
              >
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 rounded-sm" />
                <span className="font-medium">Norsk</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/20 shadow-strong rounded-2xl animate-scale-in">
              <DropdownMenuItem className="text-sm py-3 px-4 hover:bg-white/10 rounded-xl transition-colors">
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 mr-3 rounded-sm" />
                Norsk
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-3 px-4 hover:bg-white/10 rounded-xl transition-colors">
                <img src="/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png" alt="EN" className="w-5 h-4 mr-3 rounded-sm" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass relative h-12 w-12 hover:bg-white/20 focus-ring rounded-2xl border border-white/10 transition-all duration-300"
                aria-label="Varsler - 3 uleste"
              >
                <Bell className="h-5 w-5 text-navy-600" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-secondary text-white text-xs flex items-center justify-center font-bold shadow-medium">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 glass border-white/20 shadow-strong rounded-2xl animate-scale-in">
              <DropdownMenuLabel className="text-lg font-bold text-navy-900 px-6 py-4">Varsler</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="py-4 px-6 cursor-pointer hover:bg-white/10 rounded-xl mx-2 my-1 transition-colors">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-navy-900">Ny forespørsel om lokale</p>
                  <p className="text-xs text-navy-600">Brandengen Skole ba om godkjenning</p>
                  <p className="text-xs text-navy-500">2 minutter siden</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-4 px-6 cursor-pointer hover:bg-white/10 rounded-xl mx-2 my-1 transition-colors">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-navy-900">Brukerrolle oppdatert</p>
                  <p className="text-xs text-navy-600">Thomas Hansen er nå administrator</p>
                  <p className="text-xs text-navy-500">1 time siden</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="glass relative h-12 gap-3 px-4 hover:bg-white/20 focus-ring rounded-2xl border border-white/10 transition-all duration-300"
                aria-label="Brukerprofil og innstillinger"
              >
                <Avatar className="h-8 w-8 ring-2 ring-white/20">
                  <AvatarImage src="/placeholder.svg" alt="Development User" />
                  <AvatarFallback className="bg-gradient-secondary text-white text-xs font-bold">DU</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-navy-900">Development User</span>
                  <span className="text-xs text-navy-500">Administrator</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/20 shadow-strong rounded-2xl animate-scale-in">
              <DropdownMenuLabel className="text-sm font-semibold text-navy-900 px-4 py-3">Min Konto</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-sm py-3 px-4 hover:bg-white/10 rounded-xl mx-2 my-1 transition-colors">Profil</DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-3 px-4 hover:bg-white/10 rounded-xl mx-2 my-1 transition-colors">Innstillinger</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-sm py-3 px-4 hover:bg-red-50 text-red-600 rounded-xl mx-2 my-1 transition-colors">Logg ut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
