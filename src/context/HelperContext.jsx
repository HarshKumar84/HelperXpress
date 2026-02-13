import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockHelpers } from '../data/mockHelpers';
import { HELPER_STATUS } from '../utils/constants';

const HelperContext = createContext();

export const HelperProvider = ({ children }) => {
  const [helpers, setHelpers] = useState(mockHelpers);
  const [currentHelper, setCurrentHelper] = useState(null);

  /**
   * Get all helpers
   */
  const getAllHelpers = useCallback(() => {
    return helpers;
  }, [helpers]);

  /**
   * Get available helpers
   */
  const getAvailableHelpers = useCallback(() => {
    return helpers.filter(
      (helper) => helper.isAvailable && helper.status === HELPER_STATUS.AVAILABLE
    );
  }, [helpers]);

  /**
   * Get helper by ID
   */
  const getHelperById = useCallback(
    (helperId) => {
      return helpers.find((h) => h.id === helperId);
    },
    [helpers]
  );

  /**
   * Update helper status
   */
  const updateHelperStatus = useCallback((helperId, status) => {
    setHelpers((prev) =>
      prev.map((helper) =>
        helper.id === helperId
          ? {
              ...helper,
              status,
              isAvailable: status === HELPER_STATUS.AVAILABLE,
            }
          : helper
      )
    );

    if (currentHelper?.id === helperId) {
      setCurrentHelper((prev) =>
        prev
          ? {
              ...prev,
              status,
              isAvailable: status === HELPER_STATUS.AVAILABLE,
            }
          : null
      );
    }
  }, [currentHelper?.id]);

  /**
   * Update helper location
   */
  const updateHelperLocation = useCallback((helperId, location) => {
    setHelpers((prev) =>
      prev.map((helper) =>
        helper.id === helperId
          ? {
              ...helper,
              location,
            }
          : helper
      )
    );

    if (currentHelper?.id === helperId) {
      setCurrentHelper((prev) =>
        prev
          ? {
              ...prev,
              location,
            }
          : null
      );
    }
  }, [currentHelper?.id]);

  /**
   * Update helper rating
   */
  const updateHelperRating = useCallback((helperId, newRating) => {
    setHelpers((prev) =>
      prev.map((helper) => {
        if (helper.id === helperId) {
          const totalReviews = helper.completedJobs;
          const oldRatingSum = helper.rating * totalReviews;
          const updatedRating =
            (oldRatingSum + newRating) / (totalReviews + 1);

          return {
            ...helper,
            rating: Math.round(updatedRating * 10) / 10,
            completedJobs: totalReviews + 1,
          };
        }
        return helper;
      })
    );
  }, []);

  /**
   * Get helper by skill
   */
  const getHelpersBySkill = useCallback(
    (skill) => {
      return helpers.filter((helper) => helper.skills.includes(skill));
    },
    [helpers]
  );

  /**
   * Search helpers by name or skill
   */
  const searchHelpers = useCallback(
    (query) => {
      const q = query.toLowerCase();
      return helpers.filter(
        (helper) =>
          helper.name.toLowerCase().includes(q) ||
          helper.skills.some((skill) => skill.includes(q))
      );
    },
    [helpers]
  );

  /**
   * Toggle helper online/offline
   */
  const toggleHelperAvailability = useCallback((helperId) => {
    setHelpers((prev) =>
      prev.map((helper) =>
        helper.id === helperId
          ? {
              ...helper,
              isAvailable: !helper.isAvailable,
              status: !helper.isAvailable
                ? HELPER_STATUS.AVAILABLE
                : HELPER_STATUS.OFFLINE,
            }
          : helper
      )
    );
  }, []);

  const value = {
    helpers,
    currentHelper,
    setCurrentHelper,
    getAllHelpers,
    getAvailableHelpers,
    getHelperById,
    updateHelperStatus,
    updateHelperLocation,
    updateHelperRating,
    getHelpersBySkill,
    searchHelpers,
    toggleHelperAvailability,
  };

  return (
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  );
};

export const useHelper = () => {
  const context = useContext(HelperContext);
  if (!context) {
    throw new Error('useHelper must be used within HelperProvider');
  }
  return context;
};
