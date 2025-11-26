import api from './api';

const announcementService = {
  // Get all announcements with optional filters
  getAnnouncements: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/announcements?${params}`);
    return response.data;
  },

  // Get single announcement
  getAnnouncement: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  // Create announcement (with file upload)
  createAnnouncement: async (announcementData) => {
    const response = await api.post('/announcements', announcementData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update announcement
  updateAnnouncement: async (id, announcementData) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },

  // Delete announcement
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

export default announcementService;
