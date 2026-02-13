import React, { useState } from 'react';
import { RATING_STARS } from '../utils/constants';
import '../styles/HelperCard.css';

const HelperCard = ({
  helper,
  distance,
  eta,
  onAccept,
  onReject,
  isProcessing,
  showActions = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {RATING_STARS.map((star) => (
          <span
            key={star}
            className={`star ${star <= Math.ceil(rating) ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
        <span className="rating-text">{rating}</span>
      </div>
    );
  };

  return (
    <div className="helper-card">
      <div className="helper-header">
        <div className="helper-avatar">{helper.profileImage}</div>
        <div className="helper-info-top">
          <h3 className="helper-name">{helper.name}</h3>
          {helper.verified && <span className="verified-badge">✓ Verified</span>}
        </div>
      </div>

      <div className="helper-stats">
        <div className="stat">
          {renderStars(helper.rating)}
          <span className="stat-label">({helper.completedJobs} jobs)</span>
        </div>
        <div className="stat">
          <span className="experience">📚 {helper.experience}</span>
        </div>
      </div>

      <div className="helper-details-main">
        <div className="detail-row">
          <span className="label">📞 Phone:</span>
          <span className="value">{helper.phone}</span>
        </div>
        <div className="detail-row">
          <span className="label">💰 Price:</span>
          <span className="value">{helper.priceRange}</span>
        </div>
        {distance !== undefined && (
          <div className="detail-row highlight">
            <span className="label">📍 Distance:</span>
            <span className="value">{distance.toFixed(2)} km</span>
          </div>
        )}
        {eta !== undefined && (
          <div className="detail-row highlight">
            <span className="label">⏱️ ETA:</span>
            <span className="value">{eta} minutes</span>
          </div>
        )}
      </div>

      <div className="helper-skills">
        <span className="skills-label">🔧 Skills:</span>
        <div className="skills-tags">
          {helper.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {showDetails && (
        <div className="helper-extended">
          <div className="divider"></div>
          <p className="extended-info">
            <strong>Status:</strong> {helper.status}
          </p>
          <p className="extended-info">
            <strong>Availability:</strong>{' '}
            {helper.isAvailable ? '✓ Available' : '✗ Busy'}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="btn-details"
      >
        {showDetails ? '▲ Less Details' : '▼ More Details'}
      </button>

      {showActions && (
        <div className="helper-actions">
          <button
            onClick={() => onReject()}
            disabled={isProcessing}
            className="btn-reject"
          >
            ✗ Reject
          </button>
          <button
            onClick={() => onAccept()}
            disabled={isProcessing}
            className="btn-accept"
          >
            {isProcessing ? '⏳' : '✓'} Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default HelperCard;
