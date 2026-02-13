import { useState, useEffect } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { HelperProvider, useHelper } from './context/HelperContext';
import { calculateETA, ensureHelperAvailable } from './utils/matchingAlgorithm';
import { BOOKING_STATUS } from './utils/constants';
import BookingForm from './Components/BookingForm';
import HelperCard from './Components/HelperCard';
import RealTimeTracking from './Components/RealTimeTracking';
import CompletionModal from './Components/CompletionModal';
import BookingHistory from './Components/BookingHistory';
import AdminDashboard from './Components/AdminDashboard';
import UserDashboard from './Components/UserDashboard';
import UserHomeDashboard from './Components/UserHomeDashboard';
import HelperDashboard from './Components/HelperDashboard';
import LoginForm from './Components/LoginForm';
import RegistrationForm from './Components/RegistrationForm';
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
  const [showWorkerDashboard, setShowWorkerDashboard] = useState(false); // Toggle worker dashboard
  const [currentHelper, setCurrentHelper] = useState(null); // Current logged-in helper
  const [workerStatus, setWorkerStatus] = useState('available'); // Worker availability status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authState, setAuthState] = useState('login'); // 'login', 'register'
  const [currentUser, setCurrentUser] = useState(null); // Currently logged-in user

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (err) {
        console.error('Error loading user:', err);
      }
    }
  }, []);

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

      // Log the booking details for verification
      console.log('📋 Booking Request:', {
        service: bookingData.service,
        location: bookingData.userLocation,
        totalHelpersAvailable: helpers.length,
      });

      // Use ensureHelperAvailable to ALWAYS assign a helper
      // Either finds existing helper within 15 min OR auto-assigns new worker
      const assignedWorker = await ensureHelperAvailable(
        bookingData.userLocation,
        bookingData.service,
        currentUser?.id || 'user-' + Date.now(),
        helpers
      );

      if (assignedWorker) {
        // Log successful assignment
        console.log('✅ Worker Assigned:', {
          workerName: assignedWorker.name,
          workerId: assignedWorker.id,
          serviceType: bookingData.service,
          workerSkills: assignedWorker.skills,
          rating: assignedWorker.rating,
          experience: assignedWorker.experience,
        });

        // Create booking with assigned worker
        const booking = createBooking(bookingData, helpers);
        
        // If no existing helper found, update with new worker assignment
        if (!booking.assignedHelper && assignedWorker.isNewWorker) {
          booking.assignedHelper = assignedWorker;
          booking.status = BOOKING_STATUS.ASSIGNED;
          booking.eta = assignedWorker.eta || 15;
        }
        
        setAppState('assigned');
      } else {
        // Fallback: still create booking even if assignment failed
        console.warn('⚠️ No worker assigned, creating booking in pending state');
        const booking = createBooking(bookingData, helpers);
        setError('Finding available helper... Please wait.');
        setAppState('booking');
      }
    } catch (err) {
      console.error('❌ Booking Error:', err);
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

  const handleWorkerStatusChange = (status) => {
    setWorkerStatus(status);
    // In production, this would update the worker status in the backend
  };

  const handleWorkerLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setCurrentHelper(null);
      setShowWorkerDashboard(false);
      setAppState('dashboard');
      setWorkerStatus('offline');
    }
  };

  const handleLoginComplete = (user) => {
    // Save logged-in user (either normal user or worker)
    setCurrentUser(user);

    // When a worker logs in, prepare their dashboard data using registration details
    if (user.role === 'worker') {
      const baseHelper = helpers.find((h) => h.id === user.id) || helpers[0];

      const enrichedHelper = {
        ...baseHelper,
        id: user.id,
        name: user.fullName || baseHelper?.name,
        phone: user.contactDetails || user.mobileNumber || baseHelper?.phone,
        experience: user.experience || baseHelper?.experience || 'New',
        // keep existing skills/location from mock data for now
      };

      setCurrentHelper({
        ...enrichedHelper,
        status: 'available',
      });
      setShowWorkerDashboard(true);
    }
  };

  const handleRegistrationComplete = (user) => {
    // Save newly registered user
    setCurrentUser(user);

    // For workers, immediately open the worker dashboard with their registration details
    if (user.role === 'worker') {
      const baseHelper = helpers.find((h) => h.id === user.id) || helpers[0];

      const enrichedHelper = {
        ...baseHelper,
        id: user.id,
        name: user.fullName || baseHelper?.name,
        phone: user.contactDetails || user.mobileNumber || baseHelper?.phone,
        experience: user.experience || baseHelper?.experience || 'New',
      };

      setCurrentHelper({
        ...enrichedHelper,
        status: 'available',
      });
      setShowWorkerDashboard(true);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
      setCurrentUser(null);
      setCurrentHelper(null);
      setShowWorkerDashboard(false);
      setAppState('dashboard');
      setAuthState('login');
    }
  };

  const handleHelperModeClick = () => {
    // Allow user to switch to helper/worker mode
    if (!currentHelper) {
      alert('Please create a worker profile first');
      return;
    }
    setShowWorkerDashboard(true);
  };

  const handleLogoClickOnAuthPage = () => {
    // Quick demo login with user account when clicking logo on auth pages
    const demoUser = {
      id: 1,
      role: "user",
      email: "user@demo.com",
      fullName: "Demo User",
      mobileNumber: "9876543210",
      city: "Delhi"
    };
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    localStorage.setItem('userRole', 'user');
    setCurrentUser(demoUser);
  };

  // Render different app states
  return (
    <div className="app">
      {/* Authentication Screen */}
      {!currentUser && (
        <>
          {authState === 'login' && (
            <LoginForm
              onLoginComplete={handleLoginComplete}
              onToggleRegister={() => setAuthState('register')}
              onLogoClick={handleLogoClickOnAuthPage}
            />
          )}
          {authState === 'register' && (
            <RegistrationForm
              onRegistrationComplete={handleRegistrationComplete}
              onToggleLogin={() => setAuthState('login')}
              onLogoClick={handleLogoClickOnAuthPage}
            />
          )}
        </>
      )}

      {/* Main Application */}
      {currentUser && (
        <>
          {/* Header */}
          <header className="app-header">
            <div className="header-container">
              <div className="logo">
                <span className="logo-emoji">⚡</span>
                <h1>HelperXpress</h1>
                <span className="tagline">15-Minute Guaranteed Service</span>
              </div>
              <nav className="nav-buttons">
                <span className="user-info">👤 {currentUser.fullName} ({currentUser.role})</span>
                <button
                  className={`nav-btn ${appState === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    setShowWorkerDashboard(false);
                    setAppState('dashboard');
                  }}
                >
                  🏠 Dashboard
                </button>
                {currentUser.role === 'user' && (
                  <button
                    className={`nav-btn ${appState === 'booking' ? 'active' : ''}`}
                    onClick={() => {
                      setShowWorkerDashboard(false);
                      setAppState('booking');
                    }}
                  >
                    📋 New Booking
                  </button>
                )}
                {currentUser.role === 'worker' && (
                  <button
                    className={`nav-btn ${showWorkerDashboard ? 'active' : ''}`}
                    onClick={() => {
                      if (!currentHelper && helpers.length > 0) {
                        setCurrentHelper({
                          ...helpers[0],
                          status: 'available'
                        });
                      }
                      setShowWorkerDashboard(!showWorkerDashboard);
                    }}
                    title="Worker Portal"
                  >
                    👷 My Portal
                  </button>
                )}
                {appState === 'dashboard' && currentUser.role === 'user' && !showWorkerDashboard && (
                  <button
                    className="nav-btn admin-toggle"
                    onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                    title="Toggle Admin/User Dashboard"
                  >
                    {showAdminDashboard ? '👤' : '⚙️'} {showAdminDashboard ? 'User' : 'Admin'} View
                  </button>
                )}
                <button
                  className="nav-btn logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  🚪 Logout
                </button>
              </nav>
            </div>
          </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Worker Dashboard View */}
        {showWorkerDashboard && currentHelper && (
          <HelperDashboard
            helper={{
              ...currentHelper,
              status: workerStatus
            }}
            onStatusChange={handleWorkerStatusChange}
            onLogout={handleWorkerLogout}
          />
        )}

        {/* Dashboard View */}
        {!showWorkerDashboard && appState === 'dashboard' && showAdminDashboard && (
          <AdminDashboard />
        )}
        
        {/* Authenticated User Home Dashboard */}
        {!showWorkerDashboard && appState === 'dashboard' && !showAdminDashboard && currentUser && (
          <UserHomeDashboard
            user={currentUser}
            stats={stats}
            recentBookings={recentBookings}
            onNewBooking={() => setAppState('booking')}
            onAdminClick={() => setShowAdminDashboard(true)}
            onLogout={handleLogout}
            onHelperModeClick={handleHelperModeClick}
          />
        )}

        {/* Public Dashboard (Overview for non-logged-in users) */}
        {!showWorkerDashboard && appState === 'dashboard' && !showAdminDashboard && !currentUser && (
          <UserDashboard
            user={currentUser}
            stats={stats}
            recentBookings={recentBookings}
            onNewBooking={() => setAppState('booking')}
          />
        )}

        {/* Booking Form View */}
        {!showWorkerDashboard && appState === 'booking' && currentUser.role === 'user' && (
          <BookingForm onBookingSubmit={handleBookingSubmit} isLoading={isLoading} />
        )}

        {/* Helper Assigned View */}
        {!showWorkerDashboard && appState === 'assigned' && currentBooking?.assignedHelper && (
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
        {!showWorkerDashboard && (appState === 'tracking' || currentBooking?.status === BOOKING_STATUS.IN_PROGRESS) &&
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
        {!showWorkerDashboard && appState === 'completion' && currentBooking?.assignedHelper && (
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
      {!showWorkerDashboard && appState !== 'booking' && appState !== 'assigned' && appState !== 'tracking' && (
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
        </>
      )}
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
