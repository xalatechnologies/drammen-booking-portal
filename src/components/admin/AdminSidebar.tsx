
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
    <SidebarGroup className="mb-xl">
      <SidebarGroupLabel className="px-lg mb-lg">
        <Caption className="text-muted-foreground uppercase tracking-wide font-medium">
          {groupLabel}
        </Caption>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-sm">
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
                className={`
                  group relative flex items-center justify-between w-full font-semibold rounded-xl transition-all duration-200 cursor-pointer
                  ${isActive(item.path) 
                    ? 'bg-primary text-primary-foreground shadow-md px-xl py-lg' 
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground px-lg py-lg'
                  }
                  focus-ring
                  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-md
                `}
              >
                <div className="flex items-center gap-lg group-data-[collapsible=icon]:gap-0">
                  <div className={`
                    relative p-md rounded-xl transition-all duration-200
                    ${isActive(item.path) 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
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
                    ? 'text-primary-foreground opacity-100' 
                    : 'text-muted-foreground opacity-0 group-hover:opacity-100'
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
    <Sidebar className="bg-sidebar border-r border-sidebar-border shadow-md" collapsible="icon">
      <SidebarContent className="px-md pt-xl pb-xl space-y-lg">
        {renderMenuGroup(overviewItems, "OVERSIKT")}
        {renderMenuGroup(bookingItems, "BOOKING")}
        {renderMenuGroup(managementItems, "ADMINISTRASJON")}
        {renderMenuGroup(systemItems, "SYSTEM")}
      </SidebarContent>

      <SidebarFooter className="p-xl border-t border-sidebar-border group-data-[collapsible=icon]:p-md">
        <div className="bg-secondary flex items-center gap-lg p-xl rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 group-data-[collapsible=icon]:p-md group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-md group-data-[collipsible=icon]:gap-0">
            <StatusBadge status="success" showIcon={false} className="w-3 h-3 p-0">
              <span className="sr-only">System Status Online</span>
            </StatusBadge>
            <BodySmall className="font-bold text-foreground group-data-[collapsible=icon]:hidden">
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
