import React from 'react';

const Badge = ({ status, text, size = 'md' }) => {
  const styles = {
    // Booking statuses
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-gray-100 text-gray-800 border-gray-300',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-300',

    // Priority levels
    normal: 'bg-blue-100 text-blue-800 border-blue-300',
    important: 'bg-orange-100 text-orange-800 border-orange-300',
    urgent: 'bg-red-100 text-red-800 border-red-300',

    // Categories
    academic: 'bg-purple-100 text-purple-800 border-purple-300',
    hmit_event: 'bg-pink-100 text-pink-800 border-pink-300',
    lab_schedule: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    general: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${styles[status] || styles.normal}
        ${sizes[size]}
      `}
    >
      {text || status.toUpperCase()}
    </span>
  );
};

export default Badge;
