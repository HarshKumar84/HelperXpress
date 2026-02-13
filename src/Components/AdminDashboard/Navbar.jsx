import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';

const Navbar = ({ toggleSidebar, systemStatus = 'online' }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-20 xl:ml-64">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="xl:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-80 max-w-full">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings, helpers..."
              className="bg-transparent text-gray-700 placeholder-gray-400 outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                systemStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'
              } animate-pulse`}
            />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {systemStatus}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="relative text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-100 p-2 rounded-lg">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <User size={18} />
                  <span className="text-sm">Profile Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <Settings size={18} />
                  <span className="text-sm">System Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
