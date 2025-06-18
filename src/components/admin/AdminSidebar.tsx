
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
import { StatusBadge } from "@/components/common/StatusBadge";
import { BodySmall, Caption } from "@/components/common/Typography";

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
    <SidebarGroup className="mb-spacing-xl">
      <SidebarGroupLabel className="px-spacing-lg mb-spacing-lg">
        <Caption className="text-text-tertiary uppercase tracking-wide font-medium">
          {groupLabel}
        </Caption>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-spacing-sm">
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
                className={`
                  group relative flex items-center justify-between w-full font-semibold rounded-xl transition-all duration-200 cursor-pointer
                  ${isActive(item.path) 
                    ? 'gradient-primary text-text-inverse shadow-md px-spacing-xl py-spacing-lg' 
                    : 'text-text-primary hover:surface-secondary px-spacing-lg py-spacing-lg'
                  }
                  focus-ring
                  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-spacing-md
                `}
              >
                <div className="flex items-center gap-spacing-lg group-data-[collapsible=icon]:gap-0">
                  <div className={`
                    relative p-spacing-md rounded-xl transition-all duration-200
                    ${isActive(item.path) 
                      ? 'bg-white/20 text-text-inverse' 
                      : 'surface-secondary text-text-secondary group-hover:surface-tertiary'
                    }
                  `}>
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <BodySmall className="font-semibold group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </BodySmall>
                </div>
                <ChevronRight className={`
                  h-4 w-4 transition-all duration-200 group-data-[collapsible=icon]:hidden
                  ${isActive(item.path) 
                    ? 'text-text-inverse opacity-100' 
                    : 'text-text-tertiary opacity-0 group-hover:opacity-100'
                  }
                `} strokeWidth={2} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="surface-primary border-r border-primary shadow-md" collapsible="icon">
      <SidebarContent className="px-spacing-md pt-spacing-xl pb-spacing-xl space-y-spacing-lg">
        {renderMenuGroup(overviewItems, "OVERSIKT")}
        {renderMenuGroup(bookingItems, "BOOKING")}
        {renderMenuGroup(managementItems, "ADMINISTRASJON")}
        {renderMenuGroup(systemItems, "SYSTEM")}
      </SidebarContent>

      <SidebarFooter className="p-spacing-xl border-t border-primary group-data-[collapsible=icon]:p-spacing-md">
        <div className="surface-secondary flex items-center gap-spacing-lg p-spacing-xl rounded-xl border border-primary shadow-sm hover:shadow-md transition-all duration-200 group-data-[collapsible=icon]:p-spacing-md group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-spacing-md group-data-[collapsible=icon]:gap-0">
            <StatusBadge status="success" showIcon={false} className="w-3 h-3 p-0">
              <span className="sr-only">System Status Online</span>
            </StatusBadge>
            <BodySmall className="font-bold text-text-primary group-data-[collapsible=icon]:hidden">
              System Status
            </BodySmall>
          </div>
          <div className="ml-auto group-data-[collapsible=icon]:hidden">
            <StatusBadge status="success" showIcon={false}>
              Operative
            </StatusBadge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
