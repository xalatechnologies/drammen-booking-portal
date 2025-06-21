
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdminRole, AdminRole } from "@/contexts/AdminRoleContext";
import { useTranslation } from "@/hooks/useTranslation";

const AdminUserProfile = () => {
  const { currentRole } = useAdminRole();
  const { tSync } = useTranslation();

  const roleNames: Record<AdminRole, string> = {
    systemadmin: tSync('admin.roles.systemadmin', 'System Admin'),
    admin: tSync('admin.roles.admin', 'Admin'),
    saksbehandler: tSync('admin.roles.saksbehandler', 'Saksbehandler')
  };

  const roleAvatars: Record<AdminRole, { src: string; fallback: string }> = {
    systemadmin: {
      src: 'https://i.pravatar.cc/150?u=system-admin',
      fallback: 'SA'
    },
    admin: {
      src: 'https://i.pravatar.cc/150?u=admin',
      fallback: 'A'
    },
    saksbehandler: {
      src: 'https://i.pravatar.cc/150?u=saksbehandler',
      fallback: 'SB'
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-11 gap-3 px-3 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg" 
          aria-label={tSync("admin.header.userProfile", "Brukerprofil og innstillinger")}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={roleAvatars[currentRole].src} alt={roleNames[currentRole]} />
            <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
              {roleAvatars[currentRole].fallback}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{roleNames[currentRole]}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
        <DropdownMenuLabel className="text-sm font-medium">
          {tSync("admin.header.myAccount", "Min Konto")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50">
          {tSync("admin.header.profile", "Profil")}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50">
          {tSync("admin.header.settings", "Innstillinger")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm py-2 hover:bg-gray-50 text-red-600">
          {tSync("admin.header.logout", "Logg ut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminUserProfile;
