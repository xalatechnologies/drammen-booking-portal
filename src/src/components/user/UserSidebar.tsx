import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FilePlus,
  LifeBuoy,
  Receipt,
  ChevronRight,
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

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Min Oversikt",
      path: "/minside/bruker",
      icon: LayoutDashboard,
    },
    {
      title: "Mine Søknader",
      path: "/minside/bruker/bookinger",
      icon: Calendar,
    },
    {
      title: "Ny Søknad",
      path: "/minside/bruker/soknad",
      icon: FilePlus,
    },
    {
      title: "Mine Fakturaer",
      path: "/minside/bruker/fakturaer",
      icon: Receipt,
    },
    {
      title: "Hjelp & Støtte",
      path: "/minside/bruker/hjelp",
      icon: LifeBuoy,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/minside/bruker" && currentPath === "/minside/bruker") {
      return true;
    }
    return currentPath === path;
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
                    ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 shadow-lg shadow-slate-100/50 border-l-[3px] border-slate-600 px-6 py-5' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:shadow-slate-200/50 hover:scale-[1.02] px-3 py-3.5'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
                  active:scale-[0.98]
                `}
              >
                <span className="truncate font-medium leading-5">{item.title}</span>
                <ChevronRight className={`
                  h-4 w-4 transition-all duration-300 transform
                  ${isActive(item.path) 
                    ? 'text-slate-600 opacity-100 translate-x-0' 
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
    >
      <SidebarContent className="px-4 pt-8 sm:pt-16 pb-10 space-y-4 overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {renderMenuGroup(menuItems, "MENY")}
      </SidebarContent>
    </Sidebar>
  );
};

export default UserSidebar; 