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
import RolesPage from "./Roles";
import BookingsOverview from "@/pages/admin/BookingsOverview";
import ExternalCalendars from "@/pages/admin/ExternalCalendars";
import MessageTemplates from "@/pages/admin/MessageTemplates";
import AuthProvidersPage from "@/pages/admin/AuthProvidersPage";
import SupportTicketsPage from "@/pages/admin/SupportTickets";
import SupportTicketDetail from "@/pages/admin/SupportTicketDetail";
import SystemConfiguration from "@/pages/admin/SystemConfiguration";
import SLAConfiguration from "@/pages/admin/SLAConfiguration";
import LockConfiguration from "@/pages/admin/LockConfiguration";
import MonitoringPage from "./MonitoringPage";
import IntegrationsPage from "./IntegrationsPage";
import ExchangeIntegrationPage from "./ExchangeIntegrationPage";
import AuditLogsPage from "./AuditLogsPage";
import DataRetentionPage from "./DataRetentionPage";
import AzureDeployPage from "./AzureDeployPage";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="facilities" element={<FacilityManagementPage />} />
        <Route path="bookings-overview" element={<BookingsOverview />} />
        <Route path="approvals" element={<ApprovalWorkflowsPage />} />
        <Route path="users" element={<UsersRolesPage />} />
        <Route path="reports" element={<ReportsAnalyticsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfileSettingsPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="external-calendars" element={<ExternalCalendars />} />
        <Route path="message-templates" element={<MessageTemplates />} />
        <Route path="auth-providers" element={<AuthProvidersPage />} />
        <Route path="support-tickets" element={<SupportTicketsPage />} />
        <Route path="support-tickets/:ticketId" element={<SupportTicketDetail />} />
        <Route path="system-config" element={<SystemConfiguration />} />
        <Route path="sla-config" element={<SLAConfiguration />} />
        <Route path="lock-config" element={<LockConfiguration />} />

        {/* Superadmin Routes */}
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="integrations/exchange" element={<ExchangeIntegrationPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="data-retention" element={<DataRetentionPage />} />
        <Route path="azure-deploy" element={<AzureDeployPage />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
