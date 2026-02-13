import React, { useState } from 'react';
import { BOOKING_STATUS } from '../utils/constants';
import '../styles/UserHomeDashboard.css';

const UserHomeDashboard = ({ user, stats, recentBookings, onNewBooking, onAdminClick, onLogout, onHelperModeClick }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceOptions, setShowServiceOptions] = useState(null);

  const serviceCategories = {
    'Cleaning': ['Regular Cleaning', 'Deep Cleaning', 'Post-Move Cleaning', 'Office Cleaning', 'Window Cleaning'],
    'Plumbing': ['Leak Repair', 'Pipe Installation', 'Drain Cleaning', 'Water Heater', 'Bathroom Fixtures'],
    'Electrical': ['Light Installation', 'Circuit Repair', 'Fan Installation', 'Switch Installation', 'Wiring'],
    'Repairs': ['General Handyman', 'Door Repair', 'Lock Installation', 'Drywall Repair', 'Cabinet Repair'],
    'Moving': ['Local Moving', 'Long Distance', 'Loading/Unloading', 'Packing Services', 'Storage'],
    'Gardening': ['Lawn Mowing', 'Garden Design', 'Hedge Trimming', 'Tree Pruning', 'Landscaping'],
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      [BOOKING_STATUS.PENDING]: { icon: '⏳', label: 'Pending' },
      [BOOKING_STATUS.ASSIGNED]: { icon: '📍', label: 'Assigned' },
      [BOOKING_STATUS.IN_PROGRESS]: { icon: '🔄', label: 'In Progress' },
      [BOOKING_STATUS.COMPLETED]: { icon: '✓', label: 'Completed' },
      [BOOKING_STATUS.CANCELLED]: { icon: '✕', label: 'Cancelled' },
    };
    return statusMap[status] || { icon: '❓', label: 'Unknown' };
  };

  const handleServiceClick = (service) => {
    setShowServiceOptions(showServiceOptions === service ? null : service);
  };

  return (
    <div className="user-home-dashboard">
      {/* Header with User Info */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.fullName || 'User'}! 👋</h1>
          <p className="header-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-new-booking" onClick={onNewBooking}>
            + New Booking
          </button>
          <div className="user-menu">
            <button className="btn-menu" title="Menu">⋮</button>
            <div className="menu-dropdown">
              <button onClick={onAdminClick} className="menu-item">📊 Admin Dashboard</button>
              <button onClick={onHelperModeClick} className="menu-item">👷 Switch to Worker Mode</button>
              <button onClick={onLogout} className="menu-item logout">🚪 Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalBookings || 0}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.completedBookings || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.pendingBookings || 0}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.avgRating || 'N/A'}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={onNewBooking}>
            <div className="action-icon">🆕</div>
            <div className="action-text">New Booking</div>
          </button>
          <button className="action-card">
            <div className="action-icon">📍</div>
            <div className="action-text">Track Service</div>
          </button>
          <button className="action-card">
            <div className="action-icon">💬</div>
            <div className="action-text">Messages</div>
          </button>
          <button className="action-card">
            <div className="action-icon">⭐</div>
            <div className="action-text">Reviews</div>
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="services-section">
        <h3>Book a Service</h3>
        <div className="services-grid">
          {Object.keys(serviceCategories).map((service) => (
            <div key={service} className="service-container">
              <div
                className={`service-card ${showServiceOptions === service ? 'active' : ''}`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="service-emoji">
                  {service === 'Cleaning' && '🧹'}
                  {service === 'Plumbing' && '🔧'}
                  {service === 'Electrical' && '⚡'}
                  {service === 'Repairs' && '🔨'}
                  {service === 'Moving' && '📦'}
                  {service === 'Gardening' && '🌿'}
                </div>
                <h4>{service}</h4>
              </div>
              {showServiceOptions === service && (
                <div className="service-options">
                  {serviceCategories[service].map((option) => (
                    <button
                      key={option}
                      className="option-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(option);
                        onNewBooking();
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-bookings-section">
        <div className="section-header">
          <h3>Recent Bookings</h3>
          <a href="#" className="view-all">View All →</a>
        </div>

        {recentBookings && recentBookings.length > 0 ? (
          <div className="recent-bookings">
            {recentBookings.slice(0, 5).map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              return (
                <div key={booking.id} className="recent-booking-item">
                  <div className="booking-status-icon">{statusBadge.icon}</div>
                  <div className="booking-info">
                    <h4>{booking.service || 'Service'}</h4>
                    <p className="booking-date">
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="booking-helper-mini">
                    {booking.assignedHelper?.emoji || '👤'}
                  </div>
                  <div className="booking-status-badge">{statusBadge.label}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-bookings">
            <p>No bookings yet. Start by booking a service!</p>
            <button className="btn-primary" onClick={onNewBooking}>Book Now</button>
          </div>
        )}
      </div>

      {/* User Info Card */}
      <div className="user-info-card">
        <h4>Account Information</h4>
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{user?.fullName || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{user?.email || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Phone:</span>
          <span className="info-value">{user?.mobileNumber || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">City:</span>
          <span className="info-value">{user?.city || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserHomeDashboard;
