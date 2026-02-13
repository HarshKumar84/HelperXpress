import React, { useState, useEffect } from 'react';
import '../styles/RealTimeTracking.css';

const RealTimeTracking = ({ helper, userLocation, eta, status }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showArrived, setShowArrived] = useState(false);

  useEffect(() => {
    if (!eta || status === 'completed' || status === 'cancelled') return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= eta * 60) {
          setShowArrived(true);
          return eta * 60;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [eta, status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = (eta * 60 - elapsedTime) / 60;
  const progressPercent = (elapsedTime / (eta * 60)) * 100;

  return (
    <div className="tracking-container">
      <div className="tracking-card">
        <h2 className="tracking-title">📍 Real-Time Tracking</h2>

        {/* Helper Info */}
        <div className="helper-tracking-info">
          <div className="avatar-large">{helper.profileImage}</div>
          <div className="helper-details">
            <h3>{helper.name}</h3>
            <p className="status-badge">{helper.status.toUpperCase()}</p>
          </div>
        </div>

        {/* Distance & Location */}
        <div className="tracking-metrics">
          <div className="metric">
            <span className="metric-label">📍 Location</span>
            <span className="metric-value">
              {helper.location.lat.toFixed(4)}, {helper.location.lng.toFixed(4)}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">📞 Contact</span>
            <span className="metric-value">{helper.phone}</span>
          </div>
        </div>

        {/* ETA Section */}
        <div className="eta-section">
          <div className="eta-display">
            <span className="eta-label">Estimated Arrival</span>
            <span className="eta-time">
              {Math.ceil(remainingTime)} min
            </span>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
            <div className="progress-labels">
              <span>0 min</span>
              <span>{eta} min</span>
            </div>
          </div>

          {/* Time Display */}
          <div className="time-display">
            <span className="elapsed">Elapsed: {formatTime(elapsedTime)}</span>
            <span className="remaining">
              Remaining: {Math.max(0, Math.ceil(remainingTime))} min
            </span>
          </div>
        </div>

        {/* Status Map */}
        <div className="map-simulation">
          <div className="map-header">🗺️ Service Location Map</div>
          <div className="map-placeholder">
            <div className="user-location">
              📍 You
            </div>
            <div className="helper-location" style={{
              left: `${20 + (progressPercent / 100) * 60}px`,
              transition: 'left 1s linear'
            }}>
              🚗 {helper.name.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="status-messages">
          {showArrived && (
            <div className="message arrived">
              ✓ Helper has arrived!
            </div>
          )}
          {remainingTime <= 2 && remainingTime > 0 && (
            <div className="message soon">
              ⏰ Helper arriving soon...
            </div>
          )}
          {status === 'in-progress' && !showArrived && (
            <div className="message in-progress">
              🔄 Service in progress...
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="tracking-actions">
          <button className="action-btn call" title="Call helper">
            ☎️ Call
          </button>
          <button className="action-btn message" title="Send message">
            💬 Message
          </button>
          <button className="action-btn share" title="Share location">
            📲 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;
