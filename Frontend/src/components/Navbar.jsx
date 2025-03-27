import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { 
  publicNavConstants, 
  protectedNavConstants, 
  hodNavConstants, 
  deanNavConstants 
} from '../constants/Navconstant';
import codechefLogo from '../assets/codechef.svg';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  // Determine which nav items to show based on user role
  let navItems = [...publicNavConstants];
  
  if (user) {
    navItems = [...navItems, ...protectedNavConstants];
    
    if (user.role === 'HOD') {
      navItems = [...navItems, ...hodNavConstants];
    }
    
    if (user.role === 'Dean') {
      navItems = [...navItems, ...deanNavConstants];
    }
  }

  return (
    <nav className="relative bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <NavLink to="/" className="flex items-center text-xl font-bold">
            <img src={codechefLogo} alt="logo" /> CodeChef
          </NavLink>

          <div className="hidden md:flex items-center space-x-6 font-semibold text-md">
            {navItems.map((navItem, index) => (
              <NavLink
                key={index}
                to={navItem.to}
                className={({ isActive }) =>
                  isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }
              >
                {navItem.title}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <FaUser />
                  <span>{user.name}</span>
                  <span className="text-xs text-gray-500">({user.role})</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/signin"
                  className={({ isActive }) =>
                    isActive
                      ? "px-4 py-2 bg-black text-white rounded-md"
                      : "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  }
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? "px-4 py-2 bg-black text-white rounded-md"
                      : "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  }
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } fixed top-16 left-0 bottom-0 bg-white w-full shadow-xl transform transition-all duration-300 ease-in-out md:hidden z-50`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((navItem, index) => (
            <NavLink
              key={index}
              to={navItem.to}
              className={({ isActive }) =>
                isActive
                  ? "text-gray-900 font-medium px-3 py-2 rounded-md bg-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors duration-200"
              }
              onClick={() => setIsOpen(false)}
            >
              {navItem.title}
            </NavLink>
          ))}

          {user ? (
            <>
              <div className="border-t pt-4">
                <div className="text-gray-700 mb-2 px-3">
                  Signed in as: {user.name} ({user.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t pt-4 space-y-2">
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 bg-black text-white rounded-md"
                    : "block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                }
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 bg-black text-white rounded-md"
                    : "block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                }
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;