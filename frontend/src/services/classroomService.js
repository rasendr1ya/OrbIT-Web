import api from './api';

const classroomService = {
  // Get all classrooms
  getClassrooms: async () => {
    const response = await api.get('/classrooms');
    return response.data;
  },

  // Get single classroom
  getClassroom: async (id) => {
    const response = await api.get(`/classrooms/${id}`);
    return response.data;
  },

  // Get classroom availability for a specific date
  getClassroomAvailability: async (id, date) => {
    const response = await api.get(`/classrooms/${id}/availability?date=${date}`);
    return response.data;
  },

  // Create classroom (Admin/Tendik)
  createClassroom: async (classroomData) => {
    const response = await api.post('/classrooms', classroomData);
    return response.data;
  },

  // Update classroom (Admin/Tendik)
  updateClassroom: async (id, classroomData) => {
    const response = await api.put(`/classrooms/${id}`, classroomData);
    return response.data;
  },

  // Delete classroom (Admin)
  deleteClassroom: async (id) => {
    const response = await api.delete(`/classrooms/${id}`);
    return response.data;
  },
};

export default classroomService;
