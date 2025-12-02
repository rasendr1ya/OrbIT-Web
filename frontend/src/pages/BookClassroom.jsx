import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import classroomService from '../services/classroomService';
import bookingService from '../services/bookingService';

const BookClassroom = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [errors, setErrors] = useState({});
  const [conflictInfo, setConflictInfo] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const data = await classroomService.getClassrooms();
      setClassrooms(data.data || []);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setConflictInfo(null);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleClassroomSelect = (classroom) => {
    setSelectedClassroom(classroom);
    setConflictInfo(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedClassroom) {
      newErrors.classroom = 'Please select a classroom';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = 'Cannot book for past dates';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }

      const start = new Date('2000-01-01T' + formData.startTime);
      const end = new Date('2000-01-01T' + formData.endTime);
      const duration = (end - start) / (1000 * 60);

      if (duration < 30) {
        newErrors.endTime = 'Booking must be at least 30 minutes';
      } else if (duration > 240) {
        newErrors.endTime = 'Booking cannot exceed 4 hours';
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    } else if (formData.purpose.length < 10) {
      newErrors.purpose = 'Purpose must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setConflictInfo(null);

      const bookingData = {
        classroomId: selectedClassroom._id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
      };

      await bookingService.createBooking(bookingData);
      navigate('/my-bookings');
    } catch (error) {
      console.error('Failed to create booking:', error);

      if (error.response?.data?.conflict) {
        setConflictInfo(error.response.data.conflict);
        setErrors({
          submit: 'Booking conflict detected. Please choose a different time slot.',
        });
      } else {
        setErrors({
          submit: error.response?.data?.message || 'Failed to create booking',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Book a Classroom</h1>
          <p className="text-gray-600">Reserve a room for your academic activities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Classrooms</h2>

              {errors.classroom && (
                <p className="mb-4 text-sm text-red-600">{errors.classroom}</p>
              )}

              <div className="space-y-3">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom._id}
                    onClick={() => handleClassroomSelect(classroom)}
                    className={'p-4 rounded-lg border-2 cursor-pointer transition-all ' + (
                      selectedClassroom?._id === classroom._id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{classroom.name}</h3>
                      {selectedClassroom?._id === classroom._id && (
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Building {classroom.building}</p>
                      <p>Capacity: {classroom.capacity} people</p>
                    </div>
                    {classroom.facilities && classroom.facilities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {classroom.facilities.slice(0, 3).map((facility, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700">
                            {facility}
                          </span>
                        ))}
                        {classroom.facilities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700">
                            +{classroom.facilities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Details</h2>

              {selectedClassroom ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-900 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium text-gray-900">
                        {selectedClassroom.name} - Building {selectedClassroom.building}
                      </span>
                    </div>
                  </div>

                  <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} error={errors.date} required min={new Date().toISOString().split('T')[0]} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Start Time" type="time" name="startTime" value={formData.startTime} onChange={handleChange} error={errors.startTime} required />
                    <Input label="End Time" type="time" name="endTime" value={formData.endTime} onChange={handleChange} error={errors.endTime} required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Describe the purpose of your booking (e.g., Study Group, Project Discussion, etc.)"
                      className={'w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ' + (errors.purpose ? 'border-red-500 bg-red-50' : 'border-gray-300')}
                    />
                    {errors.purpose && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.purpose}</p>
                    )}
                  </div>

                  {conflictInfo && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex">
                        <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-yellow-800">Conflict Detected</h4>
                          <p className="text-sm text-yellow-700 mt-1">{conflictInfo.message}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.submit && !conflictInfo && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Your booking will be pending until approved by the tendik staff.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Submitting...' : 'Submit Booking Request'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-lg">Select a classroom to continue</p>
                  <p className="text-sm mt-1">Choose from the available classrooms on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookClassroom;
