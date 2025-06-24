
import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdminRole, AdminRole } from "@/contexts/AdminRoleContext";
import { useTranslation } from "@/hooks/useTranslation";

const AdminRoleSwitcher = () => {
  const { currentRole, setCurrentRole, availableRoles } = useAdminRole();
  const { tSync } = useTranslation();

  const roleNames: Record<AdminRole, string> = {
    systemadmin: tSync('admin.roles.systemadmin', 'System Admin'),
    admin: tSync('admin.roles.admin', 'Admin'),
    saksbehandler: tSync('admin.roles.saksbehandler', 'Saksbehandler')
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 px-4 text-sm font-medium">
          {roleNames[currentRole]}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {tSync("admin.header.switchRole", "Bytt visningsrolle")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map(role => (
          <DropdownMenuItem key={role} onSelect={() => setCurrentRole(role)}>
            {roleNames[role]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminRoleSwitcher;
