import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-10">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="text-2xl font-bold">
              <span className="text-primary">Pulse</span>
              <span>Events</span>
            </Link>
            <p className="text-sm text-gray-400 mt-4 max-w-md">
              Premium event management platform for creating unforgettable experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-row sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12">
            <Link to="/events" className="text-gray-400 hover:text-primary text-sm transition-colors">
              Browse Events
            </Link>
            <Link to="/create-event" className="text-gray-400 hover:text-primary text-sm transition-colors">
              Create Event
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-800 w-full">
            <p className="text-xs text-gray-400 mt-6">
              &copy; {new Date().getFullYear()} Pulse Events. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
