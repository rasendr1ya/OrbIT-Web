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

// Get current academic week
export const getAcademicWeek = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = now.getDate();

  let semesterStartDate;
  let semesterType; // 'odd' or 'even'

  // Determine which semester we're currently in
  // Even semester (Genap): Late February (~26 Feb) to June
  // Odd semester (Ganjil): Late August (~26 Aug) to December

  if (currentMonth >= 2 && currentMonth <= 6) {
    // Even semester period (Feb-June)
    if (currentMonth === 2 && currentDay < 26) {
      // Before even semester starts - we're in break from odd semester
      semesterType = 'break';
    } else {
      semesterType = 'even';
      semesterStartDate = new Date(currentYear, 1, 26); // February 26
    }
  } else if (currentMonth === 7 || (currentMonth === 8 && currentDay < 26)) {
    // July or early August - semester break
    semesterType = 'break';
  } else if (currentMonth >= 8 && currentMonth <= 12) {
    // Odd semester period (Late Aug-Dec)
    if (currentMonth === 8 && currentDay < 26) {
      semesterType = 'break';
    } else {
      semesterType = 'odd';
      semesterStartDate = new Date(currentYear, 7, 26); // August 26
    }
  } else {
    // January - break between semesters (after odd, before even)
    semesterType = 'break';
  }

  // If we're in break period
  if (semesterType === 'break') {
    return 'Diluar minggu perkuliahan';
  }

  // Calculate week number
  const diffTime = now.getTime() - semesterStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  // If beyond 16 weeks, it's outside academic weeks
  if (weekNumber > 16 || weekNumber < 1) {
    return 'Diluar minggu perkuliahan';
  }

  return `Minggu Perkuliahan ke-${weekNumber}`;
};
