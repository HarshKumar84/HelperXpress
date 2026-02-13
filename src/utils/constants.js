// Service Types and Skills
export const SERVICE_TYPES = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  CLEANING: 'cleaning',
  CARPENTRY: 'carpentry',
  PAINTING: 'painting',
  AC_REPAIR: 'ac-repair',
  PEST_CONTROL: 'pest-control',
  GARDENING: 'gardening',
};

export const SERVICE_LABELS = {
  plumbing: '🔧 Plumbing',
  electrical: '⚡ Electrical',
  cleaning: '🧹 Cleaning',
  carpentry: '🔨 Carpentry',
  painting: '🎨 Painting',
  'ac-repair': '❄️ AC Repair',
  'pest-control': '🦟 Pest Control',
  gardening: '🌿 Gardening',
};

// Helper Status
export const HELPER_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
  ON_BREAK: 'on-break',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Rating Stars
export const RATING_STARS = [1, 2, 3, 4, 5];

// Distance & Time
export const MAX_SERVICE_DISTANCE = 15; // km
export const MAX_SERVICE_TIME = 15; // minutes
export const AVERAGE_SPEED_KMH = 60;

// Reassignment
export const REJECTION_TIMEOUT = 30; // seconds to reject before auto-reassign
export const MAX_REASSIGNMENT_ATTEMPTS = 3;
