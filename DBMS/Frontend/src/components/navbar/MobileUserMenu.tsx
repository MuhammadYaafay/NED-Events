import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";

interface MobileUserMenuProps {
  isOpen: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
}

const MobileUserMenu = ({ isOpen, onToggleMenu, onLogout, onSettingsClick }: MobileUserMenuProps) => {
  const { user, isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated() && user;
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 bg-black/70" onClick={onToggleMenu} />
      <nav className="fixed top-16 right-0 bottom-0 w-3/4 bg-background">
        <div className="p-4 space-y-4">
          <Link
            to="/events"
            className={`block p-2 text-sm rounded-lg hover:bg-accent ${
              location.pathname === '/events' ? 'bg-accent' : ''
            }`}
            onClick={onToggleMenu}
          >
            Browse Events
          </Link>

          {isLoggedIn ? (
            <>
              {user?.role === 'organizer' && (
                <Link
                  to="/create-event"
                  className={`block p-2 text-sm rounded-lg hover:bg-accent ${
                    location.pathname === '/create-event' ? 'bg-accent' : ''
                  }`}
                  onClick={onToggleMenu}
                >
                  Host an Event
                </Link>
              )}
              <div className="pt-4 border-t border-border">
                <div className="px-2 mb-2">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onSettingsClick}
                >
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={onLogout}
                >
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-4 space-y-2">
              <Link to="/login" onClick={onToggleMenu}>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={onToggleMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileUserMenu;
