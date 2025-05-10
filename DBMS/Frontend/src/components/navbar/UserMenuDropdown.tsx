import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, LayoutDashboard, Store } from "lucide-react";

interface UserMenuDropdownProps {
  onCloseMenu?: () => void;
}

const UserMenuDropdown = ({ onCloseMenu }: UserMenuDropdownProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onCloseMenu) onCloseMenu();
  };

  const handleSettingsClick = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'vendor':
        navigate('/vendor-profile?tab=settings');
        break;
      case 'organizer':
        navigate('/organizer-dashboard?tab=settings');
        break;
      default:
        navigate('/profile?tab=settings');
        break;
    }
    if (onCloseMenu) onCloseMenu();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image_url} alt={user?.name} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {user?.role === 'vendor' && (
          <DropdownMenuItem asChild>
            <Link to="/vendor-profile" className="flex items-center">
              <Store className="mr-2 h-4 w-4" />
              <span>Vendor Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {user?.role === 'organizer' && (
          <DropdownMenuItem asChild>
            <Link to="/organizer-dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Organizer Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <button onClick={handleSettingsClick} className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
