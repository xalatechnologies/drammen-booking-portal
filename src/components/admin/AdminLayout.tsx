
import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-navy-50 via-white to-purple-50">
        <AdminHeader />
        <div className="flex flex-1 w-full overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8 transition-all duration-200 ease-linear peer-data-[state=collapsed]:pl-8 peer-data-[state=expanded]:pl-10">
              <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
