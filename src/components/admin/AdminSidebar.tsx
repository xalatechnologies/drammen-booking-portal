
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
  ChevronRight
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

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const overviewItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
  ];

  const bookingItems = [
    {
      title: "Lokaler",
      icon: Building,
      path: "/admin/facilities",
    },
    {
      title: "Godkjenningsprosesser",
      icon: Activity,
      path: "/admin/approvals",
    },
    {
      title: "Forespørsler",
      icon: ClipboardList,
      path: "/admin/requests",
    },
  ];

  const managementItems = [
    {
      title: "Brukere & Roller",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Rapporter & Analytikk",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      title: "Varsler",
      icon: Bell,
      path: "/admin/notifications",
    },
  ];

  const systemItems = [
    {
      title: "Oversettelser",
      icon: Languages,
      path: "/admin/translations",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") {
      return true;
    }
    return currentPath.startsWith(path) && path !== "/admin";
  };

  const renderMenuGroup = (items: any[], groupLabel: string) => (
    <SidebarGroup className="mb-8">
      <SidebarGroupLabel className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-4 px-4 leading-5">
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
                  group relative flex items-center justify-between w-full text-base font-medium rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
                  ${isActive(item.path) 
                    ? 'gradient-primary text-white shadow-strong border-l-4 border-purple-300 px-6 py-4' 
                    : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900 hover:shadow-medium hover:scale-[1.02] px-4 py-4'
                  }
                  focus-ring active:scale-[0.98]
                  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3
                `}
              >
                <div className="flex items-center gap-4 group-data-[collapsible=icon]:gap-0">
                  <div className={`
                    relative p-3 rounded-xl transition-all duration-300 transform
                    ${isActive(item.path) 
                      ? 'bg-white/20 text-white shadow-soft' 
                      : 'bg-navy-100 text-navy-600 group-hover:bg-navy-200 group-hover:scale-105'
                    }
                  `}>
                    <item.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <span className="truncate font-semibold leading-5 group-data-[collapsible=icon]:hidden">{item.title}</span>
                </div>
                <ChevronRight className={`
                  h-4 w-4 transition-all duration-300 transform group-data-[collapsible=icon]:hidden
                  ${isActive(item.path) 
                    ? 'text-white opacity-100 translate-x-0' 
                    : 'text-navy-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
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
    <Sidebar className="glass border-r border-white/10 shadow-strong mt-4 animate-fade-in" collapsible="icon">
      <SidebarContent className="px-3 pt-8 pb-8 space-y-4 overflow-y-auto scrollbar-thin">
        {renderMenuGroup(overviewItems, "OVERSIKT")}
        {renderMenuGroup(bookingItems, "BOOKING")}
        {renderMenuGroup(managementItems, "ADMINISTRASJON")}
        {renderMenuGroup(systemItems, "SYSTEM")}
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/10 bg-gradient-to-t from-navy-50/50 to-transparent group-data-[collapsible=icon]:p-3">
        <div className="glass flex items-center gap-4 p-6 rounded-2xl border border-white/20 shadow-medium hover:shadow-strong transition-all duration-300 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="text-base font-bold text-navy-800 leading-5 group-data-[collapsible=icon]:hidden">System Status</span>
          </div>
          <div className="ml-auto group-data-[collapsible=icon]:hidden">
            <span className="text-sm text-green-700 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200/50 shadow-soft">
              Operative
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
