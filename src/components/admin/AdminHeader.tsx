
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
    <header className="surface-primary sticky top-0 z-50 border-b border-primary shadow-md">
      <div className="flex h-20 items-center px-8 gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <Logo />
          <div className="hidden md:flex items-center gap-2 text-sm">
            <BodySmall className="text-text-tertiary">Admin</BodySmall>
            <span className="text-text-tertiary">/</span>
            <BodySmall className="text-text-primary font-medium">Dashboard</BodySmall>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              placeholder="Søk i alt innhold..."
              className="input-primary pl-12 h-12 text-base"
              aria-label="Søk i systemet"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton 
                variant="ghost" 
                size="md"
                icon={<img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 rounded-sm" />}
                className="text-text-primary"
                aria-label="Velg språk"
              >
                Norsk
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="surface-primary border-primary shadow-lg">
              <DropdownMenuItem className="hover:bg-surface-secondary">
                <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="NO" className="w-5 h-4 mr-3 rounded-sm" />
                Norsk
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-surface-secondary">
                <img src="/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png" alt="EN" className="w-5 h-4 mr-3 rounded-sm" />
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
                className="relative text-text-primary"
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
            <DropdownMenuContent align="end" className="w-96 surface-primary border-primary shadow-lg">
              <DropdownMenuLabel>
                <Heading5>Varsler</Heading5>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary" />
              <DropdownMenuItem className="py-4 cursor-pointer hover:bg-surface-secondary">
                <div className="flex flex-col gap-2">
                  <BodySmall className="font-semibold text-text-primary">Ny forespørsel om lokale</BodySmall>
                  <BodySmall className="text-text-secondary">Brandengen Skole ba om godkjenning</BodySmall>
                  <BodySmall className="text-text-tertiary">2 minutter siden</BodySmall>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton 
                variant="ghost" 
                size="md"
                className="gap-3 text-text-primary"
                aria-label="Brukerprofil og innstillinger"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Development User" />
                  <AvatarFallback className="bg-brand-primary text-text-inverse text-xs font-bold">DU</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <BodySmall className="font-semibold text-text-primary">Development User</BodySmall>
                  <BodySmall className="text-text-secondary">Administrator</BodySmall>
                </div>
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="surface-primary border-primary shadow-lg">
              <DropdownMenuLabel>
                <BodySmall className="font-semibold text-text-primary">Min Konto</BodySmall>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary" />
              <DropdownMenuItem className="hover:bg-surface-secondary">Profil</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-surface-secondary">Innstillinger</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary" />
              <DropdownMenuItem className="hover:bg-surface-secondary text-semantic-error">Logg ut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
