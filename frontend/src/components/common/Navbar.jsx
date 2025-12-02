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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-black tracking-tight">OrbIT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-12 md:flex md:space-x-1">
              <Link
                to="/"
                className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Dashboard
              </Link>
              <Link
                to="/announcements"
                className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Announcements
              </Link>
              <Link
                to="/book-classroom"
                className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Book Room
              </Link>
              <Link
                to="/my-bookings"
                className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                My Bookings
              </Link>
              {canApproveBookings && (
                <Link
                  to="/approval-queue"
                  className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Approvals
                </Link>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {canCreateAnnouncement && (
              <Link
                to="/announcements/create"
                className="hidden md:flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all"
              >
                + New Post
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all focus:outline-none"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">{user?.fullName}</span>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ROLE_LABELS[user?.primaryRole]}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setShowMobileMenu(false)}>
              Dashboard
            </Link>
            <Link to="/announcements" className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setShowMobileMenu(false)}>
              Announcements
            </Link>
            <Link to="/book-classroom" className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setShowMobileMenu(false)}>
              Book Room
            </Link>
            <Link to="/my-bookings" className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setShowMobileMenu(false)}>
              My Bookings
            </Link>
            {canApproveBookings && (
              <Link to="/approval-queue" className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setShowMobileMenu(false)}>
                Approvals
              </Link>
            )}
            {canCreateAnnouncement && (
              <Link to="/announcements/create" className="block px-3 py-2.5 mt-2 bg-black text-white rounded-lg text-sm font-medium" onClick={() => setShowMobileMenu(false)}>
                + New Post
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
