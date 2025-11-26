import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import bookingService from '../services/bookingService';
import { formatDate, formatTime } from '../utils/dateUtils';

const ApprovalQueue = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    if (!window.confirm('Are you sure you want to approve this booking?')) {
      return;
    }

    try {
      setProcessingId(bookingId);
      await bookingService.approveBooking(bookingId);
      // Refresh bookings list
      await fetchBookings();
    } catch (error) {
      console.error('Failed to approve booking:', error);
      alert(error.response?.data?.message || 'Failed to approve booking');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedBooking(null);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(selectedBooking._id);
      await bookingService.rejectBooking(selectedBooking._id, rejectionReason);
      // Refresh bookings list
      await fetchBookings();
      closeRejectModal();
    } catch (error) {
      console.error('Failed to reject booking:', error);
      alert(error.response?.data?.message || 'Failed to reject booking');
    } finally {
      setProcessingId(null);
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Approval Queue
          </h1>
          <p className="text-gray-600">
            Review and manage classroom booking requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {statusCounts.all}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-6">
            <p className="text-sm text-yellow-700">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {statusCounts.pending}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-6">
            <p className="text-sm text-green-700">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {statusCounts.approved}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {statusCounts.rejected}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({statusCounts.all})
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'No bookings found'
                : `No ${filter} bookings found`}
            </p>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Requested By</p>
                        <p className="font-medium text-gray-900">
                          {booking.user?.fullName || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.user?.email}
                        </p>
                      </div>

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
                  {booking.status === 'pending' && (
                    <div className="ml-4 flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(booking._id)}
                        disabled={processingId === booking._id}
                      >
                        {processingId === booking._id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openRejectModal(booking)}
                        disabled={processingId === booking._id}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Booking
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Booking: {selectedBooking?.classroom?.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                User: {selectedBooking?.user?.fullName}
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="Please provide a reason for rejecting this booking..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={processingId === selectedBooking?._id || !rejectionReason.trim()}
                className="flex-1"
              >
                {processingId === selectedBooking?._id
                  ? 'Rejecting...'
                  : 'Confirm Rejection'}
              </Button>
              <Button
                variant="secondary"
                onClick={closeRejectModal}
                disabled={processingId === selectedBooking?._id}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
