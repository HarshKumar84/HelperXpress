import React, { useState } from 'react';
import '../styles/BookingHistory.css';

const BookingHistory = ({ bookings }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      assigned: '🔔',
      accepted: '✓',
      'in-progress': '🔄',
      completed: '✓✓',
      cancelled: '✗',
      rejected: '✗',
    };
    return icons[status] || '•';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      assigned: '#2196f3',
      accepted: '#4caf50',
      'in-progress': '#2196f3',
      completed: '#4caf50',
      cancelled: '#f44336',
      rejected: '#f44336',
    };
    return colors[status] || '#666';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="booking-history-container">
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p>No bookings yet</p>
          <small>Your booking history will appear here</small>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-history-container">
      <h2 className="history-title">📋 Booking History</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-item">
            <div className="booking-main" onClick={() =>
              setExpandedId(expandedId === booking.id ? null : booking.id)
            }>
              <div className="booking-status">
                <span
                  className="status-icon"
                  style={{ color: getStatusColor(booking.status) }}
                >
                  {getStatusIcon(booking.status)}
                </span>
              </div>

              <div className="booking-summary">
                <h4 className="booking-service">{booking.service}</h4>
                <p className="booking-date">{formatDate(booking.createdAt)}</p>
              </div>

              <div className="booking-helper">
                {booking.assignedHelper && (
                  <>
                    <span className="helper-avatar">
                      {booking.assignedHelper.profileImage}
                    </span>
                    <span className="helper-name">
                      {booking.assignedHelper.name}
                    </span>
                  </>
                )}
              </div>

              <div className="booking-status-label">
                <span className="status-badge" style={{
                  backgroundColor: getStatusColor(booking.status)
                }}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="expand-icon">
                {expandedId === booking.id ? '▲' : '▼'}
              </div>
            </div>

            {expandedId === booking.id && (
              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">ID:</span>
                  <span className="value">{booking.id}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Service:</span>
                  <span className="value">{booking.service}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">{booking.address}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Description:</span>
                  <span className="value">{booking.description}</span>
                </div>

                {booking.assignedHelper && (
                  <>
                    <div className="detail-row">
                      <span className="label">Helper:</span>
                      <span className="value">
                        {booking.assignedHelper.name}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Contact:</span>
                      <span className="value">
                        {booking.assignedHelper.phone}
                      </span>
                    </div>
                  </>
                )}

                {booking.eta && (
                  <div className="detail-row">
                    <span className="label">ETA:</span>
                    <span className="value">{booking.eta} minutes</span>
                  </div>
                )}

                {booking.userRating && (
                  <div className="detail-row">
                    <span className="label">Your Rating:</span>
                    <span className="value">
                      {'★'.repeat(booking.userRating)}{'☆'.repeat(5 - booking.userRating)}
                    </span>
                  </div>
                )}

                {booking.userReview && (
                  <div className="detail-row">
                    <span className="label">Your Review:</span>
                    <span className="value review">{booking.userReview}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">{formatDate(booking.createdAt)}</span>
                </div>

                {booking.completedAt && (
                  <div className="detail-row">
                    <span className="label">Completed:</span>
                    <span className="value">{formatDate(booking.completedAt)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
