
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, User } from "lucide-react";

const GlobalHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white py-2 px-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (left) */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src="https://www.drammen.kommune.no/Logos/logo-drammen-new.svg" alt="Drammen Kommune Logo" className="h-20 w-auto" />
          </a>
        </div>

        {/* Navigation (center) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={cn(navigationMenuTriggerStyle(), "text-blue-700 font-medium")}
                onClick={() => navigate("/")}
              >
                Reserver lokaler
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={cn(navigationMenuTriggerStyle(), "text-blue-700 font-medium")}
                onClick={() => navigate("/bookings")}
              >
                Mine reservasjoner
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-blue-700 font-medium">Hjelp</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[200px]">
                  <li>
                    <NavigationMenuLink
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium">Ofte stilte spørsmål</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Få svar på vanlige spørsmål
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium">Bruksvilkår</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Les våre bruksvilkår for booking
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium">Kontakt oss</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Få hjelp fra vårt kundesenter
                      </p>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Language & Profile (right) */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
            <Button variant="ghost" className="h-8 p-1">NO</Button>
            <span className="text-gray-300">|</span>
            <Button variant="ghost" className="h-8 p-1">EN</Button>
          </div>
          <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-100">
            <span className="sr-only">User profile</span>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
