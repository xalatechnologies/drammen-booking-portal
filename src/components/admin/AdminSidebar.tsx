
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  Settings,
  Activity,
  BarChart3,
  Wrench,
  DollarSign,
  Package,
  MapPin,
  MessageSquare,
  Building2,
  Languages
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
  SidebarHeader,
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
      active: true
    }
  ];

  const operationsItems = [
    {
      title: "Work Orders",
      icon: Wrench,
      path: "/admin/work-orders",
    },
    {
      title: "Purchase Orders",
      icon: DollarSign,
      path: "/admin/purchase-orders",
    },
    {
      title: "Requests",
      icon: FileText,
      path: "/admin/requests",
    }
  ];

  const resourcesItems = [
    {
      title: "Assets",
      icon: Package,
      path: "/admin/assets",
    },
    {
      title: "Inventory",
      icon: Package,
      path: "/admin/inventory",
    },
    {
      title: "Procedures",
      icon: FileText,
      path: "/admin/procedures",
    },
    {
      title: "Meters",
      icon: BarChart3,
      path: "/admin/meters",
    },
    {
      title: "Locations",
      icon: MapPin,
      path: "/admin/locations",
    }
  ];

  const collaborationItems = [
    {
      title: "Reporting",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/admin/messages",
    }
  ];

  const administrationItems = [
    {
      title: "Organization",
      icon: Building2,
      path: "/admin/organization",
    },
    {
      title: "Translations",
      icon: Languages,
      path: "/admin/translations",
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") {
      return true;
    }
    return currentPath.startsWith(path) && path !== "/admin";
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">SupplyMantix</h2>
            <p className="text-xs text-muted-foreground">Enterprise</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            OVERVIEW
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            OPERATIONS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            RESOURCES
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourcesItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            COLLABORATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collaborationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            ADMINISTRATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {administrationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">System Status</span>
        </div>
        <div className="text-xs text-green-600 font-medium">All systems operational</div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
