
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, User, HelpCircle, Book, MessageCircle, LogIn } from "lucide-react";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white py-2 px-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (left) */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src="https://www.drammen.kommune.no/Logos/logo-drammen-new.svg" alt="Drammen Kommune Logo" className="h-16 w-auto" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="lg:hidden p-2" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Desktop Navigation (center) */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(), 
                  "text-blue-700 font-medium transition-all duration-200 hover:bg-blue-50",
                  isActive("/") && "bg-blue-100"
                )}
                onClick={() => navigate("/")}
              >
                Reserver lokaler
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(), 
                  "text-blue-700 font-medium transition-all duration-200 hover:bg-blue-50",
                  isActive("/bookings") && "bg-blue-100"
                )}
                onClick={() => navigate("/bookings")}
              >
                Mine reservasjoner
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-blue-700 font-medium hover:bg-blue-50">
                <div className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Hjelp</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                        href="#"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-blue-800">
                          Trenger du hjelp?
                        </div>
                        <p className="text-sm leading-tight text-blue-700">
                          Vi er her for å hjelpe deg med å finne og reservere lokaler i Drammen kommune.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        <div className="text-sm font-medium">Ofte stilte spørsmål</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Få svar på vanlige spørsmål om reservering
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        <div className="text-sm font-medium">Bruksvilkår</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Les våre bruksvilkår for booking av lokaler
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <div className="text-sm font-medium">Kontakt oss</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Få hjelp fra vårt kundesenter
                      </p>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* New Login Navigation Item */}
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(), 
                  "text-blue-700 font-medium transition-all duration-200 hover:bg-blue-50",
                  isActive("/login") && "bg-blue-100"
                )}
                onClick={() => navigate("/login")}
              >
                <div className="flex items-center gap-1">
                  <LogIn className="w-4 h-4" />
                  <span>Logg inn</span>
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu (full-screen, conditional rendering) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden pt-16 px-4">
            <div className="flex flex-col gap-4 p-4">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-lg font-medium py-3",
                  isActive("/") && "bg-blue-100 text-blue-700"
                )}
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                Reserver lokaler
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-lg font-medium py-3",
                  isActive("/bookings") && "bg-blue-100 text-blue-700"
                )}
                onClick={() => {
                  navigate("/bookings");
                  setMobileMenuOpen(false);
                }}
              >
                Mine reservasjoner
              </Button>
              
              {/* Add Login button to mobile menu */}
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-lg font-medium py-3",
                  isActive("/login") && "bg-blue-100 text-blue-700"
                )}
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Logg inn
              </Button>
              
              <div className="border-t my-2"></div>
              <div className="text-lg font-medium px-3 py-2">Hjelp</div>
              <Button 
                variant="ghost" 
                className="w-full justify-start pl-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ofte stilte spørsmål
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start pl-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bruksvilkår
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start pl-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontakt oss
              </Button>

              <div className="border-t my-2"></div>
              <div className="flex justify-around mt-4">
                <Button variant="ghost" className="flex-1 h-10">NO</Button>
                <span className="text-gray-300 flex items-center">|</span>
                <Button variant="ghost" className="flex-1 h-10">EN</Button>
              </div>
            </div>
          </div>
        )}

        {/* Language & Profile (right) */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
            <Button variant="ghost" className="h-8 p-1">NO</Button>
            <span className="text-gray-300">|</span>
            <Button variant="ghost" className="h-8 p-1">EN</Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-blue-50 hover:bg-blue-100">
                <span className="sr-only">User profile</span>
                <User className="h-5 w-5 text-blue-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Min profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Innstillinger
              </DropdownMenuItem>
              <DropdownMenuItem>
                Logg ut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
