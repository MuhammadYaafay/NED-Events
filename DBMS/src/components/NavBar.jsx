import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const menuItems = [
    { name: "Home", link: "/homepage" },
    { name: "Events", link: "/events" },
    { name: "Bookings", link: "/bookings" },
    { name: "Vendors", link: "/vendors" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <nav className="w-full bg-[#001f3f] shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-orange-500 tracking-wide"
        >
          Event Management
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex space-x-8">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                `text-lg font-medium tracking-wide transition-colors duration-300 ${
                  isActive
                    ? "text-orange-400 font-bold"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* REGISTER AND LOGIN BUTTON */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white w-32 text-center px-6 py-2 rounded-lg text-lg font-medium transition-all duration-300"
          >
            Sign Up
          </Link>

          <Link
            to="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white w-32 text-center px-6 py-2 rounded-lg text-lg font-medium transition-all duration-300"
          >
            Login
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          {navbarOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION MENU */}
      <div
        className={`md:hidden bg-gray-800 py-4 px-6 space-y-4 transition-all duration-300 ${
          navbarOpen ? "block" : "hidden"
        }`}
      >
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) =>
              `block text-lg font-medium tracking-wide py-2 px-4 rounded-md transition-all ${
                isActive
                  ? "text-orange-400 font-bold"
                  : "text-gray-300 hover:text-white"
              }`
            }
            onClick={() => setNavbarOpen(false)} // Close menu on click
          >
            {item.name}
          </NavLink>
        ))}

        <Link
          to="/signup"
          className="block bg-orange-500 hover:bg-orange-600 text-white text-center px-6 py-2 rounded-lg text-lg font-medium transition-all duration-300"
          onClick={() => setNavbarOpen(false)}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Header;
