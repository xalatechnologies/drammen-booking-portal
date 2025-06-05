
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
    <SidebarGroup className="mb-6">
      <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-4 px-4 leading-5">
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
                <div className="flex items-center gap-4 group-data-[collapsible=icon]:gap-0">
                  <div className={`
                    relative p-2.5 rounded-xl transition-all duration-300 transform
                    ${isActive(item.path) 
                      ? 'bg-blue-200/60 text-blue-700 shadow-inner' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:scale-105'
                    }
                  `}>
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </div>
                  <span className="truncate font-medium leading-5 group-data-[collapsible=icon]:hidden">{item.title}</span>
                </div>
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
    <Sidebar className="border-r border-slate-200/60 bg-white shadow-xl shadow-slate-200/20 mt-4" collapsible="icon">
      <SidebarContent className="px-2 pt-6 pb-8 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {renderMenuGroup(overviewItems, "OVERSIKT")}
        {renderMenuGroup(bookingItems, "BOOKING")}
        {renderMenuGroup(managementItems, "ADMINISTRASJON")}
        {renderMenuGroup(systemItems, "SYSTEM")}
      </SidebarContent>

      <SidebarFooter className="p-8 border-t border-slate-100 bg-gradient-to-t from-slate-50/50 to-white group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="text-[15px] font-semibold text-slate-800 leading-5 group-data-[collapsible=icon]:hidden">System Status</span>
          </div>
          <div className="ml-auto group-data-[collapsible=icon]:hidden">
            <span className="text-[13px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/50 shadow-sm">
              Operative
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
