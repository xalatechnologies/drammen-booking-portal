
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

const formSchema = z.object({
  username: z.string().min(3, "Brukernavn må være minst 3 tegn"),
  role: z.enum(["admin", "manager", "user"])
});

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive";
  lastLogin: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Anne Hansen", email: "anne.hansen@drammen.kommune.no", role: "admin", status: "active", lastLogin: "2023-05-15 14:30" },
  { id: 2, name: "Per Olsen", email: "per.olsen@drammen.kommune.no", role: "manager", status: "active", lastLogin: "2023-05-14 09:15" },
  { id: 3, name: "Lisa Andersen", email: "lisa.andersen@drammen.kommune.no", role: "user", status: "inactive", lastLogin: "2023-05-01 11:22" },
  { id: 4, name: "Thomas Berg", email: "thomas.berg@drammen.kommune.no", role: "user", status: "active", lastLogin: "2023-05-10 16:05" },
  { id: 5, name: "Maria Johansen", email: "maria.johansen@drammen.kommune.no", role: "manager", status: "active", lastLogin: "2023-05-13 13:45" }
];

const UsersRolesPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "user" as const
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    // In a real app, you would call an API to add the user
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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Brukere & Roller</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Brukerliste</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Søk etter bruker..."
                    className="pl-9 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                Administrer brukere og tilgangsnivåer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.lastLogin}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8">Rediger</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Legg til ny bruker</CardTitle>
              <CardDescription>
                Opprett en ny bruker og tildel rolle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  
                  <Button type="submit" className="w-full">Legg til bruker</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UsersRolesPage;
