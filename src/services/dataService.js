// Data Service for caching and managing API data
import * as API from './api';

// Cache management
const cache = {
  data: {},
  timestamps: {},
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  get: (key) => {
    const timestamp = cache.timestamps[key];
    if (timestamp && Date.now() - timestamp < cache.CACHE_DURATION) {
      return cache.data[key];
    }
    cache.invalidate(key);
    return null;
  },

  set: (key, value) => {
    cache.data[key] = value;
    cache.timestamps[key] = Date.now();
  },

  invalidate: (key) => {
    delete cache.data[key];
    delete cache.timestamps[key];
  },

  clear: () => {
    cache.data = {};
    cache.timestamps = {};
  },
};

// ===== USER DATA SERVICE =====
export const userDataService = {
  async getUserStats(userId) {
    const cacheKey = `user_stats_${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const stats = await API.dashboardAPI.getUserDashboardStats(userId);
      cache.set(cacheKey, stats);
      return stats;
    } catch (error) {
      console.warn('Failed to fetch user stats, using mock data:', error);
      return API.getMockUserStats(userId);
    }
  },

  async getUserProfile(userId) {
    const cacheKey = `user_profile_${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const profile = await API.userAPI.getCurrentUser();
      cache.set(cacheKey, profile);
      return profile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, data) {
    try {
      const updated = await API.userAPI.updateProfile(userId, data);
      cache.invalidate(`user_profile_${userId}`);
      return updated;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  },
};

// ===== BOOKING DATA SERVICE =====
export const bookingDataService = {
  async getRecentBookings(userId, limit = 10) {
    const cacheKey = `recent_bookings_${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const bookings = await API.bookingAPI.getBookingHistory(userId, limit);
      cache.set(cacheKey, bookings);
      return bookings;
    } catch (error) {
      console.warn('Failed to fetch recent bookings:', error);
      return [];
    }
  },

  async getAllBookings(userId) {
    const cacheKey = `all_bookings_${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const bookings = await API.bookingAPI.getUserBookings(userId);
      cache.set(cacheKey, bookings);
      return bookings;
    } catch (error) {
      console.warn('Failed to fetch bookings:', error);
      return [];
    }
  },

  async createBooking(bookingData) {
    try {
      const booking = await API.bookingAPI.createBooking(bookingData);
      // Invalidate booking-related caches
      const userId = bookingData.userId;
      cache.invalidate(`recent_bookings_${userId}`);
      cache.invalidate(`all_bookings_${userId}`);
      return booking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  },

  async completeBooking(bookingId, rating, review, userId) {
    try {
      const completed = await API.bookingAPI.completeBooking(bookingId, rating, review);
      // Invalidate caches
      cache.invalidate(`recent_bookings_${userId}`);
      cache.invalidate(`all_bookings_${userId}`);
      return completed;
    } catch (error) {
      console.error('Failed to complete booking:', error);
      throw error;
    }
  },

  async cancelBooking(bookingId, reason, userId) {
    try {
      const cancelled = await API.bookingAPI.cancelBooking(bookingId, reason);
      cache.invalidate(`recent_bookings_${userId}`);
      cache.invalidate(`all_bookings_${userId}`);
      return cancelled;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      throw error;
    }
  },
};

// ===== HELPER DATA SERVICE =====
export const helperDataService = {
  async getAvailableHelpers(filters = {}) {
    const cacheKey = `available_helpers_${JSON.stringify(filters)}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const helpers = await API.helperAPI.getAvailableHelpers(filters);
      cache.set(cacheKey, helpers);
      return helpers;
    } catch (error) {
      console.warn('Failed to fetch available helpers:', error);
      return [];
    }
  },

  async getHelpersByService(service) {
    const cacheKey = `helpers_service_${service}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const helpers = await API.helperAPI.getHelpersByService(service);
      cache.set(cacheKey, helpers);
      return helpers;
    } catch (error) {
      console.warn(`Failed to fetch helpers for service ${service}:`, error);
      return [];
    }
  },

  async getHelperProfile(helperId) {
    const cacheKey = `helper_profile_${helperId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const profile = await API.helperAPI.getHelperProfile(helperId);
      cache.set(cacheKey, profile);
      return profile;
    } catch (error) {
      console.error('Failed to fetch helper profile:', error);
      throw error;
    }
  },

  async rateHelper(helperId, rating, review) {
    try {
      const result = await API.helperAPI.rateHelper(helperId, rating, review);
      cache.invalidate(`helper_profile_${helperId}`);
      return result;
    } catch (error) {
      console.error('Failed to rate helper:', error);
      throw error;
    }
  },

  async findBestAvailableHelper(userLocation, serviceType, userId) {
    // Import matching algorithm functions
    const { findBestHelper } = await import('../utils/matchingAlgorithm');
    
    try {
      const helpers = await this.getHelpersByService(serviceType);
      const bestHelper = findBestHelper(userLocation, serviceType, helpers);
      
      if (bestHelper) {
        return {
          ...bestHelper,
          status: 'existing',
          isNewWorker: false,
        };
      }
      
      // No helpers available - assign new worker
      return await this.assignNewWorkerForService(userId, serviceType, userLocation);
    } catch (error) {
      console.error('Error finding or assigning helper:', error);
      return null;
    }
  },

  async assignNewWorkerForService(userId, serviceType, userLocation) {
    try {
      const result = await API.helperAPI.assignNewWorker({
        userId,
        serviceType,
        userLocation,
      });
      
      if (result && result.success) {
        console.log('New worker automatically assigned for service type:', serviceType);
        return {
          id: result.data?.helperId || result.data?.workerId,
          name: result.data?.name,
          status: 'newly_assigned',
          eta: result.data?.eta || 15,
          isNewWorker: true,
        };
      }
    } catch (error) {
      console.warn('Failed to assign new worker:', error);
    }
    return null;
  },
};

// ===== DASHBOARD DATA SERVICE =====
export const dashboardDataService = {
  async getAdminDashboardData() {
    const cacheKey = 'admin_dashboard_data';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const data = await API.dashboardAPI.getAdminDashboardData();
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Failed to fetch admin dashboard data, using mock data:', error);
      return API.getMockDashboardStats();
    }
  },

  async getBookingsTrends(timeframe = 'week') {
    const cacheKey = `bookings_trends_${timeframe}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const trends = await API.dashboardAPI.getBookingsTrends(timeframe);
      cache.set(cacheKey, trends);
      return trends;
    } catch (error) {
      console.warn('Failed to fetch bookings trends:', error);
      return [];
    }
  },

  async getServicePerformance() {
    const cacheKey = 'service_performance';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const performance = await API.dashboardAPI.getServicePerformance();
      cache.set(cacheKey, performance);
      return performance;
    } catch (error) {
      console.warn('Failed to fetch service performance:', error);
      return [];
    }
  },

  async getDemandHeatmap() {
    const cacheKey = 'demand_heatmap';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const heatmap = await API.dashboardAPI.getDemandHeatmap();
      cache.set(cacheKey, heatmap);
      return heatmap;
    } catch (error) {
      console.warn('Failed to fetch demand heatmap:', error);
      return {};
    }
  },

  async getLiveActivityFeed(limit = 20) {
    const cacheKey = `activity_feed_${limit}`;
    const cached = cache.get(cacheKey);
    // Set shorter cache duration for activity feed (1 minute)
    // if (cached && Date.now() - cache.timestamps[cacheKey] < 60000) return cached;

    try {
      const feed = await API.dashboardAPI.getLiveActivityFeed(limit);
      cache.set(cacheKey, feed);
      return feed;
    } catch (error) {
      console.warn('Failed to fetch activity feed:', error);
      return [];
    }
  },

  async getRealTimeMetrics() {
    const cacheKey = 'real_time_metrics';
    // Don't cache real-time metrics - always fetch fresh
    try {
      return await API.dashboardAPI.getRealTimeMetrics();
    } catch (error) {
      console.warn('Failed to fetch real-time metrics:', error);
      return {};
    }
  },
};

