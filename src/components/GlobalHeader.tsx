
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ShoppingCart, User, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalSearch } from "@/components/header/GlobalSearch";
import { useCartStore } from "@/stores/useCartStore";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const cartItemCount = items.length;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookingApp</span>
            </Link>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <GlobalSearch />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-1"
            >
              <Calendar className="h-4 w-4" />
              <span>Kalender</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/checkout')}
              className="flex items-center space-x-1 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Handlekurv</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
              <span>Profil</span>
            </Button>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <GlobalSearch />
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => navigate('/')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Kalender
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start relative"
                    onClick={() => navigate('/checkout')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Handlekurv
                    {cartItemCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
