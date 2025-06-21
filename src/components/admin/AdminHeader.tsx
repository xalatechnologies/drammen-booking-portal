
import React from "react";
import Logo from "@/components/header/Logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AdminSearchBar from "./header/AdminSearchBar";
import AdminRoleSwitcher from "./header/AdminRoleSwitcher";
import AdminLanguageToggle from "./header/AdminLanguageToggle";
import AdminNotifications from "./header/AdminNotifications";
import AdminUserProfile from "./header/AdminUserProfile";

const AdminHeader = () => {
  return (
    <header className="border-b bg-white shadow-sm z-50" style={{ height: "5rem" }}>
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="md:hidden mr-2">
            <SidebarTrigger />
          </div>
          <Logo />
        </div>
        
        <AdminSearchBar />

        <div className="flex items-center gap-3 flex-shrink-0">
          <AdminRoleSwitcher />
          <AdminLanguageToggle />
          <AdminNotifications />
          <AdminUserProfile />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
