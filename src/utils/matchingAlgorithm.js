import { calculateDistance, isWithin15Minutes } from './locationUtils';

/**
 * Main Matching Algorithm
 * Filters helpers by skill, availability, and proximity
 * Returns the best-rated nearest helper
 * @param {Object} userLocation - User's {lat, lng}
 * @param {string} requiredSkill - Required service skill
 * @param {Array} availableHelpers - Array of helper objects
 * @returns {Object|null} Best matched helper or null
 */
export const findBestHelper = (userLocation, requiredSkill, availableHelpers) => {
  if (!availableHelpers || availableHelpers.length === 0) {
    return null;
  }

  // Step 1: Filter by skill
  const skillMatched = availableHelpers.filter((helper) =>
    helper.skills.includes(requiredSkill)
  );

  if (skillMatched.length === 0) {
    return null;
  }

  // Step 2: Filter by availability
  const availableFiltered = skillMatched.filter(
    (helper) => helper.isAvailable && helper.status === 'available'
  );

  if (availableFiltered.length === 0) {
    return null;
  }

  // Step 3: Calculate distance and filter by 15-minute radius
  const withDistance = availableFiltered.map((helper) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      helper.location.lat,
      helper.location.lng
    );
    return {
      ...helper,
      distance,
    };
  });

  const within15Min = withDistance.filter((helper) =>
    isWithin15Minutes(helper.distance)
  );

  if (within15Min.length === 0) {
    return null;
  }

  // Step 4: Sort by distance (ascending) and rating (descending)
  within15Min.sort((a, b) => {
    // Primary sort: distance ascending
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    // Secondary sort: rating descending
    return b.rating - a.rating;
  });

  // Step 5: Return best helper
  return within15Min[0];
};

/**
 * Get multiple candidate helpers (top 3)
 * Useful for reassignment if first choice rejects
 * @param {Object} userLocation - User's {lat, lng}
 * @param {string} requiredSkill - Required service skill
 * @param {Array} availableHelpers - Array of helper objects
 * @returns {Array} Top 3 candidate helpers
 */
export const findTopCandidates = (
  userLocation,
  requiredSkill,
  availableHelpers
) => {
  if (!availableHelpers || availableHelpers.length === 0) {
    return [];
  }

  // Filter by skill and availability
  const skillMatched = availableHelpers.filter((helper) =>
    helper.skills.includes(requiredSkill)
  );

  const availableFiltered = skillMatched.filter(
    (helper) => helper.isAvailable && helper.status === 'available'
  );

  // Calculate distance
  const withDistance = availableFiltered.map((helper) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      helper.location.lat,
      helper.location.lng
    );
    return {
      ...helper,
      distance,
    };
  });

  // Filter by 15-minute radius
  const within15Min = withDistance.filter((helper) =>
    isWithin15Minutes(helper.distance)
  );

  // Sort and return top 3
  within15Min.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return b.rating - a.rating;
  });

  return within15Min.slice(0, 3);
};

/**
 * Calculate ETA based on distance and average speed
 * @param {number} distance - Distance in kilometers
 * @param {number} speedKmh - Average speed in km/h (default: 60)
 * @returns {number} ETA in minutes
 */
export const calculateETA = (distance, speedKmh = 60) => {
  const minutes = Math.ceil((distance / speedKmh) * 60);
  return Math.min(minutes, 15); // Cap at 15 minutes
};
