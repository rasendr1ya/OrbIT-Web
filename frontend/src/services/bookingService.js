import api from './api';

const bookingService = {
  // Get all bookings with optional filters
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/bookings?${params}`);
    return response.data;
  },

  // Get single booking
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Approve booking (Tendik/Admin)
  approveBooking: async (id, notes) => {
    const response = await api.put(`/bookings/${id}/approve`, { notes });
    return response.data;
  },

  // Reject booking (Tendik/Admin)
  rejectBooking: async (id, rejectionReason) => {
    const response = await api.put(`/bookings/${id}/reject`, { rejectionReason });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Get calendar events
  getCalendarEvents: async (startDate, endDate, classroom = '') => {
    const params = new URLSearchParams({ startDate, endDate });
    if (classroom) params.append('classroom', classroom);
    const response = await api.get(`/bookings/calendar?${params}`);
    return response.data;
  },
};

export default bookingService;
