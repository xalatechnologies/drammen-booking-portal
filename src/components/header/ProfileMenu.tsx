
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
import { useTranslation } from "@/i18n";

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
  const { t } = useTranslation();

  if (!isLoggedIn) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-1 h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        onClick={handleLogin}
      >
        <LogIn className="w-4 h-4" />
        <span>{t('common.actions.login', {}, 'Logg inn')}</span>
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
          {t('common.navigation.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          {t('common.navigation.settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {t('common.actions.logout', {}, 'Logg ut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
