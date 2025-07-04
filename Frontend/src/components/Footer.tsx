import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MessageCircle, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold">
              <span className="text-primary">NED </span>
              <span>Events</span>
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Premium event management platform for creating unforgettable experiences.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="/" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="/" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="/" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-gray-400 hover:text-primary text-sm transition-colors">Browse Events</Link></li>
            
              <li><Link to="/" className="text-gray-400 hover:text-primary text-sm transition-colors">Pricing</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-primary text-sm transition-colors">For Organizers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Press</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>support@NEDevents.com</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>+92 300000000</span>
              </li>
              
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} NED Events. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
