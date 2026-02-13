/**
 * Haversine Formula - Calculate distance between two GPS coordinates
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Get user's current GPS location using browser geolocation
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Watch user's location in real-time
 * @param {Function} callback - Function to call when location updates
 * @returns {number} Watch ID for stopping tracking later
 */
export const watchUserLocation = (callback) => {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported');
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => {
      console.error('Watch location error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

/**
 * Stop watching user location
 * @param {number} watchId - Watch ID returned from watchUserLocation
 */
export const stopWatchingLocation = (watchId) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid GPS coordinates
 */
export const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Check if location is within 15 minutes travel time (assuming 60km/h)
 * @param {number} distance - Distance in kilometers
 * @returns {boolean} True if within 15 minute radius
 */
export const isWithin15Minutes = (distance) => {
  const maxDistance = 15; // km (assuming 60km/h = 1km/min)
  return distance <= maxDistance;
};
/**
 * Find nearest helper from list of helpers
 * @param {Object} userLocation - User's {lat, lng}
 * @param {Array} helpers - Array of helper objects with {location: {lat, lng}}
 * @returns {Object|null} Nearest helper with distance, or null if none found
 */
export const findNearestHelper = (userLocation, helpers) => {
  if (!helpers || helpers.length === 0) return null;

  let nearestHelper = null;
  let minDistance = Infinity;

  helpers.forEach((helper) => {
    if (!helper.location || !isValidCoordinates(helper.location.lat, helper.location.lng)) {
      return; // Skip invalid locations
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      helper.location.lat,
      helper.location.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestHelper = {
        ...helper,
        distance: minDistance,
        distanceText: `${minDistance.toFixed(2)} km`,
      };
    }
  });

  return nearestHelper;
};

/**
 * Find all helpers within specified radius
 * @param {Object} userLocation - User's {lat, lng}
 * @param {Array} helpers - Array of helper objects
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Helpers within radius, sorted by distance (nearest first)
 */
export const findHelpersWithinRadius = (userLocation, helpers, radiusKm = 15) => {
  if (!helpers || helpers.length === 0) return [];

  const helpersInRadius = helpers
    .map((helper) => {
      if (!helper.location || !isValidCoordinates(helper.location.lat, helper.location.lng)) {
        return null;
      }

      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        helper.location.lat,
        helper.location.lng
      );

      if (distance <= radiusKm) {
        return {
          ...helper,
          distance,
          distanceText: `${distance.toFixed(2)} km`,
        };
      }
      return null;
    })
    .filter((helper) => helper !== null)
    .sort((a, b) => a.distance - b.distance);

  return helpersInRadius;
};

/**
 * Calculate ETA (Estimated Time of Arrival) based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} speedKmh - Average speed in km/h (default: 60)
 * @returns {number} ETA in minutes
 */
export const calculateETA = (distanceKm, speedKmh = 60) => {
  const minutes = Math.ceil((distanceKm / speedKmh) * 60);
  return Math.min(minutes, 15); // Cap at 15 minutes
};