import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import OverviewPage from "@/pages/admin/Overview";
import FacilityManagementPage from "@/pages/admin/FacilityManagement";
import ApprovalWorkflowsPage from "@/pages/admin/ApprovalWorkflows";
import RequestsPage from "@/pages/admin/Requests";
import UsersRolesPage from "@/pages/admin/UsersRoles"; 
import ReportsAnalyticsPage from "@/pages/admin/ReportsAnalytics";
import NotificationsPage from "@/pages/admin/Notifications";
import ProfileSettingsPage from "@/pages/admin/ProfileSettings";
import NotFound from "@/pages/NotFound";
import RolesPage from "./Roles";
import RoleAssignmentsPage from "./RoleAssignments";

const AdminDashboard = () => {
  const location = useLocation();
  
  // If we're at the exact /admin path, show the overview
  if (location.pathname === "/admin") {
    return (
      <AdminLayout>
        <OverviewPage />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/facilities" element={<FacilityManagementPage />} />
        <Route path="/approvals" element={<ApprovalWorkflowsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/users" element={<UsersRolesPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/role-assignments" element={<RoleAssignmentsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
