import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import announcementService from '../services/announcementService';
import { formatDateShort, getRelativeTime } from '../utils/dateUtils';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements(filters);
      setAnnouncements(data.data || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="academic">Academic</option>
                <option value="hmit_event">HMIT Event</option>
                <option value="lab_schedule">Lab Schedule</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">No announcements found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Link
                key={announcement._id}
                to={`/announcements/${announcement._id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge status={announcement.priority} />
                      <Badge status={announcement.category} size="sm" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {announcement.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {announcement.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>
                        Posted by {announcement.createdBy?.fullName}
                      </span>
                      <span>•</span>
                      <span>{getRelativeTime(announcement.createdAt)}</span>
                      {announcement.attachments?.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{announcement.attachments.length} attachment(s)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
