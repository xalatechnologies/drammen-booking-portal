
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  Settings,
  Activity,
  BarChart3
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
} from "@/components/ui/sidebar";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Oversikt",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      title: "Fasilitetsstyring",
      icon: FileText,
      path: "/admin/facilities",
    },
    {
      title: "Godkjenningsprosesser",
      icon: Activity,
      path: "/admin/approvals",
    },
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
    {
      title: "Profil & Innstillinger",
      icon: Settings,
      path: "/admin/profile",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") {
      return true;
    }
    return currentPath.startsWith(path) && path !== "/admin";
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
