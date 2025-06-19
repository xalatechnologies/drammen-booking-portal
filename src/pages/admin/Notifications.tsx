import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Info, CheckCircle, AlertTriangle, Trash2, Plus } from "lucide-react";

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

const mockFacilities = [
  "Brandengen Skole - Gymsal",
  "Fjell Skole - Aktivitetshall",
  "Åssiden Fotballhall",
  "Drammen Bibliotek - Møterom"
];
const mockBookingTypes = [
  { value: "dropin", label: "Drop-in" },
  { value: "engangslan", label: "Engangslån" },
  { value: "fastlan", label: "Fastlån" },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  // Abonnement på drop-in-varsler
  const [subscriptions, setSubscriptions] = useState<{
    id: string,
    facility: string,
    type: NotificationType,
    weekday: string,
    time: string,
    bookingType: string
  }[]>([
    { id: "1", facility: "Brandengen Skole - Gymsal", type: "email", weekday: "Mandag", time: "16:00", bookingType: "dropin" },
    { id: "2", facility: "Åssiden Fotballhall", type: "app", weekday: "Torsdag", time: "18:00", bookingType: "dropin" },
  ]);
  const [subFacility, setSubFacility] = useState("");
  const [subType, setSubType] = useState<NotificationType>("email");
  const [subWeekday, setSubWeekday] = useState("Mandag");
  const [subTime, setSubTime] = useState("");
  const [subBookingType, setSubBookingType] = useState("dropin");

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

      {/* Abonnement på drop-in-varsler */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Abonnement på drop-in-varsler</CardTitle>
          <CardDescription>
            Administrer hvilke brukere som får varsler om ledige drop-in-timer basert på lokasjon og kriterier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <form
              className="flex flex-wrap gap-4 items-end"
              onSubmit={e => {
                e.preventDefault();
                setSubscriptions([
                  ...subscriptions,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    facility: subFacility,
                    type: subType,
                    weekday: subWeekday,
                    time: subTime,
                    bookingType: subBookingType,
                  },
                ]);
                setSubFacility("");
                setSubType("email");
                setSubWeekday("Mandag");
                setSubTime("");
                setSubBookingType("dropin");
              }}
            >
              <div>
                <label className="block font-medium mb-1">Lokale</label>
                <select
                  className="border rounded px-3 py-2 min-w-[180px]"
                  value={subFacility}
                  onChange={e => setSubFacility(e.target.value)}
                  required
                >
                  <option value="">Velg lokale</option>
                  {mockFacilities.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Type varsel</label>
                <select
                  className="border rounded px-3 py-2 min-w-[120px]"
                  value={subType}
                  onChange={e => setSubType(e.target.value as NotificationType)}
                  required
                >
                  <option value="email">E-post</option>
                  <option value="sms">SMS</option>
                  <option value="app">App</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Ukedag</label>
                <select
                  className="border rounded px-3 py-2 min-w-[120px]"
                  value={subWeekday}
                  onChange={e => setSubWeekday(e.target.value)}
                  required
                >
                  {[
                    "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"
                  ].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Tidspunkt</label>
                <input
                  type="time"
                  className="border rounded px-3 py-2 min-w-[120px]"
                  value={subTime}
                  onChange={e => setSubTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Bookingtype</label>
                <select
                  className="border rounded px-3 py-2 min-w-[120px]"
                  value={subBookingType}
                  onChange={e => setSubBookingType(e.target.value)}
                  required
                >
                  {mockBookingTypes.map(bt => (
                    <option key={bt.value} value={bt.value}>{bt.label}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Legg til abonnement</Button>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Lokale</th>
                  <th className="px-4 py-2 text-left">Type varsel</th>
                  <th className="px-4 py-2 text-left">Ukedag</th>
                  <th className="px-4 py-2 text-left">Tidspunkt</th>
                  <th className="px-4 py-2 text-left">Bookingtype</th>
                  <th className="px-4 py-2 text-left">Handling</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">Ingen abonnementer funnet.</td>
                  </tr>
                ) : (
                  subscriptions.map(sub => (
                    <tr key={sub.id}>
                      <td className="px-4 py-2">{sub.facility}</td>
                      <td className="px-4 py-2 capitalize">{sub.type}</td>
                      <td className="px-4 py-2">{sub.weekday}</td>
                      <td className="px-4 py-2">{sub.time}</td>
                      <td className="px-4 py-2">{mockBookingTypes.find(bt => bt.value === sub.bookingType)?.label}</td>
                      <td className="px-4 py-2">
                        <Button size="icon" variant="ghost" onClick={() => setSubscriptions(subscriptions.filter(s => s.id !== sub.id))} aria-label="Slett"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
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
