
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import OverviewPage from "@/pages/admin/Overview";
import FacilityManagementPage from "@/pages/admin/FacilityManagement";
import ApprovalWorkflowsPage from "@/pages/admin/ApprovalWorkflows";
import UsersRolesPage from "@/pages/admin/UsersRoles"; 
import ReportsAnalyticsPage from "@/pages/admin/ReportsAnalytics";
import NotificationsPage from "@/pages/admin/Notifications";
import ProfileSettingsPage from "@/pages/admin/ProfileSettings";
import NotFound from "@/pages/NotFound";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/facilities" element={<FacilityManagementPage />} />
        <Route path="/approvals" element={<ApprovalWorkflowsPage />} />
        <Route path="/users" element={<UsersRolesPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
