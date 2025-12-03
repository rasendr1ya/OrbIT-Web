import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import announcementService from '../services/announcementService';
import bookingService from '../services/bookingService';
import Badge from '../components/common/Badge';
import { getRelativeTime, getAcademicWeek } from '../utils/dateUtils';

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

      const announcementsData = await announcementService.getAnnouncements({ limit: 5 });
      setAnnouncements(announcementsData.data || []);

      const bookingsData = await bookingService.getBookings({ limit: 5 });
      setBookings(bookingsData.data || []);

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
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-gray-600">{getAcademicWeek()}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{stats.totalAnnouncements}</div>
            <div className="text-sm text-gray-600">Total Announcements</div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-black rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{stats.urgentAnnouncements}</div>
            <div className="text-sm text-gray-600">Urgent Items</div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{stats.upcomingBookings}</div>
            <div className="text-sm text-gray-600">Upcoming Bookings</div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{stats.pendingApprovals}</div>
            <div className="text-sm text-gray-600">{canApproveBookings ? 'Pending Approvals' : 'Pending Requests'}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canCreateAnnouncement && (
              <Link
                to="/announcements/create"
                className="group flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all"
              >
                <div className="p-2 bg-black rounded-lg mr-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Post Announcement</div>
                  <div className="text-sm text-gray-600">Share updates with everyone</div>
                </div>
              </Link>
            )}

            <Link
              to="/book-classroom"
              className="group flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all"
            >
              <div className="p-2 bg-gray-900 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Book Classroom</div>
                <div className="text-sm text-gray-600">Reserve a room for your activity</div>
              </div>
            </Link>

            <Link
              to="/my-bookings"
              className="group flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all"
            >
              <div className="p-2 bg-gray-900 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">View My Bookings</div>
                <div className="text-sm text-gray-600">Check your booking status</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Announcements */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                <Link to="/announcements" className="text-sm font-medium text-gray-900 hover:underline">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No announcements yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Link
                      key={announcement._id}
                      to={`/announcements/${announcement._id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge status={announcement.priority} size="sm" />
                        <Badge status={announcement.category} size="sm" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{announcement.description}</p>
                      <p className="text-xs text-gray-500">{getRelativeTime(announcement.createdAt)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">My Recent Bookings</h2>
                <Link to="/my-bookings" className="text-sm font-medium text-gray-900 hover:underline">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{booking.classroom?.name}</h3>
                        <Badge status={booking.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{booking.purpose}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
