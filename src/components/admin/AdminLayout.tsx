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
      <div className="min-h-screen w-full bg-gray-50">
        {/* Header at the top */}
        <div className="fixed top-0 left-0 w-full z-50">
          <AdminHeader />
        </div>
        {/* Sidebar under header - fixed on desktop, static on mobile */}
        <div className="pt-[4rem] hidden md:fixed md:left-0 md:z-40 md:h-[calc(100vh-4rem)] md:block" style={{ width: '20rem' }}>
          <AdminSidebar />
        </div>
        {/* Main Content - full width on mobile, margin on desktop */}
        <main className="flex-1 pt-[4rem] md:ml-[20rem] overflow-auto">
          <div className="p-2 sm:p-4 md:p-6 transition-all duration-200 ease-linear peer-data-[state=collapsed]:pl-6 peer-data-[state=expanded]:pl-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
