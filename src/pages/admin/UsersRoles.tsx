
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UsersRolesPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Users & Roles</h2>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User and role management content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersRolesPage;
