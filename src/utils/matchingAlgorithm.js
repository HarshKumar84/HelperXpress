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
    console.log('🔍 No helpers available in database');
    return null;
  }

  console.log(`🔍 MATCHING ALGORITHM: Finding ${requiredSkill} worker...`);

  // Step 1: Filter by skill
  const skillMatched = availableHelpers.filter((helper) =>
    helper.skills.includes(requiredSkill)
  );

  console.log(`📋 Skill Filter: ${skillMatched.length}/${availableHelpers.length} workers have "${requiredSkill}" skill`);

  if (skillMatched.length === 0) {
    console.warn(`⚠️ No workers found with "${requiredSkill}" skill`);
    return null;
  }

  // Step 2: Filter by availability
  const availableFiltered = skillMatched.filter(
    (helper) => helper.isAvailable && helper.status === 'available'
  );

  console.log(`✅ Availability Filter: ${availableFiltered.length}/${skillMatched.length} workers are available`);

  if (availableFiltered.length === 0) {
    console.warn(`⚠️ No available workers with "${requiredSkill}" skill`);
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

  console.log(`📍 Distance Filter: ${within15Min.length}/${availableFiltered.length} workers within 15 minutes`);

  if (within15Min.length === 0) {
    console.warn(`⚠️ No workers within 15-minute radius for "${requiredSkill}"`);
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
  const selectedHelper = within15Min[0];
  console.log(`🎯 SELECTED WORKER: ${selectedHelper.name} (${selectedHelper.id})`);
  console.log(`   📊 Rating: ${selectedHelper.rating}⭐ | Experience: ${selectedHelper.experience} years`);
  console.log(`   📍 Distance: ${selectedHelper.distance}km | ETA: ~${Math.ceil(selectedHelper.distance * 2)} min`);
  console.log(`   ℹ️ Skills: ${selectedHelper.skills.join(', ')}`);

  return selectedHelper;
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
/**
 * Automatic Worker Assignment
 * If no helpers available within 15 minutes, assign a new worker to the service type
 * @param {Object} bookingData - Booking data {userId, serviceType, userLocation, scheduledTime}
 * @returns {Promise<Object>} Assigned helper/worker data or null if assignment fails
 */
export const assignNewWorkerIfNeeded = async (bookingData) => {
  try {
    // Dynamic import to avoid circular dependencies
    const { helperAPI } = await import('../services/api.js');
    
    // bookingData should contain:
    // - userId: User requesting service
    // - serviceType: Type of service needed (e.g., 'plumbing', 'electrical')
    // - userLocation: {lat, lng} of user
    // - scheduledTime: Requested time (optional)
    
    const assignmentResult = await helperAPI.assignNewWorker(bookingData);
    
    if (assignmentResult && assignmentResult.success && assignmentResult.data) {
      console.log('New worker assigned automatically:', assignmentResult.data);
      return {
        id: assignmentResult.data.helperId || assignmentResult.data.workerId,
        name: assignmentResult.data.name,
        status: 'newly_assigned',
        eta: assignmentResult.data.eta || 15,
        isNewWorker: true,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to assign new worker:', error);
    return null;
  }
};

/**
 * Ensure Helper Available - Extended Matching
 * First tries to find existing available helpers
 * If none within 15 minutes, automatically assigns a new worker
 * @param {Object} userLocation - User's {lat, lng}
 * @param {string} serviceType - Required service type
 * @param {number} userId - User ID requesting service
 * @param {Array} availableHelpers - Array of available helpers
 * @returns {Promise<Object>} Either existing helper or newly assigned worker
 */
export const ensureHelperAvailable = async (
  userLocation,
  serviceType,
  userId,
  availableHelpers = []
) => {
  try {
    console.log('\n🚀 ENSURE HELPER AVAILABLE - Starting auto-assignment process...');
    console.log(`   Service: ${serviceType} | Location: (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`);

    // First, try to find an available helper within 15 minutes
    const bestHelper = findBestHelper(userLocation, serviceType, availableHelpers);
    
    if (bestHelper) {
      console.log(`✅ SUCCESS: Found available helper!`);
      return {
        ...bestHelper,
        status: 'existing',
        isNewWorker: false,
      };
    }
    
    // No helpers available within 15 minutes - assign a new worker
    console.warn(
      `\n⚠️ AUTO-ASSIGN FALLBACK: No existing helpers within 15 min for "${serviceType}".`
    );
    console.log(`   Attempting to assign new worker for ${serviceType} service...`);
    
    const newWorker = await assignNewWorkerIfNeeded({
      userId,
      serviceType,
      userLocation,
    });
    
    if (newWorker) {
      console.log(`✅ NEW WORKER ASSIGNED: ${newWorker.name} (ID: ${newWorker.id})`);
    } else {
      console.error(`❌ FAILED: Could not assign new worker for ${serviceType}`);
    }

    return newWorker;
  } catch (error) {
    console.error('Error ensuring helper availability:', error);
    return null;
  }
};