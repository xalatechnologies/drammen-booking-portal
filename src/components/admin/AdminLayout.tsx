
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
      <div className="min-h-screen flex flex-col w-full gradient-surface">
        <AdminHeader />
        <div className="flex flex-1 w-full overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-spacing-xl transition-all duration-200 ease-linear">
              <div className="max-w-7xl mx-auto space-y-spacing-xl">
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
