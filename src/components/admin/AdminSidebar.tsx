import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bell,
  Activity,
  BarChart3,
  Building,
  ClipboardList,
  Languages,
  ChevronRight,
  Calendar,
  MessageSquare,
  Shield
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Mock for innlogget bruker
const currentUser = { name: "Admin Bruker", role: "systemadmin" }; // Bytt til 'systemadmin' eller 'superadmin' for full tilgang

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const overviewItems = [
    {
      title: "Dashboard",
      path: "/admin",
    },
  ];

  const bookingItems = [
    {
      title: "Bookingoversikt",
      path: "/admin/bookings-overview",
    },
    {
      title: "Lokaler",
      path: "/admin/facilities",
    },
    {
      title: "Forespørsler",
      path: "/admin/approvals",
    },
  ];

  const managementItems = [
    {
      title: "Brukere & Roller",
      path: "/admin/users",
    },
    {
      title: "Rapporter & Analytikk",
      path: "/admin/reports",
    },
    {
      title: "Support",
      path: "/admin/support-tickets",
    },
    {
      title: "SLA Konfigurasjon",
      path: "/admin/sla-config",
    },
    {
      title: "Varsler",
      path: "/admin/notifications",
    },
    {
      title: "Meldingsmaler",
      path: "/admin/message-templates",
    },
    {
      title: "Systemkonfigurasjon",
      path: "/admin/system-config",
    },
    {
      title: "Eksterne kalendere",
      path: "/admin/external-calendars",
    },
    ...( ["systemadmin", "superadmin"].includes(currentUser.role) ? [
      {
        title: "Roller & Tildelinger",
        path: "/admin/roles",
      },
    ] : [] ),
  ];

  const systemItems = [
    {
      title: "Autentisering",
      path: "/admin/auth-providers",
    },
    {
      title: "Exchange-integrasjon",
      path: "/admin/exchange-integration",
    },
    {
      title: "Integrasjoner",
      path: "/admin/integrations",
    },
    {
      title: "Låssystemer",
      path: "/admin/lock-config",
    },
    ...( ["systemadmin", "superadmin"].includes(currentUser.role) ? [
      {
        title: "Revisjonslogger",
        path: "/admin/audit-logs",
      },
      {
        title: "Datalagring & anonymisering",
        path: "/admin/data-retention",
      },
      {
        title: "Azure & Deploy",
        path: "/admin/azure-deploy",
      },
      {
        title: "Overvåkning",
        path: "/admin/monitoring",
      },
    ] : [] ),
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") {
      return true;
    }
    return currentPath.startsWith(path) && path !== "/admin";
  };

  const renderMenuGroup = (items: any[], groupLabel: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 leading-5">
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
                className={`
                  group relative flex items-center justify-between w-full text-[15px] font-medium rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
                  ${isActive(item.path) 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 shadow-lg shadow-blue-100/50 border-l-[3px] border-blue-600 px-6 py-5' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:shadow-slate-200/50 hover:scale-[1.02] px-3 py-3.5'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
                  active:scale-[0.98]
                  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2
                `}
              >
                <span className="truncate font-medium leading-5 group-data-[collapsible=icon]:hidden">{item.title}</span>
                <ChevronRight className={`
                  h-4 w-4 transition-all duration-300 transform group-data-[collapsible=icon]:hidden
                  ${isActive(item.path) 
                    ? 'text-blue-600 opacity-100 translate-x-0' 
                    : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                  }
                `} strokeWidth={2.5} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar 
      className="border-r border-slate-200/60 bg-white shadow-xl shadow-slate-200/20 mt-4" 
      style={{ ...( { ['--sidebar-width']: '20rem' } as any ) }}
      collapsible="icon"
    >
      <SidebarContent className="px-4 pt-8 sm:pt-16 pb-10 space-y-4 overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {renderMenuGroup(overviewItems, "OVERSIKT")}
        {renderMenuGroup(bookingItems, "BOOKING")}
        {renderMenuGroup(managementItems, "ADMINISTRASJON")}
        {renderMenuGroup(systemItems, "SYSTEM")}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
