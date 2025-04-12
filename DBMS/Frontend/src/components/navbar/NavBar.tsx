
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from "lucide-react";
import DesktopNavigation from './DesktopNavigation';
import MobileUserMenu from './MobileUserMenu';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/vendor-profile?tab=settings');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/70 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-white flex items-center group"
            >
              <span className="text-primary mr-1">Pulse</span>
              <span className="group-hover:text-primary transition-colors duration-300">Events</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <DesktopNavigation location={location} />
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-300 hover:text-primary transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileUserMenu 
        isOpen={isOpen} 
        onToggleMenu={toggleMenu}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
      />
    </nav>
  );
};

export default NavBar;
