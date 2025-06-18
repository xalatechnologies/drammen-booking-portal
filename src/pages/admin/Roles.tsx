import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialRoles = [
  { id: 1, name: "Fagsystemforvalter", permission: "full admin" },
  { id: 2, name: "Administrator", permission: "full admin" },
  { id: 3, name: "Saksbehandler", permission: "les/skriv" },
  { id: 4, name: "Paraplyrepresentant", permission: "les/skriv" },
  { id: 5, name: "Support", permission: "kun les" },
  { id: 6, name: "Innbygger", permission: "kun les" },
];

const permissionLevels = [
  { value: "kun les", label: "Kun les" },
  { value: "les/skriv", label: "Les/Skriv" },
  { value: "full admin", label: "Full admin" },
];

const mockUser = { name: "Superadmin Bruker", isSuperadmin: true };

const RolesPage = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [log, setLog] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [rolePermission, setRolePermission] = useState(permissionLevels[0].value);

  if (!mockUser.isSuperadmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du må være superadmin for å administrere roller.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openAddDialog = () => {
    setEditRole(null);
    setRoleName("");
    setRolePermission(permissionLevels[0].value);
    setDialogOpen(true);
  };

  const openEditDialog = (role) => {
    setEditRole(role);
    setRoleName(role.name);
    setRolePermission(role.permission);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editRole) {
      setRoles(roles.map(r => r.id === editRole.id ? { ...r, name: roleName, permission: rolePermission } : r));
      setLog([
        { who: mockUser.name, when: new Date().toLocaleString(), what: `Endret rolle: ${editRole.name} → ${roleName}, rettighet: ${rolePermission}` },
        ...log,
      ]);
    } else {
      const newRole = { id: Date.now(), name: roleName, permission: rolePermission };
      setRoles([ ...roles, newRole ]);
      setLog([
        { who: mockUser.name, when: new Date().toLocaleString(), what: `Opprettet rolle: ${roleName}, rettighet: ${rolePermission}` },
        ...log,
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (role) => {
    setRoles(roles.filter(r => r.id !== role.id));
    setLog([
      { who: mockUser.name, when: new Date().toLocaleString(), what: `Slettet rolle: ${role.name}` },
      ...log,
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Roller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={openAddDialog}>Ny rolle</Button>
          </div>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Navn</th>
                <th className="p-2 text-left">Rettighet</th>
                <th className="p-2 text-right">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} className="border-t">
                  <td className="p-2">{role.name}</td>
                  <td className="p-2">{role.permission}</td>
                  <td className="p-2 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(role)}>Rediger</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(role)}>Slett</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRole ? "Rediger rolle" : "Ny rolle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Rollenavn" value={roleName} onChange={e => setRoleName(e.target.value)} />
            <Select value={rolePermission} onValueChange={setRolePermission}>
              <SelectTrigger>
                <SelectValue placeholder="Velg rettighet" />
              </SelectTrigger>
              <SelectContent>
                {permissionLevels.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editRole ? "Lagre" : "Opprett"}</Button>
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

export default RolesPage; 