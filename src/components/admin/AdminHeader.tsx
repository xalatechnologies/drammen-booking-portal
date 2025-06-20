import React, { useState } from "react";
import { Bell, Search, Globe, Circle } from "lucide-react";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  { id: "1", title: "Ny forespørsel om lokale", description: "Brandengen Skole ba om godkjenning", timestamp: "2 minutter siden", read: false },
  { id: "2", title: "Brukerrolle oppdatert", description: "Thomas Hansen er nå administrator", timestamp: "1 time siden", read: false },
  { id: "3", title: "Systemvarsel", description: "Planlagt vedlikehold i kveld kl. 23:00.", timestamp: "4 timer siden", read: true },
  { id: "4", title: "Ny melding mottatt", description: "Du har en ny melding fra Per Olsen.", timestamp: "1 dag siden", read: false },
];

const AdminHeader = () => {
  const [language, setLanguage] = useState("NO");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleLanguage = () => {
    setLanguage(prev => prev === "NO" ? "EN" : "NO");
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="border-b bg-white shadow-sm z-50 pb-2">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="md:hidden mr-2">
            <SidebarTrigger />
          </div>
          <Logo />
        </div>
        
        <div className="flex-1 flex justify-center px-8">
          <div className="flex items-center gap-4 w-full max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Søk i alt innhold..."
                className="pl-10 h-10 text-base bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                aria-label="Søk i systemet"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button 
            variant="ghost" 
            onClick={toggleLanguage}
            className="flex items-center px-3 py-2 h-9 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
            aria-label={`Bytt språk til ${language === 'NO' ? 'Engelsk' : 'Norsk'}`}
          >
            <span>{language}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                aria-label={`Varsler - ${unreadCount} uleste`}
              >
                <Bell className="h-4 w-4 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white shadow-lg border border-gray-200">
              <div className="flex justify-between items-center px-2 py-2">
                <DropdownMenuLabel className="text-base font-semibold p-0">Varsler</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleMarkAllAsRead}>
                    Marker alle som lest
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-100"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="w-2 pt-1">
                        {!notification.read && (
                          <Circle className="h-2 w-2 text-blue-500 fill-current" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600">{notification.description}</p>
                        <p className="text-xs text-gray-500">{notification.timestamp}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">Ingen nye varsler</p>
              )}
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
                  <AvatarImage src="https://i.pravatar.cc/150?u=system-admin" alt="System Admin" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">SA</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">System Admin</span>
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
