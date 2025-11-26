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
    // Clear error for this field
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

      // Calculate duration in minutes
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
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

      // Navigate to my bookings on success
      navigate('/my-bookings');
    } catch (error) {
      console.error('Failed to create booking:', error);

      // Check if it's a conflict error
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
            Book a Classroom
          </h1>
          <p className="text-gray-600">
            Select a classroom and choose your preferred time slot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classroom Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Classrooms
              </h2>

              {errors.classroom && (
                <p className="mb-4 text-sm text-red-500">{errors.classroom}</p>
              )}

              <div className="space-y-3">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom._id}
                    onClick={() => handleClassroomSelect(classroom)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedClassroom?._id === classroom._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">
                      {classroom.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Building {classroom.building}
                    </p>
                    <p className="text-sm text-gray-600">
                      Capacity: {classroom.capacity} people
                    </p>
                    {classroom.facilities && classroom.facilities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {classroom.facilities.slice(0, 3).map((facility, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-xs rounded"
                          >
                            {facility}
                          </span>
                        ))}
                        {classroom.facilities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                            +{classroom.facilities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Details
              </h2>

              {selectedClassroom ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selected Classroom Info */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      Selected: {selectedClassroom.name} (Building{' '}
                      {selectedClassroom.building})
                    </p>
                  </div>

                  {/* Date */}
                  <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />

                  {/* Time Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Time"
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      error={errors.startTime}
                      required
                    />
                    <Input
                      label="End Time"
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      error={errors.endTime}
                      required
                    />
                  </div>

                  {/* Duration Info */}
                  {formData.startTime && formData.endTime && (
                    <div className="text-sm text-gray-600">
                      Duration:{' '}
                      {(() => {
                        const start = new Date(`2000-01-01T${formData.startTime}`);
                        const end = new Date(`2000-01-01T${formData.endTime}`);
                        const minutes = (end - start) / (1000 * 60);
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        return hours > 0
                          ? `${hours} hour${hours > 1 ? 's' : ''} ${
                              mins > 0 ? `${mins} minutes` : ''
                            }`
                          : `${mins} minutes`;
                      })()}
                    </div>
                  )}

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Describe the purpose of your booking (e.g., Study Group, Project Discussion, etc.)"
                      className={`w-full px-3 py-2 border ${
                        errors.purpose ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>
                    )}
                  </div>

                  {/* Conflict Info */}
                  {conflictInfo && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        Booking Conflict Detected
                      </h4>
                      <p className="text-sm text-yellow-700">
                        {conflictInfo.message}
                      </p>
                      {conflictInfo.conflictingBooking && (
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Existing booking: {conflictInfo.conflictingBooking.startTime} -{' '}
                            {conflictInfo.conflictingBooking.endTime}
                          </p>
                          <p>Purpose: {conflictInfo.conflictingBooking.purpose}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Error */}
                  {errors.submit && !conflictInfo && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Your booking will be pending until approved
                      by the tendik staff. You will be notified once your booking is
                      reviewed.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Submitting...' : 'Submit Booking'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/dashboard')}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-gray-500">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p>Please select a classroom from the list to continue</p>
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
