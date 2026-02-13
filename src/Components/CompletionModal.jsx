import React, { useState } from 'react';
import { RATING_STARS } from '../utils/constants';
import '../styles/CompletionModal.css';

const CompletionModal = ({ helper, booking, onComplete, isLoading }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleComplete = () => {
    if (!review.trim()) {
      alert('Please provide a review');
      return;
    }
    onComplete(rating, review);
  };

  return (
    <div className="completion-modal-overlay">
      <div className="completion-modal">
        <div className="modal-header">
          <h2>✓ Service Completed</h2>
          <p className="modal-subtitle">Rate your experience</p>
        </div>

        <div className="modal-content">
          {/* Helper Info */}
          <div className="completion-helper-info">
            <div className="helper-avatar-large">{helper.profileImage}</div>
            <div className="helper-info">
              <h3>{helper.name}</h3>
              <p className="service-type">Service: {booking.service}</p>
            </div>
          </div>

          {/* Service Summary */}
          <div className="service-summary">
            <div className="summary-item">
              <span>📍 Address:</span>
              <span className="summary-value">{booking.address}</span>
            </div>
            <div className="summary-item">
              <span>📋 Description:</span>
              <span className="summary-value">{booking.description}</span>
            </div>
            {booking.completedAt && (
              <div className="summary-item">
                <span>⏱️ Duration:</span>
                <span className="summary-value">
                  {Math.round(
                    (booking.completedAt - booking.startedAt) / 60000
                  )}{' '}
                  minutes
                </span>
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="rating-section">
            <label className="rating-label">How would you rate the service?</label>
            <div className="stars-large">
              {RATING_STARS.map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${
                    star <= (hoverRating || rating) ? 'filled' : 'empty'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="rating-text">
              {rating === 5 && '⭐ Excellent!'}
              {rating === 4 && '😊 Very Good'}
              {rating === 3 && '👌 Good'}
              {rating === 2 && '😕 Fair'}
              {rating === 1 && '😞 Poor'}
            </p>
          </div>

          {/* Review Textarea */}
          <div className="review-section">
            <label htmlFor="review" className="review-label">
              Share your feedback (optional but appreciated!)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience..."
              className="review-textarea"
              rows="4"
            />
            <span className="char-count">{review.length}/200</span>
          </div>

          {/* Services Summary */}
          <div className="services-completed">
            <h4>Services Provided:</h4>
            <div className="service-items">
              <div className="service-item">✓ {booking.service}</div>
              <div className="service-item">✓ Professional work</div>
              <div className="service-item">✓ Within 15 minutes</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleComplete}
            disabled={isLoading || !review.trim()}
            className="btn-complete"
          >
            {isLoading ? '⏳ Submitting...' : '✓ Complete & Rate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
