
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
  language: 'NO' | 'EN';
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  isLoggedIn, 
  handleLogin, 
  handleLogout,
  language
}) => {
  const navigate = useNavigate();

  const translations = {
    NO: {
      login: "Logg inn",
      profile: "Min profil",
      settings: "Innstillinger",
      logout: "Logg ut"
    },
    EN: {
      login: "Log in",
      profile: "My profile",
      settings: "Settings",
      logout: "Log out"
    }
  };

  const t = translations[language];

  if (!isLoggedIn) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-1 h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        onClick={handleLogin}
      >
        <LogIn className="w-4 h-4" />
        <span>{t.login}</span>
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
          {t.profile}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          {t.settings}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {t.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
