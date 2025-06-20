import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/header/Logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Notification = {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
};

const initialNotifications: Notification[] = [
    { id: "1", title: "Ny tid tildelt", description: "Drammen Håndballklubb har fått 10 nye timer.", timestamp: "5 minutter siden", read: false },
    { id: "2", title: "Bruker har blitt lagt til", description: "Geir Gulliksen er nå en del av din organisasjon.", timestamp: "2 timer siden", read: true },
];

const UmbrellaHeader = () => {
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
        <header className="border-b bg-white shadow-sm z-50 h-[4rem]">
            <div className="flex h-full items-center px-6">
                <div className="flex items-center gap-4">
                    <div className="md:hidden mr-2">
                        <SidebarTrigger />
                    </div>
                    <Logo />
                </div>

                <div className="flex-1 flex justify-center px-8">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Søk i din organisasjon..."
                            className="pl-10 h-10 text-base bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={toggleLanguage}
                        className="h-9 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        {language}
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative h-9 w-9 hover:bg-gray-100"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                {unreadCount}
                            </span>
                            )}
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="flex justify-between items-center px-2 py-2">
                                <DropdownMenuLabel className="p-0">Varsler</DropdownMenuLabel>
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
                                    className="py-2 cursor-pointer"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        {!notification.read && (
                                            <Circle className="h-2 w-2 mt-1.5 text-blue-500 fill-current" />
                                        )}
                                        <div className={`flex flex-col gap-0.5 ${notification.read ? 'pl-5' : ''}`}>
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs text-gray-500">{notification.description}</p>
                                            <p className="text-xs text-gray-400">{notification.timestamp}</p>
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
                            <button className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-100">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Paraplyadministrator" />
                                    <AvatarFallback>PA</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="font-semibold text-sm">Paraply Admin</p>
                                    <p className="text-xs text-gray-500">Drammen FK</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Min Konto</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Innstillinger</DropdownMenuItem>
                            <DropdownMenuItem>Logg ut</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default UmbrellaHeader; 