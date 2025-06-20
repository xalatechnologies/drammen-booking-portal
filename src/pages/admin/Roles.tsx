import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Edit, Trash, UserPlus, Users, KeyRound } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';

// Mock Data
const initialRoles = [
  { id: 'admin', name: 'Administrator', permissions: ['manage_bookings', 'manage_users', 'view_reports'] },
  { id: 'editor', name: 'Saksbehandler', permissions: ['manage_bookings'] },
  { id: 'viewer', name: 'Lesetilgang', permissions: ['view_reports'] },
];

const initialUsers = [
  { id: 'user1', name: 'Ola Normann' },
  { id: 'user2', name: 'Kari Nordmann' },
  { id: 'user3', name: 'Per Olsen' },
];

const initialAssignments = [
  { userId: 'user1', roleId: 'admin' },
  { userId: 'user2', roleId: 'editor' },
];

const allPermissions = [
  { id: 'manage_bookings', label: 'Administrere bookinger' },
  { id: 'manage_users', label: 'Administrere brukere' },
  { id: 'view_reports', label: 'Se rapporter' },
  { id: 'manage_facilities', label: 'Administrere lokaler' },
  { id: 'manage_roles', label: 'Administrere roller' },
];

const RolesPage = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [users] = useState(initialUsers);
  const [assignments, setAssignments] = useState(initialAssignments);

  const [selectedRole, setSelectedRole] = useState<{ id: string; name: string; permissions: string[] } | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState<string>('');
  
  const handleSaveRole = () => {
    if (selectedRole) {
      if (roles.some(r => r.id === selectedRole.id && r.id !== selectedRole.id)) {
        // This is a new role with a duplicate ID, which should not happen with this logic
        return; 
      }
      
      if (roles.some(r => r.id === selectedRole.id)) {
        // Edit existing role
        setRoles(roles.map(r => (r.id === selectedRole.id ? selectedRole : r)));
      } else {
        // Add new role
        setRoles([...roles, { ...selectedRole, id: selectedRole.name.toLowerCase().replace(' ', '_') }]);
      }
      setIsRoleModalOpen(false);
      setSelectedRole(null);
    }
  };
  
  const handleAssignRole = () => {
    if (selectedUser && selectedRoleForAssignment) {
      const existingAssignment = assignments.find(a => a.userId === selectedUser);
      if (existingAssignment) {
        setAssignments(assignments.map(a => a.userId === selectedUser ? { ...a, roleId: selectedRoleForAssignment } : a));
      } else {
        setAssignments([...assignments, { userId: selectedUser, roleId: selectedRoleForAssignment }]);
      }
      setSelectedUser('');
      setSelectedRoleForAssignment('');
    }
  };

  const getUserRole = (userId: string) => {
    const assignment = assignments.find(a => a.userId === userId);
    const role = roles.find(r => r.id === assignment?.roleId);
    return role ? role.name : 'Ingen rolle';
  };
  
  return (
    <div className="space-y-8 w-full p-8">
      <PageHeader
        title="Roller og Tildelinger"
        description="Administrer brukerroller og tildel tilganger i systemet."
        actions={
          <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedRole({id: '', name: '', permissions: []}); setIsRoleModalOpen(true);}}>
                <PlusCircle className="mr-2 h-4 w-4" /> Opprett ny rolle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedRole?.id ? 'Rediger rolle' : 'Opprett ny rolle'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="role-name">Rollenavn</Label>
                  <Input id="role-name" value={selectedRole?.name || ''} onChange={(e) => setSelectedRole({...selectedRole!, name: e.target.value})} />
                </div>
                <div>
                  <Label>Tillatelser</Label>
                  <div className="space-y-2 mt-2">
                    {allPermissions.map(p => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={p.id}
                          checked={selectedRole?.permissions.includes(p.id)}
                          onCheckedChange={(checked) => {
                            const newPermissions = checked
                              ? [...selectedRole!.permissions, p.id]
                              : selectedRole!.permissions.filter(perm => perm !== p.id);
                            setSelectedRole({...selectedRole!, permissions: newPermissions});
                          }}
                        />
                        <Label htmlFor={p.id}>{p.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Avbryt</Button>
                <Button onClick={handleSaveRole}>Lagre</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <KeyRound className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{roles.length}</p>
            <p className="text-sm text-gray-600">Totalt antall roller</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Users className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{assignments.length}</p>
            <p className="text-sm text-gray-600">Brukere med tildelt rolle</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Roller</TabsTrigger>
          <TabsTrigger value="assignments">Tildelinger</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Administrer Roller</CardTitle>
              <CardDescription>Definer roller og tilknyttede tillatelser.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Tillatelser</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map(role => (
                    <TableRow key={role.id}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.permissions.join(', ')}</TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => { setSelectedRole(role); setIsRoleModalOpen(true); }}>
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" onClick={() => setRoles(roles.filter(r => r.id !== role.id))}>
                           <Trash className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Tildel Roller til Brukere</CardTitle>
              <CardDescription>Knytt brukere til eksisterende roller for å gi dem tilgang.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-end gap-4 mb-6">
                <div>
                  <Label>Bruker</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger><SelectValue placeholder="Velg bruker" /></SelectTrigger>
                    <SelectContent>
                      {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rolle</Label>
                  <Select value={selectedRoleForAssignment} onValueChange={setSelectedRoleForAssignment}>
                    <SelectTrigger><SelectValue placeholder="Velg rolle" /></SelectTrigger>
                    <SelectContent>
                      {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignRole}>
                  <UserPlus className="mr-2 h-4 w-4" /> Tildel rolle
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bruker</TableHead>
                    <TableHead>Tildelt Rolle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{getUserRole(user.id)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesPage; 