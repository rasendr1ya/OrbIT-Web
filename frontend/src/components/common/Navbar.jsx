import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canCreateAnnouncement = ['dosen', 'tendik', 'admin'].includes(user?.primaryRole);
  const canApproveBookings = ['tendik', 'admin'].includes(user?.primaryRole);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">OrbIT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/announcements"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Announcements
              </Link>
              <Link
                to="/book-classroom"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Book Classroom
              </Link>
              <Link
                to="/my-bookings"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                My Bookings
              </Link>
              {canApproveBookings && (
                <Link
                  to="/approval-queue"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Approval Queue
                </Link>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.fullName}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{ROLE_LABELS[user?.primaryRole]}</p>
                  </div>
                  {canCreateAnnouncement && (
                    <Link
                      to="/announcements/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Create Announcement
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden ml-4 p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-2">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/announcements"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Announcements
            </Link>
            <Link
              to="/book-classroom"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Book Classroom
            </Link>
            <Link
              to="/my-bookings"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              My Bookings
            </Link>
            {canApproveBookings && (
              <Link
                to="/approval-queue"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Approval Queue
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
