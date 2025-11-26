import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main pages
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import CreateAnnouncement from './pages/CreateAnnouncement';
import BookClassroom from './pages/BookClassroom';
import MyBookings from './pages/MyBookings';
import ApprovalQueue from './pages/ApprovalQueue';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcements/:id"
            element={
              <ProtectedRoute>
                <AnnouncementDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcements/create"
            element={
              <ProtectedRoute allowedRoles={['dosen', 'tendik', 'admin']}>
                <CreateAnnouncement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-classroom"
            element={
              <ProtectedRoute>
                <BookClassroom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/approval-queue"
            element={
              <ProtectedRoute allowedRoles={['tendik', 'admin']}>
                <ApprovalQueue />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
