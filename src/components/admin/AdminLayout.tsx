
import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
            <div className="p-6">
              <div className="mb-4">
                <SidebarTrigger className="focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md" />
              </div>
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
