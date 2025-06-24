import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "@/components/user/UserSidebar";
import UserHeader from "@/components/user/UserHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

const UserLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="fixed top-0 left-0 w-full z-50">
          <UserHeader />
        </div>
        <div className="pt-[4rem] hidden md:fixed md:left-0 md:z-40 md:h-[calc(100vh-4rem)] md:block" style={{ width: '20rem' }}>
          <UserSidebar />
        </div>
        <main className="flex-1 pt-[4rem] md:ml-[20rem] overflow-auto">
          <div className="p-2 sm:p-4 md:p-6 transition-all duration-200 ease-linear">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout; 