import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import UserMenuDropdown from './UserMenuDropdown';

interface DesktopNavigationProps {
  location: { pathname: string };
}

const DesktopNavigation = ({ location }: DesktopNavigationProps) => {
  const { user, isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated() && user;

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link 
        to="/events" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === '/events' ? 'text-primary' : 'text-gray-300'
        }`}
      >
        Browse Events
      </Link>
      
      {isLoggedIn && user?.role === 'organizer' && (
        <Link 
          to="/create-event" 
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === '/create-event' ? 'text-primary' : 'text-gray-300'
          }`}
        >
          Host an Event
        </Link>
      )}
      
      <div className="h-4 w-px bg-gray-700"></div>
      
      {isLoggedIn ? (
        <UserMenuDropdown />
      ) : (
        <>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-gray-300 ">
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-primary hover:bg-primary/90" size="sm">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;
