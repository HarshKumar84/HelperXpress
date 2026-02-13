import React, { createContext, useContext, useState, useCallback } from 'react';
import { BOOKING_STATUS } from '../utils/constants';
import { findBestHelper, findTopCandidates } from '../utils/matchingAlgorithm';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [assignedHelper, setAssignedHelper] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  /**
   * Create a new booking request
   */
  const createBooking = useCallback(
    (bookingData, helpers) => {
      const newBooking = {
        id: `BOOK-${Date.now()}`,
        ...bookingData,
        status: BOOKING_STATUS.PENDING,
        createdAt: new Date(),
        candidates: [],
        assignedHelper: null,
      };

      // Find best helper using matching algorithm
      const bestHelper = findBestHelper(
        bookingData.userLocation,
        bookingData.service,
        helpers
      );

      if (bestHelper) {
        // Get top 3 candidates for reassignment if needed
        const candidates = findTopCandidates(
          bookingData.userLocation,
          bookingData.service,
          helpers
        );

        newBooking.candidates = candidates;
        newBooking.assignedHelper = bestHelper;
        newBooking.status = BOOKING_STATUS.ASSIGNED;
        newBooking.assignedAt = new Date();
        newBooking.eta = bestHelper.eta || 10; // minutes
      }

      setCurrentBooking(newBooking);
      setBookings((prev) => [newBooking, ...prev]);

      return newBooking;
    },
    []
  );

  /**
   * Update helper response (accept/reject)
   */
  const updateHelperResponse = useCallback((bookingId, response, helperId) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status:
                response === 'accept'
                  ? BOOKING_STATUS.ACCEPTED
                  : BOOKING_STATUS.REJECTED,
              helperResponse: response,
              responseTime: new Date(),
              respondedBy: helperId,
            }
          : booking
      )
    );

    if (currentBooking?.id === bookingId) {
      setCurrentBooking((prev) =>
        prev
          ? {
              ...prev,
              status:
                response === 'accept'
                  ? BOOKING_STATUS.ACCEPTED
                  : BOOKING_STATUS.REJECTED,
              helperResponse: response,
              responseTime: new Date(),
            }
          : null
      );
    }
  }, [currentBooking?.id]);

  /**
   * Start service (move to in-progress)
   */
  const startService = useCallback((bookingId) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: BOOKING_STATUS.IN_PROGRESS,
              startedAt: new Date(),
            }
          : booking
      )
    );

    if (currentBooking?.id === bookingId) {
      setCurrentBooking((prev) =>
        prev
          ? {
              ...prev,
              status: BOOKING_STATUS.IN_PROGRESS,
              startedAt: new Date(),
            }
          : null
      );
    }
  }, [currentBooking?.id]);

  /**
   * Complete service
   */
  const completeService = useCallback((bookingId, rating, review) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: BOOKING_STATUS.COMPLETED,
              completedAt: new Date(),
              userRating: rating,
              userReview: review,
            }
          : booking
      )
    );

    if (currentBooking?.id === bookingId) {
      setCurrentBooking((prev) =>
        prev
          ? {
              ...prev,
              status: BOOKING_STATUS.COMPLETED,
              completedAt: new Date(),
              userRating: rating,
              userReview: review,
            }
          : null
      );

      // Add to recent bookings
      setRecentBookings((prev) => [currentBooking, ...prev].slice(0, 5));
    }
  }, [currentBooking]);

  /**
   * Cancel booking
   */
  const cancelBooking = useCallback((bookingId, reason) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: BOOKING_STATUS.CANCELLED,
              cancelledAt: new Date(),
              cancellationReason: reason,
            }
          : booking
      )
    );

    if (currentBooking?.id === bookingId) {
      setCurrentBooking(null);
    }
  }, [currentBooking?.id]);

  /**
   * Reassign to next candidate
   */
  const reassignHelper = useCallback((bookingId) => {
    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.id === bookingId && booking.candidates.length > 0) {
          const nextCandidate = booking.candidates[0];
          return {
            ...booking,
            assignedHelper: nextCandidate,
            candidates: booking.candidates.slice(1),
            reassignmentCount: (booking.reassignmentCount || 0) + 1,
            lastReassignedAt: new Date(),
          };
        }
        return booking;
      })
    );

    if (currentBooking?.id === bookingId) {
      setCurrentBooking((prev) => {
        if (prev && prev.candidates.length > 0) {
          const nextCandidate = prev.candidates[0];
          return {
            ...prev,
            assignedHelper: nextCandidate,
            candidates: prev.candidates.slice(1),
            reassignmentCount: (prev.reassignmentCount || 0) + 1,
            lastReassignedAt: new Date(),
          };
        }
        return prev;
      });
    }
  }, [currentBooking?.id]);

  /**
   * Get booking by ID
   */
  const getBookingById = useCallback(
    (bookingId) => {
      return bookings.find((b) => b.id === bookingId);
    },
    [bookings]
  );

  const value = {
    bookings,
    currentBooking,
    assignedHelper,
    recentBookings,
    createBooking,
    updateHelperResponse,
    startService,
    completeService,
    cancelBooking,
    reassignHelper,
    getBookingById,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