// ===== SERVICE DATA SERVICE =====
export const serviceDataService = {
  async getAllServices() {
    const cacheKey = 'all_services';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const services = await API.serviceAPI.getAllServices();
      cache.set(cacheKey, services);
      return services;
    } catch (error) {
      console.warn('Failed to fetch services:', error);
      return [];
    }
  },

  async getServicesByCategory(category) {
    const cacheKey = `services_category_${category}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const services = await API.serviceAPI.getServicesByCategory(category);
      cache.set(cacheKey, services);
      return services;
    } catch (error) {
      console.warn(`Failed to fetch services for category ${category}:`, error);
      return [];
    }
  },

  async searchServices(query) {
    // Don't cache search results
    try {
      return await API.serviceAPI.searchServices(query);
    } catch (error) {
      console.warn('Failed to search services:', error);
      return [];
    }
  },
};

// ===== LOCATION DATA SERVICE =====
export const locationDataService = {
  async getNearbyHelpers(latitude, longitude, radius = 5) {
    try {
      return await API.locationAPI.getNearbyHelpers(latitude, longitude, radius);
    } catch (error) {
      console.warn('Failed to fetch nearby helpers:', error);
      return [];
    }
  },

  async validateServiceArea(latitude, longitude) {
    try {
      return await API.locationAPI.validateServiceArea(latitude, longitude);
    } catch (error) {
      console.warn('Failed to validate service area:', error);
      return false;
    }
  },

  async getServiceAreas() {
    const cacheKey = 'service_areas';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const areas = await API.locationAPI.getServiceAreas();
      cache.set(cacheKey, areas);
      return areas;
    } catch (error) {
      console.warn('Failed to fetch service areas:', error);
      return [];
    }
  },
};

// ===== CACHE UTILITIES =====
export const cacheService = {
  invalidateAllCache: () => cache.clear(),
  invalidateUserCache: (userId) => {
    cache.invalidate(`user_stats_${userId}`);
    cache.invalidate(`user_profile_${userId}`);
    cache.invalidate(`recent_bookings_${userId}`);
    cache.invalidate(`all_bookings_${userId}`);
  },
  getCacheStatus: () => ({
    cachedKeys: Object.keys(cache.data),
    cacheSize: Object.keys(cache.data).length,
  }),
};

export default {
  userDataService,
  bookingDataService,
  helperDataService,
  dashboardDataService,
  serviceDataService,
  locationDataService,
  cacheService,
};
