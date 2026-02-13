/**
 * Smart Helper Auto-Assignment Service
 * Uses GPS coordinates to find and assign nearest helpers
 */

import {
  calculateDistance,
  getUserLocation,
  watchUserLocation,
  stopWatchingLocation,
  findNearestHelper,
  findHelpersWithinRadius,
  calculateETA,
  isValidCoordinates,
  isWithin15Minutes,
} from './locationUtils';

/**
 * Initialize helper location tracking
 * Stores helper GPS coordinates for real-time matching
 */
const helperLocationStore = {
  helpers: [],
  
  /**
   * Add helper with GPS location
   */
  addHelper: (helper) => {
    if (!helper.id || !helper.location) {
      console.error('Helper must have id and location');
      return false;
    }
    helperLocationStore.helpers.push({
      ...helper,
      addedAt: new Date(),
    });
    return true;
  },

  /**
   * Update helper location
   */
  updateHelperLocation: (helperId, lat, lng) => {
    const helper = helperLocationStore.helpers.find(h => h.id === helperId);
    if (helper) {
      helper.location = { lat, lng };
      helper.updatedAt = new Date();
      return true;
    }
    return false;
  },

  /**
   * Remove helper from store
   */
  removeHelper: (helperId) => {
    helperLocationStore.helpers = helperLocationStore.helpers.filter(
      h => h.id !== helperId
    );
  },

  /**
   * Get all helpers
   */
  getAllHelpers: () => helperLocationStore.helpers,

  /**
   * Clear all helpers
   */
  clearHelpers: () => {
    helperLocationStore.helpers = [];
  },
};

/**
 * Main Smart Helper Finder Service
 */
export const smartHelperFinder = {
  /**
   * Get user's location and find nearest helper
   * @param {Function} onFound - Callback when helper found
   * @param {Function} onError - Callback on error
   */
  findNearestHelperForUser: async (onFound, onError) => {
    try {
      const userLocation = await getUserLocation();
      
      if (!isValidCoordinates(userLocation.lat, userLocation.lng)) {
        onError('Invalid user location coordinates');
        return;
      }

      const nearestHelper = findNearestHelper(
        userLocation,
        helperLocationStore.getAllHelpers()
      );

      if (nearestHelper) {
        const eta = calculateETA(nearestHelper.distance);
        const withinServiceArea = isWithin15Minutes(nearestHelper.distance);

        onFound({
          helper: nearestHelper,
          userLocation,
          eta,
          withinServiceArea,
          status: withinServiceArea ? 'FOUND' : 'DISTANT',
        });
      } else {
        onError('No helpers available in the area');
      }
    } catch (error) {
      onError(`Error finding helper: ${error.message}`);
    }
  },

  /**
   * Find all helpers within service radius (15 km)
   * @param {Function} onFound - Callback with array of helpers
   * @param {Function} onError - Callback on error
   */
  findAllAvailableHelpers: async (onFound, onError, radiusKm = 15) => {
    try {
      const userLocation = await getUserLocation();
      
      const availableHelpers = findHelpersWithinRadius(
        userLocation,
        helperLocationStore.getAllHelpers(),
        radiusKm
      );

      if (availableHelpers.length > 0) {
        onFound({
          helpers: availableHelpers,
          userLocation,
          count: availableHelpers.length,
        });
      } else {
        onError(`No helpers found within ${radiusKm} km`);
      }
    } catch (error) {
      onError(`Error finding helpers: ${error.message}`);
    }
  },

  /**
   * Track user location in real-time and find helpers continuously
   * @param {Function} onUpdate - Called whenever location/helpers update
   * @param {Function} onError - Callback on error
   * @returns {number} Watch ID (use to stop tracking later)
   */
  trackUserLocationAndFindHelpers: (onUpdate, onError) => {
    try {
      const watchId = watchUserLocation((userLocation) => {
        const nearestHelper = findNearestHelper(
          userLocation,
          helperLocationStore.getAllHelpers()
        );

        const availableHelpers = findHelpersWithinRadius(
          userLocation,
          helperLocationStore.getAllHelpers(),
          15
        );

        onUpdate({
          userLocation,
          nearestHelper,
          availableHelpers,
          timestamp: new Date(),
        });
      });

      return watchId;
    } catch (error) {
      onError(`Error tracking location: ${error.message}`);
      return null;
    }
  },

  /**
   * Stop tracking user location
   * @param {number} watchId - Watch ID from trackUserLocationAndFindHelpers
   */
  stopTracking: (watchId) => {
    stopWatchingLocation(watchId);
  },

  /**
   * Get nearest helper with automatic assignment
   * If no helpers within 15 min, triggers auto-assignment
   * @param {Function} onAssigned - Callback when assigned
   * @param {Function} onError - Callback on error
   */
  autoAssignNearestHelper: async (onAssigned, onError) => {
    try {
      const userLocation = await getUserLocation();

      // First try to find within 15 min radius
      let helper = findNearestHelper(
        userLocation,
        helperLocationStore.getAllHelpers()
      );

      if (helper && isWithin15Minutes(helper.distance)) {
        // Found helper within service area
        onAssigned({
          type: 'EXISTING_HELPER',
          helper,
          userLocation,
          eta: calculateETA(helper.distance),
        });
        return;
      }

      // No helper within 15 min - return nearest for auto-assignment
      if (helper) {
        onAssigned({
          type: 'AUTO_ASSIGN_NEW_WORKER',
          nearestHelper: helper,
          userLocation,
          message: 'No helpers within 15 min. Auto-assigning new worker...',
        });
      } else {
        onError('No helpers available for assignment');
      }
    } catch (error) {
      onError(`Error auto-assigning helper: ${error.message}`);
    }
  },

  /**
   * Get stats about available helpers
   */
  getHelperStats: () => {
    const helpers = helperLocationStore.getAllHelpers();
    return {
      totalHelpers: helpers.length,
      availableHelpers: helpers.filter(h => h.status === 'available').length,
      busyHelpers: helpers.filter(h => h.status === 'busy').length,
      offlineHelpers: helpers.filter(h => h.status === 'offline').length,
    };
  },

  // Helper store management (exposed for component use)
  helpers: helperLocationStore,
};

/**
 * Usage Example:
 * 
 * // Add helpers with GPS location
 * smartHelperFinder.helpers.addHelper({
 *   id: 'helper1',
 *   name: 'John',
 *   location: { lat: 40.7128, lng: -74.0060 },
 *   phone: '+1234567890',
 *   status: 'available'
 * });
 * 
 * // Find nearest helper
 * smartHelperFinder.findNearestHelperForUser(
 *   (result) => {
 *     console.log('Nearest helper:', result.helper);
 *     console.log('ETA:', result.eta, 'minutes');
 *   },
 *   (error) => console.error(error)
 * );
 * 
 * // Real-time tracking
 * const watchId = smartHelperFinder.trackUserLocationAndFindHelpers(
 *   (update) => {
 *     console.log('User location:', update.userLocation);
 *     console.log('Available helpers nearby:', update.availableHelpers);
 *   },
 *   (error) => console.error(error)
 * );
 * 
 * // Stop tracking when done
 * smartHelperFinder.stopTracking(watchId);
 */

export default smartHelperFinder;
