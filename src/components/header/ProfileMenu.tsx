
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileMenuProps {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  isLoggedIn, 
  handleLogin, 
  handleLogout 
}) => {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-1 h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        onClick={handleLogin}
      >
        <LogIn className="w-4 h-4" />
        <span>Logg inn</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-100 hover:bg-gray-200">
          <span className="sr-only">User profile</span>
          <User className="h-5 w-5 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Min profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          Innstillinger
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          Logg ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
