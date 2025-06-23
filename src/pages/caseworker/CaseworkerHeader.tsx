import React from "react";
import LogoDrammen from "../../../Images/logo-drammen.svg?react";
import { Input } from "@/components/ui/input";
import { Bell, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CaseworkerHeader = () => {
  return (
    <header className="w-full bg-white border-b flex items-center px-8 h-20 fixed top-0 left-0 z-20">
      {/* Kun logo, stor og helt til venstre */}
      <div className="flex items-center min-w-[80px]">
        <LogoDrammen className="h-16 w-auto" />
      </div>
      {/* Søkefelt */}
      <div className="flex-1 flex justify-center">
        <Input
          className="w-full max-w-lg rounded-full bg-[#f4f5f7] border-0 focus-visible:ring-0 px-6"
          placeholder="Search all content..."
        />
      </div>
      {/* Høyre side */}
      <div className="flex items-center gap-4 ml-8">
        {/* Språkvelger */}
        <Button variant="ghost" className="px-2 font-semibold"><Globe className="h-4 w-4 mr-1" />NO</Button>
        {/* Varsler */}
        <Button variant="ghost" className="relative px-2">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">3</Badge>
        </Button>
        {/* Brukerprofil */}
        <div className="flex items-center gap-2">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profil" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-medium hidden md:block">Saksbehandler</span>
        </div>
      </div>
    </header>
  );
};

export default CaseworkerHeader; 