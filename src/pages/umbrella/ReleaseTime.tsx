import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, Clock, Calendar as CalendarIcon, CheckCircle, Info, Download, Mail } from 'lucide-react';
import { useTranslation } from "@/i18n/hooks/useTranslation";

// Mock data for allocated times
const mockAllocatedTimes = [
  {
    id: 1,
    location: "Fjellhallen",
    weekday: "Torsdag",
    time: "18:00–20:00",
    period: "01.03.2025–30.04.2025",
    status: "Fordelt",
    upcomingDates: ["2025-03-20", "2025-03-27", "2025-04-03", "2025-04-10", "2025-04-17", "2025-04-24"],
    supportsStrotimer: true
  },
  {
    id: 2,
    location: "Åssidenhallen",
    weekday: "Tirsdag",
    time: "19:00–21:00",
    period: "15.03.2025–15.04.2025",
    status: "Delvis brukt",
    upcomingDates: ["2025-03-18", "2025-03-25", "2025-04-01", "2025-04-08", "2025-04-15"],
    supportsStrotimer: false
  }
];

const initialLog = [
  {
    id: 1,
    user: "Kari Nordmann",
    date: "2025-03-01 10:00",
    location: "Fjellhallen",
    released: ["2025-03-20", "2025-03-27"],
    reason: "Påskeferie – laget er bortreist"
  }
];

// Mock data for available strøtimer (time slots)
const mockStrotimer = [
  {
    id: 1,
    location: "Fjellhallen",
    locationType: "Idrettshall",
    date: "2025-03-20",
    weekday: "Torsdag",
    start: "18:00",
    end: "19:00",
    duration: 60,
    status: "ledig"
  },
  {
    id: 2,
    location: "Fjellhallen",
    locationType: "Idrettshall",
    date: "2025-03-20",
    weekday: "Torsdag",
    start: "19:00",
    end: "20:00",
    duration: 60,
    status: "blokkert"
  },
  {
    id: 3,
    location: "Åssidenhallen",
    locationType: "Idrettshall",
    date: "2025-03-21",
    weekday: "Fredag",
    start: "17:00",
    end: "17:30",
    duration: 30,
    status: "ledig"
  },
  {
    id: 4,
    location: "Åssidenhallen",
    locationType: "Idrettshall",
    date: "2025-03-21",
    weekday: "Fredag",
    start: "17:30",
    end: "18:00",
    duration: 30,
    status: "kommende"
  },
  {
    id: 5,
    location: "Fjellhallen",
    locationType: "Idrettshall",
    date: "2025-03-22",
    weekday: "Lørdag",
    start: "10:00",
    end: "11:30",
    duration: 90,
    status: "ledig"
  }
];

const mockMineBookinger = [
  {
    id: 101,
    location: "Fjellhallen",
    date: "2025-03-20",
    start: "18:00",
    end: "19:00",
    status: "kommende"
  },
  {
    id: 102,
    location: "Åssidenhallen",
    date: "2025-03-18",
    start: "17:00",
    end: "17:30",
    status: "kansellert"
  }
];

const locationTypes = ["Idrettshall", "Gymsal", "Svømmehall"];
const durations = [30, 60, 90];
const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

const StrøtimerPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('kalender');
  const [filterWeekday, setFilterWeekday] = useState('');
  const [filterLocationType, setFilterLocationType] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [icalExported, setIcalExported] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [releaseMode, setReleaseMode] = useState<'dates' | 'period'>('dates');
  const [selectedAlloc, setSelectedAlloc] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [reason, setReason] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [log, setLog] = useState(initialLog);

  // Find selected allocation
  const alloc = mockAllocatedTimes.find(a => a.id === selectedAlloc);
  const supportsStrotimer = alloc?.supportsStrotimer;

  // Filter only upcoming
  const upcomingAllocations = mockAllocatedTimes.map(a => ({
    ...a,
    upcomingDates: a.upcomingDates.filter(d => new Date(d) >= new Date())
  })).filter(a => a.upcomingDates.length > 0);

  // Filter logic
  const filteredStrotimer = mockStrotimer.filter(slot =>
    (!filterWeekday || slot.weekday === filterWeekday) &&
    (!filterLocationType || slot.locationType === filterLocationType) &&
    (!filterDuration || slot.duration === Number(filterDuration))
  );

  // Handle date selection
  function toggleDate(date: string) {
    setSelectedDates(dates => dates.includes(date) ? dates.filter(d => d !== date) : [...dates, date]);
  }

  // Validate
  const canPreview = selectedAlloc && (
    (releaseMode === 'dates' && selectedDates.length > 0) ||
    (releaseMode === 'period' && periodFrom && periodTo)
  ) && reason.trim();

  function handlePreview() {
    setShowPreview(true);
  }

  function handleConfirm() {
    // Add to log
    setLog(l => [
      {
        id: l.length + 1,
        user: "Kari Nordmann",
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        location: alloc?.location,
        released: releaseMode === 'dates' ? selectedDates : [periodFrom + '–' + periodTo],
        reason
      },
      ...l
    ]);
    setShowReceipt(true);
    setShowPreview(false);
  }

  function resetForm() {
    setSelectedAlloc(null);
    setSelectedDates([]);
    setReleaseMode('dates');
    setPeriodFrom("");
    setPeriodTo("");
    setRepeatWeekly(false);
    setReason("");
    setShowPreview(false);
    setShowReceipt(false);
  }

  function handleSubscribe() {
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 2000);
  }
  function handleIcalExport() {
    setIcalExported(true);
    setTimeout(() => setIcalExported(false), 2000);
  }
  function handleSendEmail() {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 2000);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Strøtimer"
        description="Administrer og book ledige strøtimer, se kalender og abonner på varsler."
      />
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kalender">Kalender</TabsTrigger>
          <TabsTrigger value="mine">Mine bookinger</TabsTrigger>
          <TabsTrigger value="frigivelse">Frigi tid / Logg</TabsTrigger>
        </TabsList>
        {/* Kalenderfane */}
        <TabsContent value="kalender">
          <Card>
            <CardHeader>
              <CardTitle>Kalender over strøtimer</CardTitle>
              <CardDescription>Se og book ledige strøtimer. Klikk på en tidsbolk for detaljer.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <select className="border rounded px-2 py-1" value={filterWeekday} onChange={e => setFilterWeekday(e.target.value)}>
                  <option value="">Ukedag</option>
                  {weekdays.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <select className="border rounded px-2 py-1" value={filterLocationType} onChange={e => setFilterLocationType(e.target.value)}>
                  <option value="">Lokasjonstype</option>
                  {locationTypes.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select className="border rounded px-2 py-1" value={filterDuration} onChange={e => setFilterDuration(e.target.value)}>
                  <option value="">Lengde</option>
                  {durations.map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
                <Button variant="outline" onClick={handleSubscribe}>
                  <Clock className="mr-2 h-4 w-4" />
                  {subscribed ? "Abonnert!" : "Abonner på nye strøtimer"}
                </Button>
                <Button variant="outline" onClick={handleIcalExport}>
                  <Download className="mr-2 h-4 w-4" />
                  {icalExported ? "iCal eksportert!" : "Eksporter iCal/ICS"}
                </Button>
                <Button variant="outline" onClick={handleSendEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  {emailSent ? "Kvittering sendt!" : "Send kvittering på e-post"}
                </Button>
              </div>
              {/* Kalendergrid: grupper per dato/lokasjon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStrotimer.length === 0 && <div className="text-gray-400">Ingen strøtimer funnet</div>}
                {filteredStrotimer.map(slot => (
                  <div
                    key={slot.id}
                    className={`border rounded-lg p-4 flex flex-col gap-2 cursor-pointer transition hover:shadow-md ${
                      slot.status === 'ledig' ? 'bg-green-50 border-green-300' :
                      slot.status === 'kommende' ? 'bg-blue-50 border-blue-300' :
                      slot.status === 'blokkert' ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed' : ''
                    } ${selectedSlot === slot.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => slot.status === 'ledig' && setSelectedSlot(slot.id)}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{slot.date} ({slot.weekday})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{slot.location}</span>
                      <span className="text-xs text-gray-500">({slot.locationType})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{slot.start}–{slot.end}</span>
                      <span className="text-xs text-gray-500">({slot.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.status === 'ledig' && <span className="text-green-700 font-semibold">Ledig</span>}
                      {slot.status === 'kommende' && <span className="text-blue-700 font-semibold">Kommende</span>}
                      {slot.status === 'blokkert' && <span className="text-gray-500 font-semibold">Blokkert</span>}
                    </div>
                  </div>
                ))}
              </div>
              {/* Bookingsdetaljer/modal kan legges til her hvis ønskelig */}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Mine bookinger fane */}
        <TabsContent value="mine">
          <Card>
            <CardHeader>
              <CardTitle>Mine bookinger</CardTitle>
              <CardDescription>Oversikt over dine kommende og kansellerte bookinger.</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left">Lokasjon</th>
                    <th className="px-3 py-2 text-left">Dato</th>
                    <th className="px-3 py-2 text-left">Tid</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMineBookinger.map(b => (
                    <tr key={b.id} className={b.status === 'kansellert' ? 'bg-red-50 text-red-700' : ''}>
                      <td className="px-3 py-2">{b.location}</td>
                      <td className="px-3 py-2">{b.date}</td>
                      <td className="px-3 py-2">{b.start}–{b.end}</td>
                      <td className="px-3 py-2">{b.status === 'kommende' ? 'Kommende' : 'Kansellert'}</td>
                    </tr>
                  ))}
                  {mockMineBookinger.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-gray-400 py-4">Ingen bookinger</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Frigi tid / Logg fane (gjenbruker tidligere logikk) */}
        <TabsContent value="frigivelse">
          {/* Seksjon 1: Vis tildelt tid */}
          <Card>
            <CardHeader>
              <CardTitle>Tildelt tid</CardTitle>
              <CardDescription>Kun kommende tider vises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left">Lokasjon</th>
                      <th className="px-3 py-2 text-left">Ukedag</th>
                      <th className="px-3 py-2 text-left">Klokkeslett</th>
                      <th className="px-3 py-2 text-left">Periode</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Handling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAllocations.map(a => (
                      <tr key={a.id} className={selectedAlloc === a.id ? 'bg-blue-50' : ''}>
                        <td className="px-3 py-2">{a.location}</td>
                        <td className="px-3 py-2">{a.weekday}</td>
                        <td className="px-3 py-2">{a.time}</td>
                        <td className="px-3 py-2">{a.period}</td>
                        <td className="px-3 py-2">{a.status}</td>
                        <td className="px-3 py-2">
                          <Button size="sm" variant={selectedAlloc === a.id ? "default" : "outline"} onClick={() => setSelectedAlloc(a.id)}>
                            Velg
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {upcomingAllocations.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-gray-400 py-4">Ingen kommende tildelinger</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Seksjon 2: Velg hva du vil frigi */}
          {selectedAlloc && !showPreview && !showReceipt && (
            <Card>
              <CardHeader>
                <CardTitle>Velg tid som skal frigjøres</CardTitle>
                <CardDescription>Velg én eller flere datoer, eller en periode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={releaseMode === 'dates'} onChange={() => setReleaseMode('dates')} />
                    Frigi én eller flere datoer
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={releaseMode === 'period'} onChange={() => setReleaseMode('period')} />
                    Frigi periode
                  </label>
                </div>
                {releaseMode === 'dates' && (
                  <div>
                    <div className="mb-2 text-sm text-gray-600">Velg dato(er):</div>
                    <div className="flex flex-wrap gap-2">
                      {alloc?.upcomingDates.map(date => (
                        <label key={date} className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer">
                          <Checkbox checked={selectedDates.includes(date)} onCheckedChange={() => toggleDate(date)} />
                          <span>{date}</span>
                        </label>
                      ))}
                      {alloc?.upcomingDates.length === 0 && <span className="text-gray-400">Ingen datoer tilgjengelig</span>}
                    </div>
                  </div>
                )}
                {releaseMode === 'period' && (
                  <div className="flex gap-2 items-center">
                    <Input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} className="w-[150px]" placeholder="Fra" />
                    <span>til</span>
                    <Input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} className="w-[150px]" placeholder="Til" />
                    <label className="flex items-center gap-2 ml-4">
                      <Checkbox checked={repeatWeekly} onCheckedChange={v => setRepeatWeekly(!!v)} /> Gjenta ukentlig
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Seksjon 3: Årsak / merknad */}
          {selectedAlloc && !showPreview && !showReceipt && (
            <Card>
              <CardHeader>
                <CardTitle>Årsak / merknad</CardTitle>
                <CardDescription>Forklar hvorfor tiden frigjøres</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Eks: Påskeferie – laget er bortreist"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </CardContent>
            </Card>
          )}

          {/* Seksjon 4: Systemregler og varsling */}
          {selectedAlloc && !showPreview && !showReceipt && (
            <Card>
              <CardContent className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-500" />
                <div>
                  {supportsStrotimer
                    ? <span>Denne hallen støtter strøtimer. Frigitt tid blir synlig for andre som ledige strøtimer.</span>
                    : <span className="text-yellow-700">Denne hallen tillater ikke at frigitt tid vises som strøtimer. Tiden returneres til paraplyadmin.</span>
                  }
                  <div className="text-xs text-gray-500 mt-1">Saksbehandler og paraplyadmin varsles automatisk.</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seksjon 5: Bekreftelse og oversikt */}
          {selectedAlloc && canPreview && !showPreview && !showReceipt && (
            <div className="flex justify-end">
              <Button onClick={handlePreview} className="mt-2">Forhåndsvisning</Button>
            </div>
          )}
          {showPreview && !showReceipt && (
            <Card>
              <CardHeader>
                <CardTitle>Bekreft frigivelse</CardTitle>
                <CardDescription>Dette vil bli frigitt:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><b>Lokasjon:</b> {alloc?.location}</div>
                <div><b>Tid(er):</b> {releaseMode === 'dates' ? selectedDates.join(', ') : periodFrom + ' – ' + periodTo + (repeatWeekly ? ' (ukentlig)' : '')}</div>
                <div><b>Årsak:</b> {reason}</div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white">Bekreft frigivelse</Button>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>Tilbake</Button>
                </div>
              </CardContent>
            </Card>
          )}
          {showReceipt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700"><CheckCircle className="h-5 w-5" /> Frigivelse registrert</CardTitle>
                <CardDescription>Frigivelsen er loggført og varsler er sendt.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" onClick={resetForm}>Frigi mer tid</Button>
                <Button variant="link" className="ml-2" asChild>
                  <a href="/minside/paraply/logg">Se logg</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Logg og historikk */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Logg over frigivelser</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left">Bruker</th>
                    <th className="px-3 py-2 text-left">Dato</th>
                    <th className="px-3 py-2 text-left">Lokasjon</th>
                    <th className="px-3 py-2 text-left">Frigitt tid</th>
                    <th className="px-3 py-2 text-left">Årsak</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map(entry => (
                    <tr key={entry.id}>
                      <td className="px-3 py-2">{entry.user}</td>
                      <td className="px-3 py-2">{entry.date}</td>
                      <td className="px-3 py-2">{entry.location}</td>
                      <td className="px-3 py-2">{Array.isArray(entry.released) ? entry.released.join(', ') : entry.released}</td>
                      <td className="px-3 py-2">{entry.reason}</td>
                    </tr>
                  ))}
                  {log.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-gray-400 py-4">Ingen frigivelser loggført</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrøtimerPage;
