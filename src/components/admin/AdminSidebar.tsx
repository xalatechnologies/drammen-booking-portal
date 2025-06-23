import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Building, Settings, Users, UserCheck, BarChart3, Bell, User, Shield, FileText, HelpCircle, Wrench, Activity, Cloud, Lock, Clock, Database, FileSearch, Globe, MessageSquare, Zap } from "lucide-react";
import { useJsonTranslation } from "@/hooks/useJsonTranslation";
import { LAYOUT_CONSTANTS } from "@/components/layouts/constants";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { tSync } = useJsonTranslation();

  const menuItems = [{
    title: tSync("admin.sidebar.overview"),
    href: "/admin",
    icon: LayoutDashboard,
    description: tSync("admin.sidebar.descriptions.overview")
  }, {
    title: tSync("admin.sidebar.facilities"),
    href: "/admin/facilities",
    icon: Building,
    description: tSync("admin.sidebar.descriptions.facilities")
  }, {
    title: tSync("admin.sidebar.bookings"),
    href: "/admin/bookings-overview",
    icon: Calendar,
    description: tSync("admin.sidebar.descriptions.bookings")
  }, {
    title: tSync("admin.sidebar.usersRoles"),
    href: "/admin/users",
    icon: Users,
    description: tSync("admin.sidebar.descriptions.usersRoles")
  }, {
    title: tSync("admin.sidebar.approvalWorkflows"),
    href: "/admin/approvals",
    icon: UserCheck,
    description: tSync("admin.sidebar.descriptions.approvalWorkflows")
  }, {
    title: tSync("admin.sidebar.roles"),
    href: "/admin/roles",
    icon: Shield,
    description: tSync("admin.sidebar.descriptions.roles")
  }, {
    title: tSync("admin.sidebar.reportsAnalytics"),
    href: "/admin/reports",
    icon: BarChart3,
    description: tSync("admin.sidebar.descriptions.reportsAnalytics")
  }, {
    title: tSync("admin.sidebar.notifications"),
    href: "/admin/notifications",
    icon: Bell,
    description: tSync("admin.sidebar.descriptions.notifications")
  }, {
    title: tSync("admin.sidebar.profileSettings"),
    href: "/admin/profile",
    icon: User,
    description: tSync("admin.sidebar.descriptions.profileSettings")
  }, {
    title: tSync("admin.sidebar.systemConfig"),
    href: "/admin/system-config",
    icon: Settings,
    description: tSync("admin.sidebar.descriptions.systemConfig")
  }, {
    title: tSync("admin.sidebar.externalCalendars"),
    href: "/admin/external-calendars",
    icon: Globe,
    description: tSync("admin.sidebar.descriptions.externalCalendars")
  }, {
    title: tSync("admin.sidebar.messageTemplates"),
    href: "/admin/message-templates",
    icon: MessageSquare,
    description: tSync("admin.sidebar.descriptions.messageTemplates")
  }, {
    title: tSync("admin.sidebar.authProviders"),
    href: "/admin/auth-providers",
    icon: Shield,
    description: tSync("admin.sidebar.descriptions.authProviders")
  }, {
    title: tSync("admin.sidebar.supportTickets"),
    href: "/admin/support-tickets",
    icon: HelpCircle,
    description: tSync("admin.sidebar.descriptions.supportTickets")
  }, {
    title: tSync("admin.sidebar.slaConfig"),
    href: "/admin/sla-config",
    icon: Clock,
    description: tSync("admin.sidebar.descriptions.slaConfig")
  }, {
    title: tSync("admin.sidebar.lockConfig"),
    href: "/admin/lock-config",
    icon: Lock,
    description: tSync("admin.sidebar.descriptions.lockConfig")
  }, {
    title: tSync("admin.sidebar.monitoring"),
    href: "/admin/monitoring",
    icon: Activity,
    description: tSync("admin.sidebar.descriptions.monitoring")
  }, {
    title: tSync("admin.sidebar.integrations"),
    href: "/admin/integrations",
    icon: Zap,
    description: tSync("admin.sidebar.descriptions.integrations")
  }, {
    title: tSync("admin.sidebar.exchangeIntegration"),
    href: "/admin/exchange-integration",
    icon: Cloud,
    description: tSync("admin.sidebar.descriptions.exchangeIntegration")
  }, {
    title: tSync("admin.sidebar.auditLogs"),
    href: "/admin/audit-logs",
    icon: FileSearch,
    description: tSync("admin.sidebar.descriptions.auditLogs")
  }, {
    title: tSync("admin.sidebar.dataRetention"),
    href: "/admin/data-retention",
    icon: Database,
    description: tSync("admin.sidebar.descriptions.dataRetention")
  }, {
    title: tSync("admin.sidebar.azureDeploy"),
    href: "/admin/azure-deploy",
    icon: Cloud,
    description: tSync("admin.sidebar.descriptions.azureDeploy")
  }];
  
  return (
    <div className="fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 overflow-y-auto" style={{ width: LAYOUT_CONSTANTS.SIDEBAR_WIDTH }}>
      <div className="flex flex-col h-full">
        <nav className="flex-1 p-6 py-[100px] px-[18px] mx-0">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center p-4 rounded-lg transition-colors duration-200 group",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
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
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
