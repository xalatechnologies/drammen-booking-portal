import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Link as LinkIcon, Bell, Mail, AlertTriangle, CalendarCheck2, User, Clock } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

// Mock data
const mockSystemAlerts = [
  {
    id: 1,
    type: "system",
    booking: {
      id: 123,
      date: "2025-09-15",
      time: "18:00–20:00",
      location: "Fjellhallen",
      type: "Trening"
    },
    reason: "Vedlikehold",
    consequence: "Din booking 15.9.25 kl. 18:00–20:00 er kansellert.",
    suggestion: "Forslag: Ledig tid 17.9.25 kl. 20:00–22:00",
    link: "/minside/booking/123",
    attachment: { name: "Retningslinjer.pdf", url: "/docs/retningslinjer.pdf" },
    date: "2025-08-20",
    read: false
  },
  {
    id: 2,
    type: "system",
    booking: {
      id: 124,
      date: "2025-10-01",
      time: "19:00–21:00",
      location: "Åssidenhallen",
      type: "Kamp"
    },
    reason: "Valgdag",
    consequence: "Din booking 1.10.25 kl. 19:00–21:00 er flyttet.",
    suggestion: "Forslag: Ledig tid 2.10.25 kl. 19:00–21:00",
    link: "/minside/booking/124",
    attachment: null,
    date: "2025-09-10",
    read: true
  }
];

const mockAdminMessages = [
  {
    id: 1,
    type: "admin",
    from: "Drammen Kommune Kultur",
    title: "Viktig informasjon om sesongstart 2024/2025",
    date: "2024-08-15",
    read: false,
    attachment: { name: "Sesongstart.pdf", url: "/docs/sesongstart.pdf" }
  },
  {
    id: 2,
    type: "admin",
    from: "Drammen Kommune Idrett",
    title: "Endringer i retningslinjer for bruk av haller",
    date: "2024-07-20",
    read: true,
    attachment: null
  }
];

const mockApplicationMessages = [
  {
    id: 1,
    type: "application",
    application: { id: 456, name: "Søknad #456 – Fjellhallen 12.04.25" },
    from: "Saksbehandler Ola Nordmann",
    date: "2025-03-20",
    message: "Vi trenger mer info om arrangementet.",
    logLink: "/minside/soknad/456/logg",
    read: false
  },
  {
    id: 2,
    type: "application",
    application: { id: 457, name: "Søknad #457 – Åssidenhallen 20.05.25" },
    from: "Saksbehandler Kari Hansen",
    date: "2025-04-10",
    message: "Søknaden er godkjent.",
    logLink: "/minside/soknad/457/logg",
    read: true
  }
];

const mockDeadlineAlerts = [
  {
    id: 1,
    type: "deadline",
    message: "Du har 3 søknader uten behandling i over 5 dager.",
    date: "2025-06-10",
    read: false
  },
  {
    id: 2,
    type: "deadline",
    message: "Lokasjonen Fjellhallen mangler aktiv ansvarlig bruker.",
    date: "2025-06-11",
    read: true
  }
];

const mockSubscriptions = [
  {
    id: 1,
    type: "strøtimer",
    label: "Ledige strøtimer",
    channels: ["E-post", "Intern varsel"],
    active: true
  },
  {
    id: 2,
    type: "søknadsstatus",
    label: "Søknadsstatus oppdateringer",
    channels: ["SMS"],
    active: true
  }
];

const MessagesPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("alle");

  // Helper to filter messages by search and filter
  function matchesFilterAndSearch(m, filter: string, search: string) {
    if (filter !== "alle" && m.section !== filter) return false;
    if (search) {
      const text = JSON.stringify(m).toLowerCase();
      return text.includes(search.toLowerCase());
    }
    return true;
  }

  // Filtered per section
  const filteredSystemAlerts = mockSystemAlerts.filter(m => matchesFilterAndSearch({ ...m, section: "system" }, filter, search));
  const filteredAdminMessages = mockAdminMessages.filter(m => matchesFilterAndSearch({ ...m, section: "admin" }, filter, search));
  const filteredApplicationMessages = mockApplicationMessages.filter(m => matchesFilterAndSearch({ ...m, section: "application" }, filter, search));
  const filteredDeadlineAlerts = mockDeadlineAlerts.filter(m => matchesFilterAndSearch({ ...m, section: "deadline" }, filter, search));

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("umbrella.messages.title", undefined, "Meldinger og Varsler")}
        description={t("umbrella.messages.description", undefined, "Administrer systemmeldinger og varsler")}
      />
      {/* Filter/search row */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Input
          placeholder="Søk i alle meldinger/varsler..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="alle">Alle</option>
          <option value="system">Systemvarsler</option>
          <option value="admin">Meldinger fra kommunen</option>
          <option value="application">Søknads-/bookingmeldinger</option>
          <option value="deadline">Frist/påminnelse</option>
        </select>
      </div>

      {/* Systemvarsler */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold flex items-center gap-2"><Bell className="h-5 w-5" /> Systemvarsler</h2>
        {filteredSystemAlerts.length === 0 && <div className="text-gray-400 text-sm">Ingen treff</div>}
        {filteredSystemAlerts.map(alert => (
          <Card key={alert.id} className={`border-l-4 ${!alert.read ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold">{alert.consequence}</CardTitle>
                  <CardDescription>
                    <span className="font-medium">{alert.booking.location}</span> • {alert.booking.date} {alert.booking.time} ({alert.booking.type})<br />
                    Årsak: <span className="font-medium">{alert.reason}</span><br />
                    {alert.suggestion && <span className="text-green-700">{alert.suggestion}</span>}
                  </CardDescription>
                </div>
                {!alert.read && <Badge variant="default">System</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <a href={alert.link}>Gå til booking</a>
              </Button>
              {alert.attachment && (
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <a href={alert.attachment.url} target="_blank" rel="noopener noreferrer">
                    <Paperclip className="inline h-4 w-4 mr-1" /> {alert.attachment.name}
                  </a>
                </Button>
              )}
              <span className="text-xs text-gray-500 ml-auto">{alert.date}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meldinger fra kommunen */}
      <div className="space-y-2 mt-8">
        <h2 className="text-lg font-bold flex items-center gap-2"><Mail className="h-5 w-5" /> Meldinger fra kommunen</h2>
        {filteredAdminMessages.length === 0 && <div className="text-gray-400 text-sm">Ingen treff</div>}
        {filteredAdminMessages.map(msg => (
          <Card key={msg.id} className={`border-l-4 ${!msg.read ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold">{msg.title}</CardTitle>
                  <CardDescription>Fra: {msg.from}</CardDescription>
                </div>
                {!msg.read && <Badge variant="default">Nyhet</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              {msg.attachment && (
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer">
                    <Paperclip className="inline h-4 w-4 mr-1" /> {msg.attachment.name}
                  </a>
                </Button>
              )}
              <span className="text-xs text-gray-500 ml-auto">{msg.date}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meldinger knyttet til søknader/bookinger */}
      <div className="space-y-2 mt-8">
        <h2 className="text-lg font-bold flex items-center gap-2"><CalendarCheck2 className="h-5 w-5" /> Meldinger knyttet til søknader/bookinger</h2>
        {filteredApplicationMessages.length === 0 && <div className="text-gray-400 text-sm">Ingen treff</div>}
        {filteredApplicationMessages.map(msg => (
          <Card key={msg.id} className={`border-l-4 ${!msg.read ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold">{msg.application.name}</CardTitle>
                  <CardDescription>Fra: {msg.from} • {msg.date}</CardDescription>
                  <div className="mt-2 text-sm">{msg.message}</div>
                </div>
                {!msg.read && <Badge variant="outline">Ny</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <a href={msg.logLink}>Se meldingslogg</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Varsler om frister og påminnelser */}
      <div className="space-y-2 mt-8">
        <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Varsler om frister og påminnelser</h2>
        {filteredDeadlineAlerts.length === 0 && <div className="text-gray-400 text-sm">Ingen treff</div>}
        {filteredDeadlineAlerts.map(alert => (
          <Card key={alert.id} className={`border-l-4 ${!alert.read ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold">{alert.message}</CardTitle>
                </div>
                {!alert.read && <Badge variant="destructive">Påminnelse</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              <span className="text-xs text-gray-500 ml-auto">{alert.date}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Abonnement og innstillinger */}
      <div className="space-y-2 mt-8">
        <h2 className="text-lg font-bold flex items-center gap-2"><Clock className="h-5 w-5" /> Abonnement og innstillinger</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {mockSubscriptions.map(sub => (
            <Card key={sub.id} className="border-l-4 border-indigo-500 bg-indigo-50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold">{sub.label}</CardTitle>
                  <Badge variant="outline">{sub.channels.join(", ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 items-center">
                <span className="text-xs text-gray-500">Status: {sub.active ? "Aktiv" : "Inaktiv"}</span>
                <Button variant="outline" size="sm">Endre</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
