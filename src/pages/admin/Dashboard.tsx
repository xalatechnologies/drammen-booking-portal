import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
  // Get the current path to determine if we need to redirect
  const currentPath = window.location.pathname;
  
  // If we're at /admin with nothing after it, we want to show the overview
  // Otherwise, we continue with the normal routing
  if (currentPath === "/admin") {
    return (
      <AdminLayout>
        <OverviewPage />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/facilities" element={<FacilityManagementPage />} />
        <Route path="/approvals" element={<ApprovalWorkflowsPage />} />
        <Route path="/users" element={<UsersRolesPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
