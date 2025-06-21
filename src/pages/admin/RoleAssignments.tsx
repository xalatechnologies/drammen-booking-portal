import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

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
            <CardTitle className="text-2xl">Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Du må være systemadministrator for å tildele roller.</p>
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
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Rolletildelinger"
        description="Tildel roller til brukere og grupper for å administrere tilgangskontroll i systemet"
      />
      
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Tildel roller</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="mb-8">
            <TabsList className="w-full grid grid-cols-2 h-14 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger 
                value="users" 
                className="text-base py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Users className="w-5 h-5 mr-2" />
                Brukere
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="text-base py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Azure AD-grupper
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-semibold text-base text-gray-900 border-b-2">
                    <div className="col-span-4">Navn</div>
                    <div className="col-span-6">Roller</div>
                    <div className="col-span-2 text-right">Handlinger</div>
                  </div>
                  {mockUsers.map(user => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-blue-50 transition-colors duration-200">
                      <div className="col-span-4 text-base font-medium">{user.name}</div>
                      <div className="col-span-6 text-base">
                        {(userAssignments[user.id] || []).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {(userAssignments[user.id] || []).map(role => (
                              <Badge key={role} variant="default" className="text-sm">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Ingen</span>
                        )}
                      </div>
                      <div className="col-span-2 text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openAssignDialog(user.id, "user")}
                          className="text-sm px-4 py-2"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Tildel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
