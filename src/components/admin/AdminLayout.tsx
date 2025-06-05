
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
      <div className="min-h-screen flex flex-col w-full bg-gray-50">
        <AdminHeader />
        <div className="flex flex-1 w-full overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 transition-all duration-200 ease-linear peer-data-[state=collapsed]:ml-0 peer-data-[state=expanded]:ml-6">
              <div className="max-w-6xl mx-auto space-y-6">
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
