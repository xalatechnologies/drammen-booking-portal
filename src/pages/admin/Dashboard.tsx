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
import BookingsOverview from "@/pages/admin/BookingsOverview";
import ExternalCalendars from "@/pages/admin/ExternalCalendars";
import MessageTemplates from "@/pages/admin/MessageTemplates";
import AuthProvidersPage from "@/pages/admin/AuthProvidersPage";
import ExchangeIntegrationPage from "@/pages/admin/ExchangeIntegrationPage";
import IntegrationsPage from "@/pages/admin/IntegrationsPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import DataRetentionPage from "@/pages/admin/DataRetentionPage";
import AzureDeployPage from "@/pages/admin/AzureDeployPage";
import MonitoringPage from "@/pages/admin/MonitoringPage";
import SupportTicketsPage from "@/pages/admin/SupportTickets";
import SupportTicketDetail from "@/pages/admin/SupportTicketDetail";
import SystemConfiguration from "@/pages/admin/SystemConfiguration";
import SLAConfiguration from "@/pages/admin/SLAConfiguration";
import LockConfiguration from "@/pages/admin/LockConfiguration";

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
        <Route path="/bookings-overview" element={<BookingsOverview />} />
        <Route path="/approvals" element={<ApprovalWorkflowsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/users" element={<UsersRolesPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/role-assignments" element={<RoleAssignmentsPage />} />
        <Route path="/external-calendars" element={<ExternalCalendars />} />
        <Route path="/message-templates" element={<MessageTemplates />} />
        <Route path="/auth-providers" element={<AuthProvidersPage />} />
        <Route path="/exchange-integration" element={<ExchangeIntegrationPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/data-retention" element={<DataRetentionPage />} />
        <Route path="/azure-deploy" element={<AzureDeployPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/support-tickets" element={<SupportTicketsPage />} />
        <Route path="/support-tickets/:ticketId" element={<SupportTicketDetail />} />
        <Route path="/system-config" element={<SystemConfiguration />} />
        <Route path="/sla-config" element={<SLAConfiguration />} />
        <Route path="/lock-config" element={<LockConfiguration />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
