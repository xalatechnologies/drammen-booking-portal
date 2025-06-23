import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Shield, Users, Settings, Eye, Lock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const RolesPage = () => {
  const { tSync } = useTranslation();
  const [roles, setRoles] = useState([
    {
      id: "1",
      name: tSync("admin.roles.systemAdminRole", "System Administrator"),
      description: tSync("admin.roles.systemAdminDescription", "Har full tilgang til alle systemfunksjoner."),
      permissions: ["read", "create", "update", "delete"],
      users: 5,
      systemRole: true,
    },
    {
      id: "2",
      name: tSync("admin.roles.adminRole", "Administrator"),
      description: tSync("admin.roles.adminDescription", "Kan administrere brukere, Lokaler og bookinger."),
      permissions: ["read", "create", "update"],
      users: 15,
      systemRole: false,
    },
    {
      id: "3",
      name: tSync("admin.roles.facilityManagerRole", "Lokalsansvarlig"),
      description: tSync("admin.roles.facilityManagerDescription", "Administrerer spesifikke Lokaler og deres tilgjengelighet."),
      permissions: ["read", "update"],
      users: 8,
      systemRole: false,
    },
    {
      id: "4",
      name: tSync("admin.roles.bookingAgentRole", "Booking Agent"),
      description: tSync("admin.roles.bookingAgentDescription", "Kan opprette og administrere bookinger."),
      permissions: ["read", "create"],
      users: 22,
      systemRole: false,
    },
    {
      id: "5",
      name: tSync("admin.roles.guestRole", "Gjest"),
      description: tSync("admin.roles.guestDescription", "Har begrenset tilgang, kun lesetilgang."),
      permissions: ["read"],
      users: 50,
      systemRole: false,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  const handleInputChange = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (permission) => {
    if (newRole.permissions.includes(permission)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter((p) => p !== permission),
      });
    } else {
      setNewRole({ ...newRole, permissions: [...newRole.permissions, permission] });
    }
  };

  const handleCreateRole = () => {
    const newId = Math.random().toString(36).substring(7);
    setRoles([
      ...roles,
      {
        id: newId,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        users: 0,
        systemRole: false,
      },
    ]);
    setOpen(false);
    setNewRole({ name: "", description: "", permissions: [] });
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const permissionOptions = ["read", "create", "update", "delete"];

  return (
    <div className="space-y-6">
      <PageHeader
        title={tSync("admin.roles.management", "Roller og rettigheter")}
        description={tSync("admin.roles.pageDescription", "Administrer roller og tilgangsnivåer for brukere.")}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {tSync("admin.roles.addNewRole", "Legg til ny rolle")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{tSync("admin.roles.createRole", "Opprett ny rolle")}</DialogTitle>
                <DialogDescription>
                  {tSync("admin.roles.defineRolePermissions", "Definer navn og beskrivelse, og velg tillatelser for den nye rollen.")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{tSync("admin.roles.roleName", "Rollenavn")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newRole.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">{tSync("admin.roles.roleDescription", "Beskrivelse")}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newRole.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{tSync("admin.roles.permissions", "Tillatelser")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {permissionOptions.map((permission) => (
                      <div key={permission} className="space-x-2">
                        <Checkbox
                          id={permission}
                          checked={newRole.permissions.includes(permission)}
                          onCheckedChange={() => handlePermissionChange(permission)}
                        />
                        <Label htmlFor={permission}>{permission}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  {tSync("admin.roles.cancel", "Avbryt")}
                </Button>
                <Button type="submit" onClick={handleCreateRole}>
                  {tSync("admin.roles.create", "Opprett")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {role.name}
                {role.systemRole && (
                  <Badge variant="secondary">{tSync("admin.roles.systemRole", "Systemrolle")}</Badge>
                )}
              </CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>
                  {tSync("admin.roles.permissions", "Tillatelser")}: {role.permissions.join(", ")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>
                  {tSync("admin.roles.users", "Brukere")}: {role.users}
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                {!role.systemRole && (
                  <>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      {tSync("admin.roles.edit", "Rediger")}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {tSync("admin.roles.delete", "Slett")}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesPage;
