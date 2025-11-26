// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format date to short string
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time to HH:mm
export const formatTime = (timeString) => {
  return timeString;
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDateShort(date);
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get date after N days
export const getDateAfterDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Check if date is in the past
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Get day of week (0-6)
export const getDayOfWeek = (dateString) => {
  return new Date(dateString).getDay();
};

// Day names
export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
