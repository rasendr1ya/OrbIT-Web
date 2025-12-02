import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import announcementService from '../services/announcementService';
import { getRelativeTime } from '../utils/dateUtils';

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Stay updated with departmental news and events</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Category"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              options={[
                { value: '', label: 'All Categories' },
                { value: 'academic', label: 'Academic' },
                { value: 'hmit_event', label: 'HMIT Event' },
                { value: 'lab_schedule', label: 'Lab Schedule' },
                { value: 'general', label: 'General' }
              ]}
              placeholder="All Categories"
            />

            <Select
              label="Priority"
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'important', label: 'Important' },
                { value: 'normal', label: 'Normal' }
              ]}
              placeholder="All Priorities"
            />

            {filters.category || filters.priority ? (
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ category: '', priority: '' })}
                  className="px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg">No announcements found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Link
                key={announcement._id}
                to={`/announcements/${announcement._id}`}
                className="block group"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge status={announcement.priority} size="sm" />
                        <Badge status={announcement.category} size="sm" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                        {announcement.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {announcement.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {announcement.createdBy?.fullName}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getRelativeTime(announcement.createdAt)}
                        </span>
                        {announcement.attachments?.length > 0 && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            {announcement.attachments.length} file{announcement.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
