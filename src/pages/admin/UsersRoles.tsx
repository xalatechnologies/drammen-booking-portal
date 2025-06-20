import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, UserRound, Key, Search, FilePenLine, Ban, Undo2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PageHeader from "@/components/admin/PageHeader";

const formSchema = z.object({
  username: z.string().min(3, "Brukernavn må være minst 3 tegn"),
  role: z.enum(["admin", "saksbehandler", "user"])
});

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "saksbehandler" | "user";
  status: "active" | "inactive" | "blacklisted" | string;
  lastLogin: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Anne Hansen", email: "anne.hansen@drammen.kommune.no", role: "admin", status: "active", lastLogin: "2023-05-15 14:30" },
  { id: 2, name: "Per Olsen", email: "per.olsen@drammen.kommune.no", role: "saksbehandler", status: "active", lastLogin: "2023-05-14 09:15" },
  { id: 3, name: "Lisa Andersen", email: "lisa.andersen@drammen.kommune.no", role: "user", status: "inactive", lastLogin: "2023-05-01 11:22" },
  { id: 4, name: "Thomas Berg", email: "thomas.berg@drammen.kommune.no", role: "user", status: "active", lastLogin: "2023-05-10 16:05" },
  { id: 5, name: "Maria Johansen", email: "maria.johansen@drammen.kommune.no", role: "saksbehandler", status: "active", lastLogin: "2023-05-13 13:45" }
];

const mockAdmin = { name: "Admin Bruker", isAdmin: true };
const mockOrgs = [
  { id: 1, name: "Drammen Idrettslag", status: "active" },
  { id: 2, name: "Skoleforeningen", status: "active" },
];

const UsersRolesPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [orgs, setOrgs] = useState(mockOrgs);
  const [log, setLog] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState(null); // {type: 'user'|'org', id}
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("permanent");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const adminCount = users.filter(u => u.role === 'admin').length;
  const managerCount = users.filter(u => u.role === 'saksbehandler').length;
  const userCount = users.filter(u => u.role === 'user').length;
  const totalUsers = users.length;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "user"
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Skjema sendt inn:", data);
    // I en reell app ville du kalt et API for å legge til brukeren
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    form.reset({
      username: user.name,
      role: user.role,
    });
    setAddUserDialogOpen(true);
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingUser) {
      // Edit user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: data.username, role: data.role } : u));
      
      const changes: string[] = [];
      if (editingUser.name !== data.username) {
        changes.push(`endret navn fra "${editingUser.name}" til "${data.username}"`);
      }
      if (editingUser.role !== data.role) {
        changes.push(`endret rolle fra "${getRoleDisplayName(editingUser.role)}" til "${getRoleDisplayName(data.role)}"`);
      }

      if (changes.length > 0) {
        setLog([
          {
            who: mockAdmin.name,
            when: new Date().toLocaleString(),
            what: `Redigerte bruker ${editingUser.name}: ${changes.join(' og ')}.`,
          },
          ...log
        ]);
      }
    } else {
      // Add new user
      setUsers([
        ...users,
        {
          id: Date.now(),
          name: data.username,
          email: data.username.toLowerCase().replace(" ", ".") + "@drammen.kommune.no",
          role: data.role,
          status: "active",
          lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      ]);
    }
    setAddUserDialogOpen(false);
    setEditingUser(null);
    form.reset({ username: "", role: "user" as const });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "saksbehandler":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4" />;
      case "saksbehandler":
        return <Key className="h-4 w-4" />;
      case "user":
        return <UserRound className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleDisplayName = (role: User["role"]): string => {
    switch (role) {
      case "admin": return "Administrator";
      case "saksbehandler": return "Saksbehandler";
      case "user": return "Vanlig bruker";
      default: return "Ukjent rolle";
    }
  };

  const openDialog = (type, id) => {
    setTarget({ type, id });
    setReason("");
    setDuration("permanent");
    setEndDate("");
    setDialogOpen(true);
  };

  const handleSuspend = () => {
    const name = target.type === "user"
      ? users.find(u => u.id === target.id).name
      : orgs.find(o => o.id === target.id).name;
    const status = duration === "permanent"
      ? "blacklisted"
      : `suspended:${endDate}`;
    if (target.type === "user") {
      setUsers(users.map(u => u.id === target.id ? { ...u, status } : u));
    } else {
      setOrgs(orgs.map(o => o.id === target.id ? { ...o, status } : o));
    }
    setLog([
      { who: mockAdmin.name, when: new Date().toLocaleString(), what: `Suspendert/${duration === "permanent" ? "blacklistet" : "midlertidig suspendert"} ${target.type === "user" ? "bruker" : "organisasjon"}: ${name}`, reason, duration, endDate },
      ...log,
    ]);
    setDialogOpen(false);
  };

  const liftSuspension = (type, id) => {
    const name = type === "user"
      ? users.find(u => u.id === id).name
      : orgs.find(o => o.id === id).name;
    if (type === "user") {
      setUsers(users.map(u => u.id === id ? { ...u, status: "active" } : u));
    } else {
      setOrgs(orgs.map(o => o.id === id ? { ...o, status: "active" } : o));
    }
    setLog([
      { who: mockAdmin.name, when: new Date().toLocaleString(), what: `Opphevet suspensjon/blacklist for ${type === "user" ? "bruker" : "organisasjon"}: ${name}` },
      ...log,
    ]);
  };

  const getStatusLabel = (status) => {
    if (status === "active") return <span className="text-green-700">Aktiv</span>;
    if (status === "blacklisted") return <span className="text-red-700">Blacklisted (permanent)</span>;
    if (status.startsWith("suspended:")) return <span className="text-amber-700">Suspendert til {format(new Date(status.split(":")[1]), "yyyy-MM-dd")}</span>;
    return status;
  };

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <PageHeader 
        title="Brukere og Roller"
        description="Administrer brukere, roller og tilganger i systemet."
        actions={
          <Button onClick={() => setAddUserDialogOpen(true)}>Ny bruker</Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <UserRound className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-sm text-gray-600">Totalt antall brukere</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <ShieldCheck className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{adminCount}</p>
            <p className="text-sm text-gray-600">Administratorer</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Key className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{managerCount}</p>
            <p className="text-sm text-gray-600">Saksbehandlere</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <UserRound className="h-6 w-6 text-gray-400 mb-4" />
            <p className="text-2xl font-bold">{userCount}</p>
            <p className="text-sm text-gray-600">Vanlige brukere</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Brukerliste</CardTitle>
            <CardDescription>
              Administrer brukere og tilgangsnivåer
            </CardDescription>
          </div>
          <div className="relative w-full md:w-auto md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Søk etter bruker..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Navn</th>
                  <th className="text-left py-3 px-4 font-medium">E-post</th>
                  <th className="text-left py-3 px-4 font-medium">Rolle</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Siste innlogging</th>
                  <th className="text-right py-3 px-4 font-medium">Handlinger</th>
                </tr>
              </thead>
              <TooltipProvider>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{user.lastLogin}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(user)}>
                                <FilePenLine className="h-4 w-4" />
                                <span className="sr-only">Rediger</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rediger bruker</p>
                            </TooltipContent>
                          </Tooltip>

                          {(user.status === "active") ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog("user", user.id)}>
                                  <Ban className="h-4 w-4" />
                                  <span className="sr-only">Suspender</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Suspender bruker</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => liftSuspension("user", user.id)}>
                                  <Undo2 className="h-4 w-4" />
                                  <span className="sr-only">Opphev</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Opphev suspensjon</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TooltipProvider>
            </table>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>Endringslogg</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs space-y-1">
            {log.length === 0 && <li>Ingen endringer ennå.</li>}
            {log.map((entry, i) => (
              <li key={i}>
                <span className="font-semibold">{entry.who}</span> – {entry.when}: {entry.what} {entry.reason && <>Årsak: {entry.reason}.</>} {entry.duration && <>Varighet: {entry.duration === "permanent" ? "permanent" : `til ${entry.endDate}`}</>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender / Blacklist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Årsak" value={reason} onChange={e => setReason(e.target.value)} />
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Varighet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="temporary">Midlertidig</SelectItem>
              </SelectContent>
            </Select>
            {duration === "temporary" && (
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSuspend} disabled={duration === "temporary" && !endDate}>Bekreft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={addUserDialogOpen} onOpenChange={(isOpen) => {
        setAddUserDialogOpen(isOpen);
        if (!isOpen) {
          setEditingUser(null);
          form.reset({ username: "", role: "user" as const });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Rediger bruker' : 'Legg til ny bruker'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brukernavn</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv inn brukernavn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Rolle</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin" className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Administrator
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="saksbehandler" id="saksbehandler" />
                          <Label htmlFor="saksbehandler" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Saksbehandler
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user" className="flex items-center gap-2">
                            <UserRound className="h-4 w-4" />
                            Vanlig bruker
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full">{editingUser ? 'Lagre endringer' : 'Legg til bruker'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersRolesPage;
