// SmartAutoAssign.js
import smartHelperFinder from '../services/smartHelperFinder';

/**
 * Auto-assigns a helper for a user location and service type
 * @param {Object} userLocation - {lat, lng}
 * @param {string} serviceType - e.g. 'plumbing'
 * @returns {Object|null} Assigned helper or null
 */
export function autoAssignHelper(userLocation, serviceType) {
  // For demo: filter helpers by serviceType if available
  // In real app, helpers should have a 'services' array
  const allHelpers = smartHelperFinder.helperLocationStore
    ? smartHelperFinder.helperLocationStore.getAllHelpers()
    : [];

  const filteredHelpers = allHelpers.filter(h =>
    h.services && h.services.includes(serviceType)
  );

  // Fallback to all helpers if none match serviceType
  const helpersToSearch = filteredHelpers.length > 0 ? filteredHelpers : allHelpers;

  // Find nearest helper
  const assigned = smartHelperFinder.findNearestHelper(
    userLocation,
    helpersToSearch
  );

  return assigned;
}
