import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import announcementService from '../services/announcementService';
import bookingService from '../services/bookingService';
import Badge from '../components/common/Badge';
import { getRelativeTime } from '../utils/dateUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    urgentAnnouncements: 0,
    upcomingBookings: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent announcements
      const announcementsData = await announcementService.getAnnouncements({
        limit: 5,
      });
      setAnnouncements(announcementsData.data || []);

      // Fetch user bookings
      const bookingsData = await bookingService.getBookings({
        limit: 5,
      });
      setBookings(bookingsData.data || []);

      // Calculate stats
      const urgentCount = announcementsData.data?.filter((a) => a.priority === 'urgent').length || 0;
      const upcomingCount = bookingsData.data?.filter((b) => b.status === 'approved').length || 0;
      const pendingCount = bookingsData.data?.filter((b) => b.status === 'pending').length || 0;

      setStats({
        totalAnnouncements: announcementsData.count || 0,
        urgentAnnouncements: urgentCount,
        upcomingBookings: upcomingCount,
        pendingApprovals: pendingCount,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreateAnnouncement = ['dosen', 'tendik', 'admin'].includes(user?.primaryRole);
  const canApproveBookings = ['tendik', 'admin'].includes(user?.primaryRole);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Announcements</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAnnouncements}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Urgent Announcements</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.urgentAnnouncements}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Bookings</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.upcomingBookings}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {canApproveBookings ? 'Pending Approvals' : 'Pending Bookings'}
                </p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingApprovals}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canCreateAnnouncement && (
              <Link
                to="/announcements/create"
                className="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Create Announcement</span>
              </Link>
            )}

            <Link
              to="/book-classroom"
              className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="bg-green-500 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Book Classroom</span>
            </Link>

            <Link
              to="/my-bookings"
              className="flex items-center p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <div className="bg-purple-500 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">View My Bookings</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Announcements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
              <Link to="/announcements" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No announcements yet</p>
              ) : (
                announcements.map((announcement) => (
                  <Link
                    key={announcement._id}
                    to={`/announcements/${announcement._id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge status={announcement.priority} text={announcement.priority.toUpperCase()} />
                          <Badge status={announcement.category} text={announcement.category} size="sm" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {announcement.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {getRelativeTime(announcement.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Recent Bookings</h2>
              <Link to="/my-bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bookings yet</p>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.classroom?.name}</h3>
                      <Badge status={booking.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{booking.purpose}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.bookingDate).toLocaleDateString('id-ID')} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
