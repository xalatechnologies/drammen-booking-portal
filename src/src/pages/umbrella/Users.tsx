
import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Edit2, Trash2, User, Search as SearchIcon, Phone } from "lucide-react";

const mockUsers = [
  { id: 1, name: 'Ola Nordmann', email: 'ola@drammenif.no', phone: '98765432', organization: 'Drammen IF', role: 'Leder', status: 'Aktiv' },
  { id: 2, name: 'Kari Hansen', email: 'kari@åssiden.no', phone: '87654321', organization: 'Åssiden IF', role: 'Kontakt', status: 'Aktiv' },
  { id: 3, name: 'Per Olsen', email: 'per@drammensv.no', phone: '76543210', organization: 'Drammen SV', role: 'Ansvarlig', status: 'Inaktiv' },
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.organization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Brukere & Organisasjoner"
                description="Administrer tilgang og roller for brukere i paraplysystemet."
                actions={
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Legg til bruker
                    </Button>
                }
            />
            
            <Card>
                <CardHeader>
                    <CardTitle>Alle brukere</CardTitle>
                    <CardDescription>Oversikt over alle registrerte brukere og deres organisasjoner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <Input
                            placeholder="Søk etter navn, e-post eller organisasjon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                        <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrer etter rolle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle roller</SelectItem>
                                <SelectItem value="Leder">Leder</SelectItem>
                                <SelectItem value="Kontakt">Kontakt</SelectItem>
                                <SelectItem value="Ansvarlig">Ansvarlig</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrer etter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle statuser</SelectItem>
                                <SelectItem value="Aktiv">Aktiv</SelectItem>
                                <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map(user => (
                            <Card key={user.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={`https://i.pravatar.cc/150?img=${user.id}`} />
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{user.name}</CardTitle>
                                            <p className="text-sm text-gray-600">{user.organization}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <SearchIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{user.role}</Badge>
                                            <Badge variant={user.status === 'Aktiv' ? 'default' : 'secondary'}>
                                                {user.status}
                                            </Badge>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button variant="ghost" size="sm">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default UsersPage;
