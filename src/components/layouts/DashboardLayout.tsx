
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayoutProps } from "./types";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  header,
  sidebar,
  children
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Header at the top */}
        <div className="fixed top-0 left-0 w-full z-50">
          {header}
        </div>
        
        {/* Sidebar under header - fixed on desktop, static on mobile */}
        <div className="pt-[5rem] hidden md:fixed md:left-0 md:z-40 md:h-[calc(100vh-5rem)] md:block" style={{ width: '20rem' }}>
          {sidebar}
        </div>
        
        {/* Main Content - full width on mobile, margin on desktop */}
        <main className="flex-1 pt-[5rem] md:ml-[20rem] overflow-auto min-h-screen">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
