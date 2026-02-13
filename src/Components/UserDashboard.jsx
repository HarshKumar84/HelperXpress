import React, { useState } from 'react';
import { BOOKING_STATUS } from '../utils/constants';
import '../styles/UserDashboard.css';

const UserDashboard = ({ user, stats, recentBookings, onNewBooking }) => {
  const [expandedService, setExpandedService] = useState(null);

  const serviceOptions = {
    plumbing: [
      'Tap fitting',
      'Leak repair',
      'Installation services',
      'Drainage service',
      'Pipe service',
      'Bathroom & kitchen work'
    ],
    electrical: [
      'Installation service',
      'Repair service',
      'Wiring service',
      'Appliance service',
      'Safety & inspection'
    ],
    cleaning: [
      'Home cleaning',
      'Office cleaning',
      'Deep cleaning',
      'Regular maintenance',
      'Carpet cleaning'
    ],
    ac: [
      'Installation',
      'Maintenance',
      'Repair service',
      'Gas refilling',
      'Annual service'
    ]
  };
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

      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <h2>🎉 Special Offer This Month</h2>
          <p>Get 20% off on your first booking and free service tracking</p>
          <button onClick={onNewBooking} className="btn-promo">Book Now & Save</button>
        </div>
        <div className="promo-illustration">
          <span>🏆</span>
        </div>
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
          {/* Plumbing */}
          <div className="service-card featured" onClick={() => setExpandedService(expandedService === 'plumbing' ? null : 'plumbing')}>
            <span className="service-emoji">🔧</span>
            <h4>Plumbing</h4>
            <p>Leaks, taps, pipes</p>
            {expandedService === 'plumbing' && (
              <div className="service-options">
                {serviceOptions.plumbing.map((option, idx) => (
                  <button key={idx} className="option-item">
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Electrical */}
          <div className="service-card featured" onClick={() => setExpandedService(expandedService === 'electrical' ? null : 'electrical')}>
            <span className="service-emoji">⚡</span>
            <h4>Electrical</h4>
            <p>Repairs, wiring</p>
            {expandedService === 'electrical' && (
              <div className="service-options">
                {serviceOptions.electrical.map((option, idx) => (
                  <button key={idx} className="option-item">
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cleaning */}
          <div className="service-card featured" onClick={() => setExpandedService(expandedService === 'cleaning' ? null : 'cleaning')}>
            <span className="service-emoji">🧹</span>
            <h4>Cleaning</h4>
            <p>Home & office</p>
            {expandedService === 'cleaning' && (
              <div className="service-options">
                {serviceOptions.cleaning.map((option, idx) => (
                  <button key={idx} className="option-item">
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AC Repair */}
          <div className="service-card featured" onClick={() => setExpandedService(expandedService === 'ac' ? null : 'ac')}>
            <span className="service-emoji">❄️</span>
            <h4>AC Repair</h4>
            <p>Maintenance & repair</p>
            {expandedService === 'ac' && (
              <div className="service-options">
                {serviceOptions.ac.map((option, idx) => (
                  <button key={idx} className="option-item">
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-choose-us">
        <h3>Why Choose HelperXpress?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Super Fast</h4>
            <p>Get professional helpers instantly, bookings confirmed within minutes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h4>Verified & Safe</h4>
            <p>All helpers are background checked and verified for your safety</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h4>Best Prices</h4>
            <p>Transparent pricing with no hidden charges or extra fees</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Real-Time Tracking</h4>
            <p>Track your helper's location and estimated arrival in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h4>Quality Guaranteed</h4>
            <p>100% satisfaction guaranteed or money back promise</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h4>24/7 Support</h4>
            <p>Round-the-clock customer support for all your needs</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h3>How HelperXpress Works</h3>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Browse Services</h4>
            <p>Choose from our wide range of professional services</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Book Instantly</h4>
            <p>Select date, time and confirm your service booking</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Get Confirmed</h4>
            <p>Receive helper details and real-time tracking</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Complete & Rate</h4>
            <p>Enjoy service and rate your helper's performance</p>
          </div>
        </div>
      </div>

      {/* Featured Helpers */}
      <div className="featured-helpers">
        <h3>Top Rated Helpers</h3>
        <div className="helpers-grid">
          <div className="helper-card">
            <div className="helper-avatar">👨‍🔧</div>
            <h4>Rajesh Kumar</h4>
            <p className="helper-service">Plumbing Expert</p>
            <div className="helper-rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">4.9 (234 jobs)</span>
            </div>
            <button className="btn-book-helper">Book Now</button>
          </div>
          <div className="helper-card">
            <div className="helper-avatar">👨‍💼</div>
            <h4>Amit Singh</h4>
            <p className="helper-service">Electrical Specialist</p>
            <div className="helper-rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">4.8 (189 jobs)</span>
            </div>
            <button className="btn-book-helper">Book Now</button>
          </div>
          <div className="helper-card">
            <div className="helper-avatar">👨‍🎓</div>
            <h4>Vikram Patel</h4>
            <p className="helper-service">Cleaning Professional</p>
            <div className="helper-rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">4.9 (156 jobs)</span>
            </div>
            <button className="btn-book-helper">Book Now</button>
          </div>
          <div className="helper-card">
            <div className="helper-avatar">👨‍🏫</div>
            <h4>Suresh Sharma</h4>
            <p className="helper-service">AC & Maintenance</p>
            <div className="helper-rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">4.7 (142 jobs)</span>
            </div>
            <button className="btn-book-helper">Book Now</button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials">
        <h3>What Our Customers Say</h3>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="stars">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="testimonial-text">"Amazing service! The plumber arrived on time and fixed the issue quickly. Highly recommended!"</p>
            <p className="testimonial-author">— Priya Sharma</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="stars">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="testimonial-text">"Very professional and trustworthy. The real-time tracking feature is brilliant. Will book again!"</p>
            <p className="testimonial-author">— Rohan Desai</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="stars">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="testimonial-text">"Best service platform I've used. Quick booking, verified helpers, and excellent customer support."</p>
            <p className="testimonial-author">— Neha Gupta</p>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="trust-banner">
        <div className="trust-item">
          <h4>50K+</h4>
          <p>Happy Customers</p>
        </div>
        <div className="trust-item">
          <h4>10K+</h4>
          <p>Verified Helpers</p>
        </div>
        <div className="trust-item">
          <h4>100K+</h4>
          <p>Services Completed</p>
        </div>
        <div className="trust-item">
          <h4>4.8★</h4>
          <p>Average Rating</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
