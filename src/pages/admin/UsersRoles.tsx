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
import { ShieldCheck, UserRound, Key, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const formSchema = z.object({
  username: z.string().min(3, "Brukernavn må være minst 3 tegn"),
  role: z.enum(["admin", "manager", "user"])
});

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive" | "blacklisted" | string;
  lastLogin: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Anne Hansen", email: "anne.hansen@drammen.kommune.no", role: "admin", status: "active", lastLogin: "2023-05-15 14:30" },
  { id: 2, name: "Per Olsen", email: "per.olsen@drammen.kommune.no", role: "manager", status: "active", lastLogin: "2023-05-14 09:15" },
  { id: 3, name: "Lisa Andersen", email: "lisa.andersen@drammen.kommune.no", role: "user", status: "inactive", lastLogin: "2023-05-01 11:22" },
  { id: 4, name: "Thomas Berg", email: "thomas.berg@drammen.kommune.no", role: "user", status: "active", lastLogin: "2023-05-10 16:05" },
  { id: 5, name: "Maria Johansen", email: "maria.johansen@drammen.kommune.no", role: "manager", status: "active", lastLogin: "2023-05-13 13:45" }
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "user" as const
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Skjema sendt inn:", data);
    // I en reell app ville du kalt et API for å legge til brukeren
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
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
      case "manager":
        return <Key className="h-4 w-4" />;
      case "user":
        return <UserRound className="h-4 w-4" />;
      default:
        return null;
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Brukere & Roller</h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="relative w-full sm:w-auto order-1 sm:order-none">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Søk etter bruker..."
            className="pl-9 w-full sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddUserDialogOpen(true)} className="w-full sm:w-auto order-2 sm:order-none">Ny bruker</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brukerliste</CardTitle>
          <CardDescription>
            Administrer brukere og tilgangsnivåer
          </CardDescription>
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
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role === "admin" ? "Administrator" : 
                         user.role === "manager" ? "Manager" : "Vanlig bruker"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.lastLogin}</td>
                    <td className="py-3 px-4 text-right">
                      {(user.status === "active") ? (
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => openDialog("user", user.id)}>Suspender</Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => liftSuspension("user", user.id)}>Opphev</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
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
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legg til ny bruker</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
              setUsers([
                ...users,
                {
                  id: Date.now(),
                  name: data.username,
                  email: data.username + "@drammen.kommune.no",
                  role: data.role,
                  status: "active",
                  lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ')
                }
              ]);
              setAddUserDialogOpen(false);
            })} className="space-y-4">
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
                            <ShieldCheck className="h-4 w-4 text-red-600" />
                            Administrator
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manager" id="manager" />
                          <Label htmlFor="manager" className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-blue-600" />
                            Manager
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user" className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-green-600" />
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
                <Button type="submit" className="w-full">Legg til bruker</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersRolesPage;
