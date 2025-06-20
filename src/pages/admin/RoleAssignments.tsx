import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const mockUser = { name: "Superadmin Bruker", isSuperadmin: true };
const mockRoles = [
  "Fagsystemforvalter",
  "Administrator",
  "Saksbehandler",
  "Paraplyrepresentant",
  "Support",
  "Innbygger",
];
const mockUsers = [
  { id: 1, name: "Ola Nordmann" },
  { id: 2, name: "Kari Nordmann" },
  { id: 3, name: "Per Hansen" },
];
const mockGroups = [
  { id: 1, name: "IT-Drift" },
  { id: 2, name: "HR-Avdeling" },
  { id: 3, name: "Skole-Admins" },
];

const currentUser = { name: "Admin Bruker", role: "systemadmin" };

const RoleAssignmentsPage = () => {
  const [tab, setTab] = useState("users");
  const [userAssignments, setUserAssignments] = useState({
    1: ["Administrator"],
    2: ["Saksbehandler"],
    3: [],
  });
  const [groupAssignments, setGroupAssignments] = useState({
    1: ["Support"],
    2: [],
    3: ["Paraplyrepresentant"],
  });
  const [log, setLog] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [assignType, setAssignType] = useState("user");

  if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du må være systemadministrator for å tildele roller.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openAssignDialog = (id, type) => {
    setAssignType(type);
    setSelectedId(id);
    setSelectedRoles(
      type === "user" ? userAssignments[id] || [] : groupAssignments[id] || []
    );
    setDialogOpen(true);
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = () => {
    if (assignType === "user") {
      setUserAssignments({
        ...userAssignments,
        [selectedId]: selectedRoles,
      });
      setLog([
        { who: mockUser.name, when: new Date().toLocaleString(), what: `Tildelte roller til bruker: ${mockUsers.find(u => u.id === selectedId).name} → ${selectedRoles.join(", ")}` },
        ...log,
      ]);
    } else {
      setGroupAssignments({
        ...groupAssignments,
        [selectedId]: selectedRoles,
      });
      setLog([
        { who: mockUser.name, when: new Date().toLocaleString(), what: `Tildelte roller til gruppe: ${mockGroups.find(g => g.id === selectedId).name} → ${selectedRoles.join(", ")}` },
        ...log,
      ]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Rolletildelinger
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Tildel roller til brukere og grupper
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Tildel roller</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="mb-6">
            <TabsList className="w-full flex">
              <TabsTrigger value="users" className="flex-1">Brukere</TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">Azure AD-grupper</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Navn</th>
                      <th className="p-2 text-left">Roller</th>
                      <th className="p-2 text-right">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map(user => (
                      <tr key={user.id} className="border-t">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{(userAssignments[user.id] || []).join(", ") || <span className="text-gray-400">Ingen</span>}</td>
                        <td className="p-2 text-right">
                          <Button size="sm" variant="outline" onClick={() => openAssignDialog(user.id, "user")}>Tildel / Endre</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="groups">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Navn</th>
                      <th className="p-2 text-left">Roller</th>
                      <th className="p-2 text-right">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockGroups.map(group => (
                      <tr key={group.id} className="border-t">
                        <td className="p-2">{group.name}</td>
                        <td className="p-2">{(groupAssignments[group.id] || []).join(", ") || <span className="text-gray-400">Ingen</span>}</td>
                        <td className="p-2 text-right">
                          <Button size="sm" variant="outline" onClick={() => openAssignDialog(group.id, "group")}>Tildel / Endre</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tildel roller</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {mockRoles.map(role => (
              <div key={role} className="flex items-center gap-3">
                <Checkbox id={role} checked={selectedRoles.includes(role)} onCheckedChange={() => handleRoleToggle(role)} />
                <label htmlFor={role} className="text-sm cursor-pointer">{role}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Lagre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Endringslogg</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs space-y-1">
            {log.length === 0 && <li>Ingen endringer ennå.</li>}
            {log.map((entry, i) => (
              <li key={i}>
                <span className="font-semibold">{entry.who}</span> – {entry.when}: {entry.what}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleAssignmentsPage; 