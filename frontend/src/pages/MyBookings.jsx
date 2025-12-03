import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import bookingService from '../services/bookingService';
import { formatDate, formatTime } from '../utils/dateUtils';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await bookingService.cancelBooking(bookingId);
      // Refresh bookings list
      await fetchMyBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter((booking) => booking.status === filter);
  };

  const filteredBookings = getFilteredBookings();

  const getStatusCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      approved: bookings.filter((b) => b.status === 'approved').length,
      rejected: bookings.filter((b) => b.status === 'rejected').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">
              View and manage your classroom bookings
            </p>
          </div>
          <Button onClick={() => navigate('/book-classroom')}>
            + New Booking
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'cancelled'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({statusCounts.cancelled})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 mb-4">
              {filter === 'all'
                ? 'No bookings found'
                : `No ${filter} bookings found`}
            </p>
            {filter === 'all' && (
              <Button onClick={() => navigate('/book-classroom')}>
                Make Your First Booking
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.classroom?.name || 'Unknown Classroom'}
                      </h3>
                      <Badge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(booking.date)}
                        </p>
                        <p className="text-gray-700">
                          {formatTime(booking.startTime)} -{' '}
                          {formatTime(booking.endTime)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                          Building {booking.classroom?.building || 'N/A'}
                        </p>
                        <p className="text-gray-700">
                          Capacity: {booking.classroom?.capacity || 'N/A'} people
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Purpose</p>
                      <p className="text-gray-700">{booking.purpose}</p>
                    </div>

                    {booking.rejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {booking.rejectionReason}
                        </p>
                      </div>
                    )}

                    {booking.approvedBy && (
                      <div className="text-sm text-gray-500 mt-2">
                        Approved by: {booking.approvedBy.fullName}
                      </div>
                    )}

                    {booking.rejectedBy && (
                      <div className="text-sm text-gray-500 mt-2">
                        Rejected by: {booking.rejectedBy.fullName}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-4">
                    {booking.status === 'pending' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
