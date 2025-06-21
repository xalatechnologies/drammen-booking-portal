import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Edit2, Trash2, Shield, User, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const RoleAssignments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { tSync } = useTranslation();

  const mockRoleAssignments = [
    {
      id: 1,
      user: {
        id: 101,
        name: "Thomas Hansen",
        email: "thomas.hansen@example.com",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      role: "admin",
      status: "active",
    },
    {
      id: 2,
      user: {
        id: 102,
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      role: "editor",
      status: "inactive",
    },
    {
      id: 3,
      user: {
        id: 103,
        name: "Ahmed Khan",
        email: "ahmed.khan@example.com",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      role: "viewer",
      status: "active",
    },
  ];

  const filteredAssignments = mockRoleAssignments.filter((assignment) => {
    const searchMatch =
      assignment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = filterRole === "all" || assignment.role === filterRole;
    return searchMatch && roleMatch;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortOrder === "name") {
      return a.user.name.localeCompare(b.user.name);
    } else if (sortOrder === "role") {
      return a.role.localeCompare(b.role);
    }
    return 0;
  });

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveAssignment = (user, newRole) => {
    console.log(`Saving role ${newRole} for user ${user.name}`);
    handleCloseModal();
  };

  return (
    <div>
      <PageHeader
        title={tSync("admin.roleAssignments.title", "Role Assignments")}
        description={tSync(
          "admin.roleAssignments.description",
          "Manage roles and permissions for users"
        )}
        actions={
          <Button onClick={() => {}} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tSync("admin.roleAssignments.addNew", "Add New Assignment")}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{tSync("admin.roleAssignments.list", "List of Assignments")}</CardTitle>
          <CardDescription>
            {tSync(
              "admin.roleAssignments.viewAndManage",
              "View, manage, and assign roles to users."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={tSync(
                  "admin.roleAssignments.searchPlaceholder",
                  "Search users..."
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={tSync("admin.roleAssignments.filterRole", "Filter by role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tSync("admin.roleAssignments.allRoles", "All Roles")}</SelectItem>
                <SelectItem value="admin">{tSync("admin.roles.admin", "Admin")}</SelectItem>
                <SelectItem value="editor">{tSync("admin.roles.editor", "Editor")}</SelectItem>
                <SelectItem value="viewer">{tSync("admin.roles.viewer", "Viewer")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={tSync("admin.roleAssignments.sortBy", "Sort by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{tSync("admin.roleAssignments.sortByName", "Name")}</SelectItem>
                <SelectItem value="role">{tSync("admin.roleAssignments.sortByRole", "Role")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tSync("admin.roleAssignments.user", "User")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tSync("admin.roleAssignments.role", "Role")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tSync("admin.roleAssignments.status", "Status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tSync("admin.roleAssignments.actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar>
                            <AvatarImage src={assignment.user.avatar} alt={assignment.user.name} />
                            <AvatarFallback>{assignment.user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.user.name}
                          </div>
                          <div className="text-sm text-gray-500">{assignment.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{assignment.role}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={assignment.status === "active" ? "default" : "destructive"}>
                        {assignment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(assignment.user)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <User className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {tSync("admin.roleAssignments.editRole", "Edit Role Assignment")}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {tSync(
                          "admin.roleAssignments.changeRoleFor",
                          "Change the role for the selected user."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => handleSaveAssignment(selectedUser, "newRole")}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {tSync("admin.roleAssignments.save", "Save")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {tSync("admin.roleAssignments.cancel", "Cancel")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignments;
