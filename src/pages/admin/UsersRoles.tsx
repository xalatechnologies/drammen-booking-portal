
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Edit2, Trash2, Shield, User, Users, Search as SearchIcon, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const UsersRolesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [activeTab, setActiveTab] = useState("users");

  const { tSync } = useTranslation();

  // Mock data for now since UserService.getUsers doesn't exist
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '12345678', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '87654321', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '11223344', role: 'user' }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddNew = () => {
    alert("Add New User");
  };

  const handleEdit = (user: any) => {
    alert(`Edit User: ${user.name}`);
  };

  const handleDelete = (user: any) => {
    if (window.confirm(`Delete User: ${user.name}?`)) {
      alert(`Delete User: ${user.name}`);
    }
  };

  const roleOptions = [
    { value: 'all', label: tSync("admin.usersRoles.filters.allRoles", "All Roles") },
    { value: 'admin', label: tSync("admin.usersRoles.filters.admin", "Admin") },
    { value: 'user', label: tSync("admin.usersRoles.filters.user", "User") }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={tSync("admin.usersRoles.management", "Users & Roles Management")}
        description={tSync("admin.usersRoles.pageDescription", "Manage user accounts, roles, and permissions")}
        actions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tSync("admin.usersRoles.addNew", "Add New User")}
          </Button>
        }
      />

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="bg-muted rounded-md p-1 w-full flex justify-start">
          <TabsTrigger value="users" onClick={() => setActiveTab("users")} className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">{tSync("admin.usersRoles.tabs.users", "Users")}</TabsTrigger>
          <TabsTrigger value="roles" onClick={() => setActiveTab("roles")} className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">{tSync("admin.usersRoles.tabs.roles", "Roles")}</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.usersRoles.users.title", "Users")}</CardTitle>
              <CardDescription>{tSync("admin.usersRoles.users.description", "Manage existing user accounts")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    type="search"
                    placeholder={tSync("admin.usersRoles.search.placeholder", "Search users...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={tSync("admin.usersRoles.filters.role", "Filter by role")} />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(role => (
                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <Card key={user.id} className="bg-white shadow-md rounded-md">
                      <CardHeader>
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${user.id}`} alt={user.name} />
                            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center"><SearchIcon className="w-4 h-4 mr-1" />{user.email}</p>
                        <p className="flex items-center"><Phone className="w-4 h-4 mr-1" />{user.phone || 'N/A'}</p>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          <Badge variant="secondary">{user.role}</Badge>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>{tSync("admin.usersRoles.search.noResults", "No users found matching your criteria.")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.usersRoles.roles.title", "Roles")}</CardTitle>
              <CardDescription>{tSync("admin.usersRoles.roles.description", "Manage user roles and permissions")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{tSync("admin.usersRoles.roles.content", "Role management content goes here.")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersRolesPage;
