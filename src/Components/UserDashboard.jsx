import React from 'react';
import { BOOKING_STATUS } from '../utils/constants';
import '../styles/UserDashboard.css';

const UserDashboard = ({ user, stats, recentBookings, onNewBooking }) => {
  const getStatusEmoji = (status) => {
    const emojis = {
      [BOOKING_STATUS.PENDING]: '⏳',
      [BOOKING_STATUS.ASSIGNED]: '🔔',
      [BOOKING_STATUS.ACCEPTED]: '✓',
      [BOOKING_STATUS.IN_PROGRESS]: '🔄',
      [BOOKING_STATUS.COMPLETED]: '✓✓',
      [BOOKING_STATUS.CANCELLED]: '✗',
    };
    return emojis[status] || '•';
  };

  const firstName =
    user?.fullName?.split(' ')[0] ||
    user?.name?.split(' ')[0] ||
    'back';

  const roleLabel = user?.role === 'worker' ? 'Worker' : 'User';

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome {firstName}! 👋</h1>
          <p className="header-subtitle">
            {user ? (
              <>
                {roleLabel} • {user.city || user.location || 'City not set'} •{' '}
                {user.mobileNumber || user.contactDetails || user.phone || 'Phone not set'}
              </>
            ) : (
              'Quick access to your services'
            )}
          </p>
        </div>
        <button onClick={onNewBooking} className="btn-new-booking">
          + New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalBookings || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.completedBookings || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.pendingBookings || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.avgRating || 'N/A'}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">🚀</span>
            <span className="action-text">Quick Booking</span>
          </button>
          <button className="action-card">
            <span className="action-icon">👨‍🔧</span>
            <span className="action-text">Browse Helpers</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📍</span>
            <span className="action-text">Track Service</span>
          </button>
          <button className="action-card">
            <span className="action-icon">⭐</span>
            <span className="action-text">My Reviews</span>
          </button>
        </div>
      </div>

      {/* Recent Bookings */}
      {recentBookings && recentBookings.length > 0 && (
        <div className="recent-bookings-section">
          <h3>Recent Bookings</h3>
          <div className="recent-bookings">
            {recentBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="recent-booking-item">
                <div className="booking-status-icon">
                  {getStatusEmoji(booking.status)}
                </div>
                <div className="booking-info">
                  <h4>{booking.service}</h4>
                  <p className="booking-status">{booking.status}</p>
                </div>
                {booking.assignedHelper && (
                  <div className="booking-helper-mini">
                    <span>{booking.assignedHelper.profileImage}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Services */}
      <div className="featured-services">
        <h3>Popular Services</h3>
        <div className="services-grid">
          <div className="service-card featured">
            <span className="service-emoji">🔧</span>
            <h4>Plumbing</h4>
            <p>Leaks, taps, pipes</p>
          </div>
          <div className="service-card featured">
            <span className="service-emoji">⚡</span>
            <h4>Electrical</h4>
            <p>Repairs, wiring</p>
          </div>
          <div className="service-card featured">
            <span className="service-emoji">🧹</span>
            <h4>Cleaning</h4>
            <p>Home & office</p>
          </div>
          <div className="service-card featured">
            <span className="service-emoji">❄️</span>
            <h4>AC Repair</h4>
            <p>Maintenance & repair</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="banner-icon">ℹ️</div>
        <div className="banner-content">
          <h4>Quality Assured Service</h4>
          <p>All helpers are verified & background checked. Service guaranteed within 15 minutes radius.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
