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
  Building,
  Archive,
  ClipboardList,
  Gauge,
  MapPin,
  MessageSquare,
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
import Logo from "@/components/header/Logo";

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

  const operationsItems = [
    {
      title: "Fasilitetsstyring",
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

  const resourcesItems = [
    {
      title: "Brukere & Roller",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Inventar",
      icon: Archive,
      path: "/admin/inventory",
    },
    {
      title: "Prosedyrer",
      icon: FileText,
      path: "/admin/procedures",
    },
    {
      title: "Målere",
      icon: Gauge,
      path: "/admin/meters",
    },
    {
      title: "Lokasjoner",
      icon: MapPin,
      path: "/admin/locations",
    },
  ];

  const collaborationItems = [
    {
      title: "Rapporter & Analytikk",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      title: "Meldinger",
      icon: MessageSquare,
      path: "/admin/messages",
    },
  ];

  const administrationItems = [
    {
      title: "Organisasjon",
      icon: Building,
      path: "/admin/organization",
    },
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
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4 space-y-6">
        {renderMenuGroup(overviewItems, "OVERSIKT")}
        {renderMenuGroup(operationsItems, "OPERASJONER")}
        {renderMenuGroup(resourcesItems, "RESSURSER")}
        {renderMenuGroup(collaborationItems, "SAMARBEID")}
        {renderMenuGroup(administrationItems, "ADMINISTRASJON")}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Alle systemer operative</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
