
import React from "react";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionButton } from "@/components/common/ActionButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Heading5, BodySmall } from "@/components/common/Typography";
import Logo from "@/components/header/Logo";

const AdminHeader = () => {
  return (
    <header className="bg-card sticky top-0 z-50 border-b border-border shadow-md">
      <div className="flex h-20 items-center px-xl gap-xl">
        <div className="flex items-center gap-xl min-w-0">
          <Logo />
          <div className="hidden md:flex items-center gap-sm">
            <BodySmall className="text-muted-foreground">Admin</BodySmall>
            <span className="text-muted-foreground">/</span>
            <BodySmall className="text-foreground font-semibold">Dashboard</BodySmall>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-xl">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-lg top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Søk i alt innhold..."
              className="input-primary pl-12 h-12 text-base rounded-lg"
              aria-label="Søk i systemet"
            />
          </div>
        </div>

        <div className="flex items-center gap-lg flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton 
                variant="ghost" 
                size="md"
                icon={<img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 rounded-sm" />}
                className="text-foreground focus-ring"
                aria-label="Velg språk"
              >
                Norsk
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border shadow-lg">
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 mr-md rounded-sm" />
                Norsk
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">
                <img src="/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png" alt="EN" className="w-5 h-4 mr-md rounded-sm" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton 
                variant="ghost" 
                size="md"
                icon={<Bell className="h-5 w-5" />}
                className="relative text-foreground focus-ring"
                aria-label="Varsler - 3 uleste"
              >
                <StatusBadge 
                  status="error" 
                  showIcon={false}
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  3
                </StatusBadge>
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 bg-card border-border shadow-lg">
              <DropdownMenuLabel>
                <Heading5>Varsler</Heading5>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="border-border" />
              <DropdownMenuItem className="py-lg cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <div className="flex flex-col gap-sm">
                  <BodySmall className="font-semibold text-foreground">Ny forespørsel om lokale</BodySmall>
                  <BodySmall className="text-muted-foreground">Brandengen Skole ba om godkjenning</BodySmall>
                  <BodySmall className="text-muted-foreground">2 minutter siden</BodySmall>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton 
                variant="ghost" 
                size="md"
                className="gap-md text-foreground focus-ring"
                aria-label="Brukerprofil og innstillinger"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Development User" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">DU</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <BodySmall className="font-semibold text-foreground">Development User</BodySmall>
                  <BodySmall className="text-muted-foreground">Administrator</BodySmall>
                </div>
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border shadow-lg">
              <DropdownMenuLabel>
                <BodySmall className="font-semibold text-foreground">Min Konto</BodySmall>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="border-border" />
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">Profil</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">Innstillinger</DropdownMenuItem>
              <DropdownMenuSeparator className="border-border" />
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground text-destructive">Logg ut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
