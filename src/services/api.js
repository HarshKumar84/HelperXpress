// API Service Layer for HelperXpress
// This file handles all backend API calls and data fetching

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

// ===== USER/AUTHENTICATION ENDPOINTS =====
export const userAPI = {
  // Login user
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Register new user
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Get current user profile
  getCurrentUser: () => apiCall('/users/me'),

  // Update user profile
  updateProfile: (userId, data) =>
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Get user stats
  getUserStats: (userId) => apiCall(`/users/${userId}/stats`),
};

// ===== BOOKING ENDPOINTS =====
export const bookingAPI = {
  // Create new booking
  createBooking: (bookingData) =>
    apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  // Get all bookings for user
  getUserBookings: (userId) => apiCall(`/bookings/user/${userId}`),

  // Get booking details
  getBookingDetails: (bookingId) => apiCall(`/bookings/${bookingId}`),

  // Update booking status
  updateBookingStatus: (bookingId, status) =>
    apiCall(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Cancel booking
  cancelBooking: (bookingId, reason) =>
    apiCall(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Complete booking with rating
  completeBooking: (bookingId, rating, review) =>
    apiCall(`/bookings/${bookingId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    }),

  // Get booking history
  getBookingHistory: (userId, limit = 10) =>
    apiCall(`/bookings/user/${userId}/history?limit=${limit}`),
};

// ===== HELPER/SERVICE PROVIDER ENDPOINTS =====
export const helperAPI = {
  // Get all available helpers
  getAvailableHelpers: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/helpers/available?${params}`);
  },

  // Get helper profile
  getHelperProfile: (helperId) => apiCall(`/helpers/${helperId}`),

  // Get helpers by service
  getHelpersByService: (service) => apiCall(`/helpers/service/${service}`),

  // Rate a helper
  rateHelper: (helperId, rating, review) =>
    apiCall(`/helpers/${helperId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    }),

  // Get helper stats (for worker dashboard)
  getHelperStats: (helperId) => apiCall(`/helpers/${helperId}/stats`),

  // Update helper availability
  updateHelperStatus: (helperId, status) =>
    apiCall(`/helpers/${helperId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Assign new worker to service type (when no helpers available within radius)
  assignNewWorker: (bookingData) =>
    apiCall('/helpers/assign-new-worker', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  // Get or create dedicated helper for service area
  ensureHelperForArea: (serviceType, location) =>
    apiCall('/helpers/ensure-for-area', {
      method: 'POST',
      body: JSON.stringify({ serviceType, location }),
    }),
};

// ===== SERVICE ENDPOINTS =====
export const serviceAPI = {
  // Get all services
  getAllServices: () => apiCall('/services'),

  // Get service details
  getServiceDetails: (serviceId) => apiCall(`/services/${serviceId}`),

  // Get services by category
  getServicesByCategory: (category) => apiCall(`/services/category/${category}`),

  // Search services
  searchServices: (query) => apiCall(`/services/search?q=${query}`),
};

// ===== DASHBOARD/ANALYTICS ENDPOINTS =====
export const dashboardAPI = {
  // Get user dashboard stats
  getUserDashboardStats: (userId) => apiCall(`/dashboard/user/${userId}/stats`),

  // Get admin dashboard data
  getAdminDashboardData: () => apiCall('/dashboard/admin/data'),

  // Get bookings chart data
  getBookingsTrends: (timeframe = 'week') =>
    apiCall(`/dashboard/bookings-trends?timeframe=${timeframe}`),

  // Get service performance data
  getServicePerformance: () => apiCall('/dashboard/service-performance'),

  // Get demand heatmap data
  getDemandHeatmap: () => apiCall('/dashboard/demand-heatmap'),

  // Get helper assignment flow data
  getHelperAssignmentFlow: () => apiCall('/dashboard/helper-assignment-flow'),

  // Get live activity feed
  getLiveActivityFeed: (limit = 20) >= apiCall(`/dashboard/activity-feed?limit=${limit}`),

  // Get real-time metrics
  getRealTimeMetrics: () => apiCall('/dashboard/real-time-metrics'),
};

// ===== PAYMENT ENDPOINTS =====
export const paymentAPI = {
  // Create payment
  createPayment: (bookingId, amount) =>
    apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify({ bookingId, amount }),
    }),

  // Get payment history
  getPaymentHistory: (userId) => apiCall(`/payments/user/${userId}`),

  // Process refund
  processRefund: (paymentId, reason) =>
    apiCall(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// ===== SUPPORT/MESSAGING ENDPOINTS =====
export const supportAPI = {
  // Send support message
  sendSupportMessage: (message, category) =>
    apiCall('/support/message', {
      method: 'POST',
      body: JSON.stringify({ message, category }),
    }),

  // Get support tickets
  getSupportTickets: (userId) => apiCall(`/support/tickets/${userId}`),

  // Send message in chat
  sendMessage: (conversationId, message) =>
    apiCall(`/support/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};

// ===== NOTIFICATION ENDPOINTS =====
export const notificationAPI = {
  // Get user notifications
  getNotifications: (userId, limit = 10) =>
    apiCall(`/notifications/${userId}?limit=${limit}`),

  // Mark notification as read
  markAsRead: (notificationId) =>
    apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),

  // Subscribe to push notifications
  subscribeToPushNotifications: (userId, subscription) =>
    apiCall(`/notifications/${userId}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
    }),
};

// ===== SEARCH & FILTER ENDPOINTS =====
export const searchAPI = {
  // Global search
  globalSearch: (query) => apiCall(`/search?q=${query}`),

  // Filter helpers
  filterHelpers: (filters) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/helpers/filter?${params}`);
  },

  // Filter bookings
  filterBookings: (userId, filters) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/bookings/user/${userId}/filter?${params}`);
  },
};

// ===== LOCATION ENDPOINTS =====
export const locationAPI = {
  // Get nearby helpers
  getNearbyHelpers: (latitude, longitude, radius = 5) =>
    apiCall(`/location/nearby-helpers?lat=${latitude}&lng=${longitude}&radius=${radius}`),

  // Validate service area
  validateServiceArea: (latitude, longitude) =>
    apiCall('/location/validate-service-area', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    }),

  // Get service areas
  getServiceAreas: () => apiCall('/location/service-areas'),
};

// ===== MOCK DATA FALLBACK =====
// If backend is not available, return mock data
export const getMockUserStats = (userId) => ({
  totalBookings: 12,
  completedBookings: 10,
  pendingBookings: 2,
  avgRating: 4.8,
});

export const getMockDashboardStats = () => ({
  activeBookings: 156,
  completedToday: 48,
  avgRating: 4.7,
  helperUtilization: 85,
});

export default {
  userAPI,
  bookingAPI,
  helperAPI,
  serviceAPI,
  dashboardAPI,
  paymentAPI,
  supportAPI,
  notificationAPI,
  searchAPI,
  locationAPI,
};
