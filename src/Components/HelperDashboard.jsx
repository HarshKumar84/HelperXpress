import React, { useState } from 'react';
import '../styles/HelperDashboard.css';
import HelperLocation from './HelperLocation';

const HelperDashboard = ({ helper, onStatusChange, onLogout }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!helper) {
    return (
      <div className="helper-dashboard-container error">
        <p>No helper data available. Please sign in first.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      available: '#4caf50',
      busy: '#ff9800',
      offline: '#f44336',
      'on-break': '#2196f3',
    };
    return colors[status?.toLowerCase()] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      available: '🟢',
      busy: '🟡',
      offline: '🔴',
      'on-break': '⏸️',
    };
    return icons[status?.toLowerCase()] || '•';
  };

  // Mock earnings data
  const earningsData = {
    totalEarnings: 45000,
    currentMonth: 12000,
    pendingAmount: 2500,
    completionRate: '96%',
  };

  // Mock reviews
  const recentReviews = [
    {
      id: 1,
      user: 'Ramesh Gupta',
      rating: 5,
      text: 'Excellent work! Very professional and punctual.',
      date: '2024-02-10',
    },
    {
      id: 2,
      user: 'Priya Menon',
      rating: 5,
      text: 'Did a great job. Highly recommended!',
      date: '2024-02-08',
    },
    {
      id: 3,
      user: 'Vikram Singh',
      rating: 4,
      text: 'Good work. Could have been faster but quality is good.',
      date: '2024-02-05',
    },
  ];

  // Mock job history
  const jobHistory = [
    {
      id: 1,
      service: 'Plumbing Repair',
      user: 'Rajesh Kumar',
      status: 'completed',
      date: '2024-02-10',
      amount: 800,
      rating: 5,
    },
    {
      id: 2,
      service: 'Electrical Installation',
      user: 'Neha Sharma',
      status: 'completed',
      date: '2024-02-09',
      amount: 1200,
      rating: 5,
    },
    {
      id: 3,
      service: 'Painting Work',
      user: 'Vikram Singh',
      status: 'completed',
      date: '2024-02-07',
      amount: 2000,
      rating: 4,
    },
    {
      id: 4,
      service: 'Carpentry',
      user: 'Anjali Verma',
      status: 'completed',
      date: '2024-02-05',
      amount: 1500,
      rating: 5,
    },
  ];

  return (
    <div className="helper-dashboard-container">
      {/* Header */}
      <div className="helper-header">
        <div className="header-content">
          <div className="logo">Helper Xpress Worker</div>
          <div className="header-actions">
            <button
              className="btn-logout"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-image-wrapper">
              <span className="profile-image">{helper.profileImage}</span>
              <span className={`status-indicator ${helper.status}`}>
                {getStatusIcon(helper.status)}
              </span>
            </div>
            <div className="profile-info">
              <h1 className="helper-name">{helper.name}</h1>
              <div className="contact-info">
                <p>📱 {helper.phone}</p>
                {helper.verified && (
                  <p className="verified-badge">✓ Verified Professional</p>
                )}
              </div>
            </div>
            <button
              className="btn-edit-profile"
              onClick={() => setShowProfileModal(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* Quick Status Section */}
          <div className="quick-status">
            <div className="status-selector">
              <label>Current Status:</label>
              <select
                value={helper.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="status-dropdown"
              >
                <option value="available">🟢 Available</option>
                <option value="busy">🟡 Busy</option>
                <option value="on-break">⏸️ On Break</option>
                <option value="offline">🔴 Offline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-value">{helper.rating}</p>
            <p className="stat-label">Rating</p>
            <p className="stat-sub">({helper.completedJobs} reviews)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <p className="stat-value">{helper.completedJobs}</p>
            <p className="stat-label">Completed Jobs</p>
            <p className="stat-sub">{earningsData.completionRate} success rate</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-value">₹{earningsData.totalEarnings.toLocaleString()}</p>
            <p className="stat-label">Total Earnings</p>
            <p className="stat-sub">₹{earningsData.currentMonth} this month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <p className="stat-value">₹{earningsData.pendingAmount}</p>
            <p className="stat-label">Pending Payment</p>
            <p className="stat-sub">Withdrawable soon</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Job History
        </button>
        <button
          className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab('location')}
        >
          📍 Location
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={`tab-btn ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              {/* Professional Info */}
              <div className="info-card">
                <h3>Professional Information</h3>
                <div className="info-row">
                  <span className="label">Experience:</span>
                  <span className="value">{helper.experience}</span>
                </div>
                <div className="info-row">
                  <span className="label">Price Range:</span>
                  <span className="value">{helper.priceRange}</span>
                </div>
                <div className="info-row">
                  <span className="label">Verification:</span>
                  <span className="value">
                    {helper.verified ? '✓ Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="info-card">
                <h3>Skills & Services</h3>
                <div className="skills-container">
                  {helper.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="info-card full-width">
                <h3>Service Location</h3>
                <div className="location-info">
                  <p>📍 Latitude: {helper.location.lat}</p>
                  <p>📍 Longitude: {helper.location.lng}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job History Tab */}
        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h2>Recent Jobs</h2>
            <div className="jobs-list">
              {jobHistory.map((job) => (
                <div key={job.id} className="job-item">
                  <div className="job-header">
                    <h4>{job.service}</h4>
                    <span className={`status-badge ${job.status}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="job-client">👤 {job.user}</p>
                  <p className="job-date">📅 {new Date(job.date).toLocaleDateString()}</p>
                  <div className="job-footer">
                    <span className="job-amount">₹{job.amount}</span>
                    <div className="job-rating">
                      {Array(job.rating)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Tracking Tab */}
        {activeTab === 'location' && (
          <div className="location-section">
            <HelperLocation helperId={helper?.id || 'H001'} />
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              {recentReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div>
                      <h4>{review.user}</h4>
                      <p className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="review-rating">
                      {Array(review.rating)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="earnings-section">
            <h2>Earnings Details</h2>
            <div className="earnings-breakdown">
              <div className="earning-item">
                <h4>Total Earnings</h4>
                <p className="amount">₹{earningsData.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="earning-item">
                <h4>This Month</h4>
                <p className="amount">₹{earningsData.currentMonth.toLocaleString()}</p>
              </div>
              <div className="earning-item">
                <h4>Pending Payment</h4>
                <p className="amount pending">₹{earningsData.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="earning-item">
                <h4>Completion Rate</h4>
                <p className="amount">{earningsData.completionRate}</p>
              </div>
            </div>

            <div className="earnings-actions">
              <button className="btn-withdraw">Withdraw Earnings</button>
              <button className="btn-statement">View Statement</button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button
                className="modal-close"
                onClick={() => setShowProfileModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={helper.name} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" value={helper.phone} readOnly />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input type="text" value={helper.experience} readOnly />
              </div>
              <div className="form-group">
                <label>Price Range</label>
                <input type="text" value={helper.priceRange} readOnly />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <div className="skills-display">
                  {helper.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelperDashboard;
