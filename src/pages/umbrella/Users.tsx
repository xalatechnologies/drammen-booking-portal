import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Edit2, Trash2, User, Search as SearchIcon, Phone, Bell, ChevronDown, ChevronUp, UserPlus, ShieldCheck, CalendarCog, FileOutput } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Checkbox } from "@/components/ui/checkbox";

// Updated mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Kari Nordmann",
    email: "kari@idrett.no",
    organization: "Åssiden IF",
    affiliation: "Åssiden IF",
    role: "Delegat",
    status: "Aktiv",
    lastLogin: "2025-06-20",
    permissions: ["canAllocateTime"],
    history: [
      { date: "2025-06-20", action: "Innlogging", by: "Kari Nordmann" },
      { date: "2025-06-18", action: "Tildelt rolle: Delegat", by: "Admin" },
      { date: "2025-06-15", action: "Opprettet bruker", by: "Admin" },
    ],
  },
  {
    id: 2,
    name: "Ola Nordmann",
    email: "ola@drammenif.no",
    organization: "Drammen IF",
    affiliation: "Drammen IF",
    role: "Tildelingsansvarlig",
    status: "Aktiv",
    lastLogin: "2025-06-19",
    permissions: ["canAllocateTime", "canReleaseTime"],
    history: [
      { date: "2025-06-19", action: "Innlogging", by: "Ola Nordmann" },
      { date: "2025-06-10", action: "Endret rolle: Tildelingsansvarlig", by: "Admin" },
    ],
  },
  {
    id: 3,
    name: "Per Olsen",
    email: "per@drammensv.no",
    organization: "Drammen SV",
    affiliation: "Drammen SV",
    role: "Saksbehandler",
    status: "Inaktiv",
    lastLogin: "2025-06-10",
    permissions: [],
    history: [
      { date: "2025-06-10", action: "Innlogging", by: "Per Olsen" },
      { date: "2025-06-01", action: "Tildelt rolle: Saksbehandler", by: "Admin" },
    ],
  },
];

const mockAffiliations = [
  "Alle organisasjoner",
  "Åssiden IF",
  "Drammen IF",
  "Drammen SV",
];
const mockRoles = ["Alle roller", "Delegat", "Tildelingsansvarlig", "Saksbehandler"];
const mockStatuses = ["Alle statuser", "Aktiv", "Inaktiv"];

const allPermissions = [
  { id: "canAllocateTime", label: "Tildelingsrett for rammetid", icon: CalendarCog },
  { id: "canReleaseTime", label: "Kan frigi tid til strøtimer", icon: FileOutput },
  { id: "canAdminUsers", label: "Kan administrere brukere", icon: User },
];

const UsersPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Alle roller");
  const [filterAffiliation, setFilterAffiliation] = useState("Alle organisasjoner");
  const [filterStatus, setFilterStatus] = useState("Alle statuser");
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<{ open: boolean; user?: any }>({ open: false });
  const [showNotifyModal, setShowNotifyModal] = useState<{ open: boolean; user?: any }>({ open: false });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

  // Filtering logic
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "Alle roller" || user.role === filterRole;
    const matchesAffiliation = filterAffiliation === "Alle organisasjoner" || user.affiliation === filterAffiliation;
    const matchesStatus = filterStatus === "Alle statuser" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesAffiliation && matchesStatus;
  });

  function handleOpenRoleModal(user: any) {
    setEditingPermissions(user.permissions || []);
    setShowRoleModal({ open: true, user });
  }

  function handlePermissionChange(permissionId: string) {
    setEditingPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("umbrella.users.title", undefined, "Brukere & Organisasjoner")}
        description={t(
          "umbrella.users.description",
          undefined,
          "Administrer tilgang og roller for brukere i paraplysystemet."
        )}
        actions={
          <Button onClick={() => setShowInviteModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("umbrella.users.addUser", undefined, "Legg til bruker")}
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>{t("umbrella.users.allUsers", undefined, "Alle brukere")}</CardTitle>
          <CardDescription>
            {t(
              "umbrella.users.allUsersDescription",
              undefined,
              "Oversikt over alle registrerte brukere og deres organisasjoner."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter/search row */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <Input
              placeholder={t(
                "umbrella.users.search.placeholder",
                undefined,
                "Søk etter navn, e-post eller organisasjon..."
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rolle" />
              </SelectTrigger>
              <SelectContent>
                {mockRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAffiliation} onValueChange={setFilterAffiliation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tilhørighet" />
              </SelectTrigger>
              <SelectContent>
                {mockAffiliations.map((aff) => (
                  <SelectItem key={aff} value={aff}>
                    {aff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {mockStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Navn</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rolle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nøkkelrettigheter</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Handlinger</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">
                        <div>{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-1">
                          {user.permissions.map(p => {
                            const perm = allPermissions.find(ap => ap.id === p);
                            return perm ? (
                              <Badge key={p} variant="secondary" className="flex items-center gap-1">
                                <perm.icon className="h-3 w-3" />
                                {perm.label}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant={user.status === "Aktiv" ? "default" : "secondary"}>{user.status}</Badge>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenRoleModal(user)} title="Administrer roller og rettigheter">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowNotifyModal({ open: true, user })} title="Send varsel">
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Fjern tilgang">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-2 py-2">
                        <Button variant="ghost" size="icon" onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)} aria-label="Vis logg/historikk">
                          {expandedUser === user.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </td>
                    </tr>
                    {expandedUser === user.id && (
                      <tr>
                        <td colSpan={8} className="bg-gray-50 px-6 py-4">
                          <div className="text-sm font-semibold mb-2">Logg og historikk</div>
                          <ul className="text-sm space-y-1">
                            {user.history.map((h, idx) => (
                              <li key={idx} className="flex justify-between text-gray-700">
                                <span>{h.date}</span>
                                <span>{h.action}</span>
                                <span className="text-gray-400">{h.by}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Administrer roller og rettigheter */}
      {showRoleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Administrer roller og rettigheter</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowRoleModal({ open: false })}>
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rolle</label>
                <Select value={showRoleModal.user.role} onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg rolle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delegat">Delegat</SelectItem>
                    <SelectItem value="Tildelingsansvarlig">Tildelingsansvarlig</SelectItem>
                    <SelectItem value="Saksbehandler">Saksbehandler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lokasjoner</label>
                <Select value={showRoleModal.user.affiliation} onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg lokasjon" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAffiliations.filter(a => a !== "Alle organisasjoner").map((aff) => (
                      <SelectItem key={aff} value={aff}>{aff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tidsbegrenset tilgang</label>
                <Input type="date" />
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-md font-semibold mb-2">Spesifikke rettigheter</h3>
                <div className="space-y-2">
                  {allPermissions.map(p => (
                    <label key={p.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                      <Checkbox
                        checked={editingPermissions.includes(p.id)}
                        onCheckedChange={() => handlePermissionChange(p.id)}
                      />
                      <p.icon className="h-4 w-4 text-gray-600" />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowRoleModal({ open: false })}>Avbryt</Button>
                <Button>Lagre endringer</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Send varsel */}
      {showNotifyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Send varsel</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifyModal({ open: false })}>
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Melding</label>
                <Select defaultValue="rolle">
                  <SelectTrigger>
                    <SelectValue placeholder="Velg meldingstype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rolle">Du er tildelt ny rolle</SelectItem>
                    <SelectItem value="tilgang">Tilgangen din er endret</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Egendefinert melding</label>
                <Input placeholder="Skriv en melding..." />
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowNotifyModal({ open: false })}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Legg til bruker */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Legg til bruker</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}>
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-post</label>
                <Input type="email" placeholder="bruker@epost.no" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tilhørighet</label>
                <Select defaultValue={mockAffiliations[1]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg tilhørighet" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAffiliations.filter(a => a !== "Alle organisasjoner").map((aff) => (
                      <SelectItem key={aff} value={aff}>{aff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rolle</label>
                <Select defaultValue={mockRoles[1]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg rolle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.filter(r => r !== "Alle roller").map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowInviteModal(false)}>Send invitasjon</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
