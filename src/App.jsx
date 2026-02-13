import { useState, useEffect } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { HelperProvider, useHelper } from './context/HelperContext';
import { calculateETA } from './utils/matchingAlgorithm';
import { BOOKING_STATUS } from './utils/constants';
import BookingForm from './Components/BookingForm';
import HelperCard from './Components/HelperCard';
import RealTimeTracking from './Components/RealTimeTracking';
import CompletionModal from './Components/CompletionModal';
import BookingHistory from './Components/BookingHistory';
import AdminDashboard from './Components/AdminDashboard';
import UserDashboard from './Components/UserDashboard';
import './App.css';

function AppContent() {
  const { helpers } = useHelper();
  const {
    currentBooking,
    bookings,
    recentBookings,
    createBooking,
    updateHelperResponse,
    startService,
    completeService,
    cancelBooking,
    reassignHelper,
  } = useBooking();

  const [appState, setAppState] = useState('dashboard'); // 'dashboard', 'booking', 'assigned', 'tracking', 'completion'
  const [showAdminDashboard, setShowAdminDashboard] = useState(false); // Toggle between user and admin dashboard
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate stats
  const stats = {
    totalBookings: bookings.length,
    completedBookings: bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length,
    pendingBookings: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.ASSIGNED).length,
    avgRating:
      bookings.filter((b) => b.userRating).length > 0
        ? (
            bookings.reduce((sum, b) => sum + (b.userRating || 0), 0) /
            bookings.filter((b) => b.userRating).length
          ).toFixed(1)
        : 'N/A',
  };

  // Handle booking submission
  const handleBookingSubmit = async (bookingData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const booking = createBooking(bookingData, helpers);

      if (booking.assignedHelper) {
        setAppState('assigned');
      } else {
        setError('No available helpers in your area within 15 minutes');
        setAppState('booking');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelperAccept = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateHelperResponse(currentBooking.id, 'accept', currentBooking.assignedHelper.id);
      setAppState('tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelperReject = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateHelperResponse(currentBooking.id, 'reject', currentBooking.assignedHelper.id);

      if (currentBooking.candidates && currentBooking.candidates.length > 0) {
        reassignHelper(currentBooking.id);
        setAppState('assigned'); // Show next candidate
      } else {
        setError('No more helpers available. Please try again later.');
        setAppState('booking');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartService = () => {
    startService(currentBooking.id);
    setAppState('tracking');
  };

  const handleServiceCompletion = async (rating, review) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      completeService(currentBooking.id, rating, review);
      setAppState('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(currentBooking.id, 'User cancelled');
      setAppState('dashboard');
    }
  };

  // Render different app states
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-emoji">⚡</span>
            <h1>HelperXpress</h1>
            <span className="tagline">15-Minute Guaranteed Service</span>
          </div>
          <nav className="nav-buttons">
            <button
              className={`nav-btn ${appState === 'dashboard' ? 'active' : ''}`}
              onClick={() => setAppState('dashboard')}
            >
              🏠 Dashboard
            </button>
            <button
              className={`nav-btn ${appState === 'booking' ? 'active' : ''}`}
              onClick={() => setAppState('booking')}
            >
              📋 New Booking
            </button>
            {appState === 'dashboard' && (
              <button
                className="nav-btn admin-toggle"
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                title="Toggle Admin/User Dashboard"
              >
                {showAdminDashboard ? '👤' : '⚙️'} {showAdminDashboard ? 'User' : 'Admin'} View
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Dashboard View */}
        {appState === 'dashboard' && showAdminDashboard && (
          <AdminDashboard />
        )}
        
        {appState === 'dashboard' && !showAdminDashboard && (
          <UserDashboard
            user={{ name: 'User', phone: '+91 98765 43210' }}
            stats={stats}
            recentBookings={recentBookings}
            onNewBooking={() => setAppState('booking')}
          />
        )}

        {/* Booking Form View */}
        {appState === 'booking' && (
          <BookingForm onBookingSubmit={handleBookingSubmit} isLoading={isLoading} />
        )}

        {/* Helper Assigned View */}
        {appState === 'assigned' && currentBooking?.assignedHelper && (
          <div className="assigned-view">
            <div className="assigned-container">
              <h2 className="assigned-title">✓ Helper Found!</h2>
              <p className="assigned-subtitle">
                Great news! We found a {currentBooking.service} expert nearby
              </p>

              <HelperCard
                helper={currentBooking.assignedHelper}
                distance={currentBooking.assignedHelper.distance}
                eta={currentBooking.eta}
                onAccept={handleHelperAccept}
                onReject={handleHelperReject}
                isProcessing={isLoading}
                showActions={true}
              />

              <div className="reassignment-info">
                <p>
                  {currentBooking.candidates?.length > 0
                    ? `${currentBooking.candidates.length} more options available`
                    : 'This is your best available option'}
                </p>
              </div>

              <button className="btn-cancel-booking" onClick={handleCancelBooking}>
                ✗ Cancel Booking
              </button>
            </div>
          </div>
        )}

        {/* Tracking View */}
        {(appState === 'tracking' || currentBooking?.status === BOOKING_STATUS.IN_PROGRESS) &&
          currentBooking?.assignedHelper && (
            <div className="tracking-view">
              <RealTimeTracking
                helper={currentBooking.assignedHelper}
                userLocation={currentBooking.userLocation}
                eta={currentBooking.eta}
                status={currentBooking.status}
              />

              {currentBooking.status === BOOKING_STATUS.ACCEPTED && (
                <div className="tracking-actions">
                  <button className="btn-start-service" onClick={handleStartService}>
                    ▶ Start Service
                  </button>
                </div>
              )}

              {currentBooking.status === BOOKING_STATUS.IN_PROGRESS && (
                <div className="service-in-progress">
                  <button
                    className="btn-complete-service"
                    onClick={() => {
                      setAppState('completion');
                    }}
                  >
                    ✓ Mark as Completed
                  </button>
                </div>
              )}

              <button className="btn-cancel-booking" onClick={handleCancelBooking}>
                ✗ Cancel Service
              </button>
            </div>
          )}

        {/* Completion Modal */}
        {appState === 'completion' && currentBooking?.assignedHelper && (
          <CompletionModal
            helper={currentBooking.assignedHelper}
            booking={currentBooking}
            onComplete={handleServiceCompletion}
            isLoading={isLoading}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button
              className="error-close"
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}
      </main>

      {/* Sidebar with Booking History */}
      {appState !== 'booking' && appState !== 'assigned' && appState !== 'tracking' && (
        <aside className="booking-history-sidebar">
          <BookingHistory bookings={bookings} />
        </aside>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2024 HelperXpress - Fast, Reliable, Verified Home Services</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HelperProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </HelperProvider>
  );
}
