import React from 'react';

const Badge = ({ status, text, size = 'md' }) => {
  const styles = {
    // Booking statuses - minimal black/white design
    pending: 'bg-white text-gray-900 border-gray-900',
    approved: 'bg-black text-white border-black',
    rejected: 'bg-white text-red-600 border-red-600',
    completed: 'bg-white text-gray-600 border-gray-300',
    cancelled: 'bg-white text-gray-400 border-gray-300',

    // Priority levels - minimal design
    normal: 'bg-white text-gray-900 border-gray-300',
    important: 'bg-white text-gray-900 border-gray-900',
    urgent: 'bg-black text-white border-black',

    // Categories - minimal black/white
    academic: 'bg-white text-gray-900 border-gray-900',
    hmit_event: 'bg-white text-gray-900 border-gray-900',
    lab_schedule: 'bg-white text-gray-900 border-gray-900',
    general: 'bg-white text-gray-600 border-gray-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
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
