
import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { DashboardLayout } from "@/components/layouts";
import { AdminRoleProvider } from "@/contexts/AdminRoleContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AdminRoleProvider>
      <DashboardLayout
        header={<AdminHeader />}
        sidebar={<AdminSidebar />}
      >
        {children}
      </DashboardLayout>
    </AdminRoleProvider>
  );
};

export default AdminLayout;
