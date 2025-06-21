
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Building,
  Settings,
  Users,
  UserCheck,
  BarChart3,
  Bell,
  User,
  Shield,
  FileText,
  HelpCircle,
  Wrench,
  Activity,
  Cloud,
  Lock,
  Clock,
  Database,
  FileSearch,
  Globe,
  MessageSquare,
  Zap
} from "lucide-react";

const menuItems = [
  { 
    title: "Overview", 
    href: "/admin", 
    icon: LayoutDashboard,
    description: "Dashboard og oversikt"
  },
  { 
    title: "Facilities", 
    href: "/admin/facilities", 
    icon: Building,
    description: "Administrer fasiliteter"
  },
  { 
    title: "Bookings", 
    href: "/admin/bookings", 
    icon: Calendar,
    description: "Booking oversikt"
  },
  { 
    title: "Users & Roles", 
    href: "/admin/users-roles", 
    icon: Users,
    description: "Bruker- og rollestyring"
  },
  { 
    title: "Approval Workflows", 
    href: "/admin/approval-workflows", 
    icon: UserCheck,
    description: "Godkjenningsprosesser"
  },
  { 
    title: "Role Assignments", 
    href: "/admin/role-assignments", 
    icon: Shield,
    description: "Rolletildelinger"
  },
  { 
    title: "Reports & Analytics", 
    href: "/admin/reports-analytics", 
    icon: BarChart3,
    description: "Rapporter og analyser"
  },
  { 
    title: "Notifications", 
    href: "/admin/notifications", 
    icon: Bell,
    description: "Varslingsinnstillinger"
  },
  { 
    title: "Profile Settings", 
    href: "/admin/profile-settings", 
    icon: User,
    description: "Profilinnstillinger"
  },
  { 
    title: "System Config", 
    href: "/admin/system-config", 
    icon: Settings,
    description: "Systemkonfigurasjon"
  },
  { 
    title: "External Calendars", 
    href: "/admin/external-calendars", 
    icon: Globe,
    description: "Eksterne kalendere"
  },
  { 
    title: "Message Templates", 
    href: "/admin/message-templates", 
    icon: MessageSquare,
    description: "Meldingsmaler"
  },
  { 
    title: "Auth Providers", 
    href: "/admin/auth-providers", 
    icon: Shield,
    description: "Autentiseringsleverandører"
  },
  { 
    title: "Support Tickets", 
    href: "/admin/support-tickets", 
    icon: HelpCircle,
    description: "Brukerstøtte"
  },
  { 
    title: "SLA Configuration", 
    href: "/admin/sla-config", 
    icon: Clock,
    description: "Tjenestenivåavtaler"
  },
  { 
    title: "Lock Configuration", 
    href: "/admin/lock-config", 
    icon: Lock,
    description: "Låsekonfigurasjon"
  },
  { 
    title: "Monitoring", 
    href: "/admin/monitoring", 
    icon: Activity,
    description: "Systemovervåking"
  },
  { 
    title: "Integrations", 
    href: "/admin/integrations", 
    icon: Zap,
    description: "Tredjepartsintegrasjoner"
  },
  { 
    title: "Exchange Integration", 
    href: "/admin/exchange-integration", 
    icon: Cloud,
    description: "Exchange-integrasjon"
  },
  { 
    title: "Audit Logs", 
    href: "/admin/audit-logs", 
    icon: FileSearch,
    description: "Revisjonslogger"
  },
  { 
    title: "Data Retention", 
    href: "/admin/data-retention", 
    icon: Database,
    description: "Datalagring & anonymisering"
  },
  { 
    title: "Azure/Deploy", 
    href: "/admin/azure-deploy", 
    icon: Cloud,
    description: "Azure og deployment"
  },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-base text-gray-600 mt-2">System Administration</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
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
