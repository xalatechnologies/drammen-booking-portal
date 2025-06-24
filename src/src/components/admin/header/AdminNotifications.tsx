
import React, { useState, useEffect } from "react";
import { Bell, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { tSync } = useTranslation();
  const { language } = useLanguage();

  // Use database translations for notifications
  const initialNotifications: Notification[] = [
    {
      id: "1",
      title: tSync("admin.notifications.newFacilityRequest.title", "Ny forespørsel om lokale"),
      description: tSync("admin.notifications.newFacilityRequest.description", "Brandengen Skole ba om godkjenning"),
      timestamp: `2 ${tSync("admin.notifications.time.minutesAgo", "minutter siden")}`,
      read: false
    },
    {
      id: "2",
      title: tSync("admin.notifications.userRoleUpdated.title", "Brukerrolle oppdatert"),
      description: tSync("admin.notifications.userRoleUpdated.description", "Thomas Hansen er nå administrator"),
      timestamp: `1 ${tSync("admin.notifications.time.hourAgo", "time siden")}`,
      read: false
    },
    {
      id: "3",
      title: tSync("admin.notifications.systemAlert.title", "Systemvarsel"),
      description: tSync("admin.notifications.systemAlert.description", "Planlagt vedlikehold i kveld kl. 23:00."),
      timestamp: `4 ${tSync("admin.notifications.time.hoursAgo", "timer siden")}`,
      read: true
    },
    {
      id: "4",
      title: tSync("admin.notifications.newMessage.title", "Ny melding mottatt"),
      description: tSync("admin.notifications.newMessage.description", "Du har en ny melding fra Per Olsen."),
      timestamp: `1 ${tSync("admin.notifications.time.dayAgo", "dag siden")}`,
      read: false
    }
  ];

  // Initialize notifications on mount
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [language]); // Re-initialize when language changes

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-11 w-11 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg" 
          aria-label={`${tSync("admin.header.notifications", "Varsler")} - ${unreadCount} uleste`}
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white shadow-lg border border-gray-200">
        <div className="flex justify-between items-center px-3 py-3">
          <DropdownMenuLabel className="text-base font-semibold p-0">
            {tSync("admin.header.notifications", "Varsler")}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleMarkAllAsRead}>
              {tSync("admin.header.markAllAsRead", "Marker alle som lest")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <DropdownMenuItem 
              key={notification.id} 
              className="py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-100" 
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-2 pt-1">
                  {!notification.read && <Circle className="h-2 w-2 text-blue-500 fill-current" />}
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
          <p className="text-center text-sm text-gray-500 py-4">
            {tSync("admin.header.noNewNotifications", "Ingen nye varsler")}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotifications;
