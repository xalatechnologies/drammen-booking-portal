
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Info, CheckCircle, AlertTriangle } from "lucide-react";

type NotificationType = "email" | "sms" | "app";
type NotificationCategory = "bookings" | "approvals" | "system" | "users";
type NotificationStatus = "read" | "unread";
type NotificationPriority = "low" | "medium" | "high";

interface Notification {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  category: NotificationCategory;
  status: NotificationStatus;
  priority: NotificationPriority;
  timestamp: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Ny bookingforespørsel",
    description: "Brandengen Skole har sendt inn en bookingforespørsel for gymsal som krever godkjenning.",
    type: "app",
    category: "bookings",
    status: "unread",
    priority: "medium",
    timestamp: "2023-05-22 09:30"
  },
  {
    id: 2,
    title: "Systemoppdatering",
    description: "Systemet vil være utilgjengelig mellom 02:00 og 04:00 i morgen for vedlikehold.",
    type: "email",
    category: "system",
    status: "read",
    priority: "high",
    timestamp: "2023-05-21 15:45"
  },
  {
    id: 3,
    title: "Brukerrolle endret",
    description: "Thomas Hansen fikk administratorrettigheter av superadmin.",
    type: "app",
    category: "users",
    status: "read",
    priority: "low",
    timestamp: "2023-05-20 11:20"
  },
  {
    id: 4,
    title: "Booking godkjent",
    description: "Din forespørsel om booking av Møterom 3 har blitt godkjent.",
    type: "sms",
    category: "approvals",
    status: "unread",
    priority: "medium",
    timestamp: "2023-05-19 16:10"
  },
  {
    id: 5,
    title: "Nytt anlegg lagt til",
    description: "Fjell skole har blitt lagt til som et nytt bookbart anlegg.",
    type: "email",
    category: "system",
    status: "read",
    priority: "low",
    timestamp: "2023-05-18 13:25"
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  const getNotificationIcon = (category: NotificationCategory) => {
    switch (category) {
      case "bookings":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "approvals":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "system":
        return <Info className="h-5 w-5 text-purple-500" />;
      case "users":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-gray-500" />;
      case "sms":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      case "app":
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityClass = (priority: NotificationPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, status: "read" as NotificationStatus })));
  };

  const getFilteredNotifications = (category: string) => {
    if (category === "all") {
      return notifications;
    }
    return notifications.filter(n => n.category === category);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Varslingssenter</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Varslinger</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleMarkAllAsRead}
                  >
                    Marker alle som lest
                  </Button>
                </div>
                <div className="mt-2">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="bookings">Bookinger</TabsTrigger>
                    <TabsTrigger value="approvals">Godkjenninger</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="users">Brukere</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="all" className="space-y-4 mt-0">
                  {getFilteredNotifications("all").map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      getNotificationIcon={getNotificationIcon}
                      getNotificationTypeIcon={getNotificationTypeIcon}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="bookings" className="space-y-4 mt-0">
                  {getFilteredNotifications("bookings").map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      getNotificationIcon={getNotificationIcon}
                      getNotificationTypeIcon={getNotificationTypeIcon}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="approvals" className="space-y-4 mt-0">
                  {getFilteredNotifications("approvals").map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      getNotificationIcon={getNotificationIcon}
                      getNotificationTypeIcon={getNotificationTypeIcon}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="system" className="space-y-4 mt-0">
                  {getFilteredNotifications("system").map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      getNotificationIcon={getNotificationIcon}
                      getNotificationTypeIcon={getNotificationTypeIcon}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="users" className="space-y-4 mt-0">
                  {getFilteredNotifications("users").map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      getNotificationIcon={getNotificationIcon}
                      getNotificationTypeIcon={getNotificationTypeIcon}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Varslingsinnstillinger</CardTitle>
              <CardDescription>
                Konfigurer hvordan du vil motta varsler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Varslingskanaler</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="email-notifications">E-postvarsler</Label>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="sms-notifications">SMS-varsler</Label>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="app-notifications">App-varsler</Label>
                  </div>
                  <Switch
                    id="app-notifications"
                    checked={appNotifications}
                    onCheckedChange={setAppNotifications}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  Lagre innstillinger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  getNotificationIcon: (category: NotificationCategory) => JSX.Element;
  getNotificationTypeIcon: (type: NotificationType) => JSX.Element | null;
  getPriorityClass: (priority: NotificationPriority) => string;
}

const NotificationItem = ({ 
  notification, 
  getNotificationIcon, 
  getNotificationTypeIcon, 
  getPriorityClass 
}: NotificationItemProps) => {
  return (
    <div className={`p-4 rounded-md border ${notification.status === "unread" ? "bg-blue-50" : "bg-white"}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.category)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityClass(notification.priority)}`}>
              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {notification.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {getNotificationTypeIcon(notification.type)}
              <span>
                {notification.type === "email" ? "E-post" : notification.type === "sms" ? "SMS" : "App"}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              {notification.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
