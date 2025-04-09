
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, PlusCircle, User, Store, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileUserMenuProps {
  isOpen: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
}

const MobileUserMenu = ({ 
  isOpen, 
  onToggleMenu,
  onLogout,
  onSettingsClick
}: MobileUserMenuProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden transition-all duration-300 ease-in-out overflow-hidden max-h-96 opacity-100">
      <div className="px-4 pt-2 pb-6 space-y-4 bg-black/80 backdrop-blur-lg">
        <Link 
          to="/events" 
          className="block py-2 text-base font-medium hover:text-primary"
          onClick={onToggleMenu}
        >
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Browse Events
          </div>
        </Link>
        
        {isAuthenticated && user?.role === 'organizer' && (
          <Link 
            to="/create-event" 
            className="block py-2 text-base font-medium hover:text-primary"
            onClick={onToggleMenu}
          >
            <div className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Host an Event
            </div>
          </Link>
        )}
        
        {isAuthenticated ? (
          <>
            <div className="flex items-center py-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </p>
              </div>
            </div>
            <Link 
              to="/profile" 
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={onToggleMenu}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile
              </div>
            </Link>
            
            {user?.role === 'vendor' && (
              <Link 
                to="/vendor-profile" 
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={onToggleMenu}
              >
                <div className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Vendor Dashboard
                </div>
              </Link>
            )}
            
            {user?.role === 'organizer' && (
              <Link 
                to="/organizer-dashboard" 
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={onToggleMenu}
              >
                <div className="flex items-center">
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Organizer Dashboard
                </div>
              </Link>
            )}
            
            <button 
              className="flex items-center w-full py-2 text-base font-medium hover:text-primary"
              onClick={onSettingsClick}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
            
            <button 
              className="flex items-center w-full py-2 text-base font-medium hover:text-primary"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log out
            </button>
          </>
        ) : (
          <div className="pt-4 flex space-x-4">
            <Link to="/login" className="w-1/2" onClick={onToggleMenu}>
              <Button variant="outline" className="w-full">Log In</Button>
            </Link>
            <Link to="/signup" className="w-1/2" onClick={onToggleMenu}>
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileUserMenu;
