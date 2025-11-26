import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import announcementService from '../services/announcementService';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'normal',
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate file sizes (max 5MB each)
    const invalidFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        files: 'Some files exceed the 5MB limit',
      }));
      return;
    }

    // Validate file types (images and PDFs only)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const invalidTypes = selectedFiles.filter(file => !validTypes.includes(file.type));
    if (invalidTypes.length > 0) {
      setErrors((prev) => ({
        ...prev,
        files: 'Only images (JPEG, PNG, GIF) and PDFs are allowed',
      }));
      return;
    }

    setFiles(selectedFiles);
    setErrors((prev) => ({ ...prev, files: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
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
      setLoading(true);
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority);

      // Append files
      files.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      await announcementService.createAnnouncement(formDataToSend);

      // Navigate to announcements page on success
      navigate('/announcements');
    } catch (error) {
      console.error('Failed to create announcement:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to create announcement',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/announcements')}
          >
            ← Back to Announcements
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Announcement
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Enter announcement title"
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                required
                placeholder="Enter announcement description"
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="hmit_event">HMIT Event</option>
                  <option value="lab_schedule">Lab Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (optional)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Upload images (JPEG, PNG, GIF) or PDFs. Max 5MB per file.
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,application/pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.files && (
                <p className="mt-1 text-sm text-red-500">{errors.files}</p>
              )}

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected files ({files.length}):
                  </p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Announcement'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/announcements')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
