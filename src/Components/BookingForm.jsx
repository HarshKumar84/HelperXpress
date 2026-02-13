import React, { useState } from 'react';
import { SERVICE_TYPES, SERVICE_LABELS } from '../utils/constants';
import { getUserLocation } from '../utils/locationUtils';
import '../styles/BookingForm.css';

const BookingForm = ({ onBookingSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    service: SERVICE_TYPES.PLUMBING,
    description: '',
    address: '',
    phone: '',
    gettingLocation: false,
  });
  const [error, setError] = useState('');

  const handleServiceChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      service: e.target.value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleGetLocation = async () => {
    setFormData((prev) => ({ ...prev, gettingLocation: true }));
    try {
      const location = await getUserLocation();
      setFormData((prev) => ({
        ...prev,
        userLocation: location,
        gettingLocation: false,
      }));
      setError('');
    } catch (err) {
      setError('Unable to get location. Please enable location services.');
      setFormData((prev) => ({ ...prev, gettingLocation: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.service) {
      setError('Please select a service');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please describe the issue');
      return;
    }

    if (!formData.address.trim()) {
      setError('Please enter your address');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!formData.userLocation) {
      setError('Please enable location access for matching');
      return;
    }

    onBookingSubmit({
      service: formData.service,
      description: formData.description,
      address: formData.address,
      phone: formData.phone,
      userLocation: formData.userLocation,
    });
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-card">
        <h2 className="form-title">📋 Request Service</h2>

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Service Selection */}
          <div className="form-group">
            <label htmlFor="service" className="form-label">
              Service Type *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleServiceChange}
              className="form-input form-select"
            >
              {Object.entries(SERVICE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {SERVICE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Describe the Issue *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Leaky tap in bathroom..."
              className="form-input form-textarea"
              rows="3"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Service Address *
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g., 123 Main Street, New Delhi"
              className="form-input"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g., +91 98765 43210"
              className="form-input"
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <div className="location-section">
              <label className="form-label">📍 Location *</label>
              {formData.userLocation ? (
                <div className="location-success">
                  <span>✓ Location detected</span>
                  <small>
                    {formData.userLocation.lat.toFixed(4)},
                    {formData.userLocation.lng.toFixed(4)}
                  </small>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={formData.gettingLocation || isLoading}
                  className="btn-location"
                >
                  {formData.gettingLocation ? '⏳ Getting Location...' : '📍 Enable Location'}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-submit"
          >
            {isLoading ? '🔄 Searching Helpers...' : '🚀 Find Helper'}
          </button>

          <p className="form-info">
            ✓ We'll find the nearest available helper within 15 minutes
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
