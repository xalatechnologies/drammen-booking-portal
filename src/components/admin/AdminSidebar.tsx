import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Building, Settings, Users, UserCheck, BarChart3, Bell, User, Shield, FileText, HelpCircle, Wrench, Activity, Cloud, Lock, Clock, Database, FileSearch, Globe, MessageSquare, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const {
    tSync
  } = useTranslation();
  const menuItems = [{
    title: tSync("admin.sidebar.overview", "Overview"),
    href: "/admin",
    icon: LayoutDashboard,
    description: tSync("admin.sidebar.descriptions.overview", "Dashboard og oversikt")
  }, {
    title: tSync("admin.sidebar.facilities", "Facilities"),
    href: "/admin/facilities",
    icon: Building,
    description: tSync("admin.sidebar.descriptions.facilities", "Administrer fasiliteter")
  }, {
    title: tSync("admin.sidebar.bookings", "Bookings"),
    href: "/admin/bookings",
    icon: Calendar,
    description: tSync("admin.sidebar.descriptions.bookings", "Booking oversikt")
  }, {
    title: tSync("admin.sidebar.usersRoles", "Users & Roles"),
    href: "/admin/users-roles",
    icon: Users,
    description: tSync("admin.sidebar.descriptions.usersRoles", "Bruker- og rollestyring")
  }, {
    title: tSync("admin.sidebar.approvalWorkflows", "Approval Workflows"),
    href: "/admin/approval-workflows",
    icon: UserCheck,
    description: tSync("admin.sidebar.descriptions.approvalWorkflows", "Godkjenningsprosesser")
  }, {
    title: tSync("admin.sidebar.roleAssignments", "Role Assignments"),
    href: "/admin/role-assignments",
    icon: Shield,
    description: tSync("admin.sidebar.descriptions.roleAssignments", "Rolletildelinger")
  }, {
    title: tSync("admin.sidebar.reportsAnalytics", "Reports & Analytics"),
    href: "/admin/reports-analytics",
    icon: BarChart3,
    description: tSync("admin.sidebar.descriptions.reportsAnalytics", "Rapporter og analyser")
  }, {
    title: tSync("admin.sidebar.notifications", "Notifications"),
    href: "/admin/notifications",
    icon: Bell,
    description: tSync("admin.sidebar.descriptions.notifications", "Varslingsinnstillinger")
  }, {
    title: tSync("admin.sidebar.profileSettings", "Profile Settings"),
    href: "/admin/profile-settings",
    icon: User,
    description: tSync("admin.sidebar.descriptions.profileSettings", "Profilinnstillinger")
  }, {
    title: tSync("admin.sidebar.systemConfig", "System Config"),
    href: "/admin/system-config",
    icon: Settings,
    description: tSync("admin.sidebar.descriptions.systemConfig", "Systemkonfigurasjon")
  }, {
    title: tSync("admin.sidebar.externalCalendars", "External Calendars"),
    href: "/admin/external-calendars",
    icon: Globe,
    description: tSync("admin.sidebar.descriptions.externalCalendars", "Eksterne kalendere")
  }, {
    title: tSync("admin.sidebar.messageTemplates", "Message Templates"),
    href: "/admin/message-templates",
    icon: MessageSquare,
    description: tSync("admin.sidebar.descriptions.messageTemplates", "Meldingsmaler")
  }, {
    title: tSync("admin.sidebar.authProviders", "Auth Providers"),
    href: "/admin/auth-providers",
    icon: Shield,
    description: tSync("admin.sidebar.descriptions.authProviders", "Autentiseringsleverandører")
  }, {
    title: tSync("admin.sidebar.supportTickets", "Support Tickets"),
    href: "/admin/support-tickets",
    icon: HelpCircle,
    description: tSync("admin.sidebar.descriptions.supportTickets", "Brukerstøtte")
  }, {
    title: tSync("admin.sidebar.slaConfig", "SLA Configuration"),
    href: "/admin/sla-config",
    icon: Clock,
    description: tSync("admin.sidebar.descriptions.slaConfig", "Tjenestenivåavtaler")
  }, {
    title: tSync("admin.sidebar.lockConfig", "Lock Configuration"),
    href: "/admin/lock-config",
    icon: Lock,
    description: tSync("admin.sidebar.descriptions.lockConfig", "Låsekonfigurasjon")
  }, {
    title: tSync("admin.sidebar.monitoring", "Monitoring"),
    href: "/admin/monitoring",
    icon: Activity,
    description: tSync("admin.sidebar.descriptions.monitoring", "Systemovervåking")
  }, {
    title: tSync("admin.sidebar.integrations", "Integrations"),
    href: "/admin/integrations",
    icon: Zap,
    description: tSync("admin.sidebar.descriptions.integrations", "Tredjepartsintegrasjoner")
  }, {
    title: tSync("admin.sidebar.exchangeIntegration", "Exchange Integration"),
    href: "/admin/exchange-integration",
    icon: Cloud,
    description: tSync("admin.sidebar.descriptions.exchangeIntegration", "Exchange-integrasjon")
  }, {
    title: tSync("admin.sidebar.auditLogs", "Audit Logs"),
    href: "/admin/audit-logs",
    icon: FileSearch,
    description: tSync("admin.sidebar.descriptions.auditLogs", "Revisjonslogger")
  }, {
    title: tSync("admin.sidebar.dataRetention", "Data Retention"),
    href: "/admin/data-retention",
    icon: Database,
    description: tSync("admin.sidebar.descriptions.dataRetention", "Datalagring & anonymisering")
  }, {
    title: tSync("admin.sidebar.azureDeploy", "Azure/Deploy"),
    href: "/admin/azure-deploy",
    icon: Cloud,
    description: tSync("admin.sidebar.descriptions.azureDeploy", "Azure og deployment")
  }];
  return <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Header */}
        

        {/* Navigation */}
        <nav className="flex-1 p-6 py-[100px]">
          <ul className="space-y-3">
            {menuItems.map(item => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return <li key={item.href}>
                  <Link to={item.href} className={cn("flex items-center p-4 rounded-lg transition-colors duration-200 group", isActive ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900")}>
                    <Icon className="w-6 h-6 mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium truncate">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </li>;
          })}
          </ul>
        </nav>
      </div>
    </div>;
};
export default AdminSidebar;