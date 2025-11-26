import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import announcementService from '../services/announcementService';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncement(id);
      setAnnouncement(data.data);
    } catch (error) {
      console.error('Failed to fetch announcement:', error);
    } finally {
      setLoading(false);
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

  if (!announcement) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Announcement not found</p>
          <Button onClick={() => navigate('/announcements')} className="mt-4">
            Back to Announcements
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/announcements')}
          className="mb-6"
        >
          ← Back to Announcements
        </Button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge status={announcement.priority} />
            <Badge status={announcement.category} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {announcement.title}
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
            <span>Posted by {announcement.createdBy?.fullName}</span>
            <span>•</span>
            <span>{formatDate(announcement.createdAt)}</span>
            <span>•</span>
            <span>{announcement.viewCount} views</span>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {announcement.description}
            </p>
          </div>

          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attachments
              </h3>
              <div className="space-y-2">
                {announcement.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${process.env.REACT_APP_API_URL.replace('/api', '')}${attachment.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-blue-600 hover:underline">
                      {attachment.fileName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
