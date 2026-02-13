// Example: Integrating Auto-Assignment into BookingForm.jsx

import React, { useState } from 'react';
import { helperDataService } from '../services/dataService';
import { bookingDataService } from '../services/dataService';
import { ensureHelperAvailable } from '../utils/matchingAlgorithm';

/**
 * Enhanced Booking Form with Automatic Worker Assignment
 * 
 * When user submits a booking:
 * 1. If helpers available within 15 minutes → assign existing helper
 * 2. If NO helpers available → automatically assign new worker
 */
const BookingFormWithAutoAssignment = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    location: { lat: null, lng: null },
  });
  
  const [loading, setLoading] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);

  /**
   * Handle booking submission with auto-assignment
   */
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAssignmentStatus('Finding available helper...');

    try {
      // Step 1: Validate location data
      if (!formData.location.lat || !formData.location.lng) {
        throw new Error('Location is required');
      }

      // Step 2: Use ensureHelperAvailable to get existing or new worker
      const helper = await ensureHelperAvailable(
        formData.location,
        formData.serviceType,
        userId
      );

      if (!helper) {
        throw new Error('Unable to assign a worker at this time');
      }

      // Step 3: Update status based on worker type
      if (helper.isNewWorker) {
        setAssignmentStatus('New worker assigned to your request!');
        setAssignedWorker({
          name: helper.name,
          eta: helper.eta,
          isNew: true,
        });
      } else {
        setAssignmentStatus('Helper found! Creating booking...');
        setAssignedWorker({
          name: helper.name,
          eta: helper.distance ? Math.ceil(helper.distance * 4) : 10, // Rough ETA calc
          isNew: false,
        });
      }

      // Step 4: Create booking in backend
      const booking = {
        userId,
        serviceType: formData.serviceType,
        description: formData.description,
        userLocation: formData.location,
        assignedHelperId: helper.id,
        helperStatus: helper.isNewWorker ? 'newly_assigned' : 'existing',
        estimatedArrival: helper.eta,
        createdAt: new Date().toISOString(),
      };

      const result = await bookingDataService.createBooking(booking);

      // Step 5: Success - show confirmation
      setAssignmentStatus('✓ Booking confirmed!');
      
      if (onSuccess) {
        onSuccess({
          bookingId: result.id,
          helper,
          booking,
        });
      }

      // Reset form
      setTimeout(() => {
        setFormData({ serviceType: '', description: '', location: { lat: null, lng: null } });
        setAssignmentStatus(null);
        setAssignedWorker(null);
      }, 3000);

    } catch (error) {
      console.error('Booking error:', error);
      setAssignmentStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alternative: Direct method for finding&assigning helper
   */
  const handleFindHelperDirectly = async () => {
    try {
      const helper = await helperDataService.findBestAvailableHelper(
        formData.location,
        formData.serviceType,
        userId
      );

      if (helper && helper.isNewWorker) {
        console.log('Auto-assigned new worker:', helper);
        setAssignedWorker(helper);
      }
    } catch (error) {
      console.error('Error finding helper:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Book a Service</h2>
      
      <form onSubmit={handleSubmitBooking}>
        <div style={{ marginBottom: '15px' }}>
          <label>Service Type</label>
          <select
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            required
          >
            <option value="">Select a service</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="repairs">General Repairs</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your service needs..."
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Location (Latitude, Longitude)</label>
          <input
            type="text"
            placeholder="40.7128, -74.0060"
            onChange={(e) => {
              const [lat, lng] = e.target.value.split(',').map(v => parseFloat(v.trim()));
              setFormData({ ...formData, location: { lat, lng } });
            }}
          />
        </div>

        {assignmentStatus && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <p>{assignmentStatus}</p>
            {assignedWorker && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <strong>{assignedWorker.name}</strong>
                {assignedWorker.isNew && <span style={{ color: 'green' }}> • NEW WORKER</span>}
                <p>ETA: {assignedWorker.eta} minutes</p>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Finding Worker...' : 'Book Service'}
        </button>
      </form>

      {/* Debug/Admin: Direct helper finding */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={handleFindHelperDirectly}
          style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#f50057',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          [DEV] Find Helper Only
        </button>
      )}
    </div>
  );
};

export default BookingFormWithAutoAssignment;

/**
 * USAGE IN APP:
 * 
 * import BookingFormWithAutoAssignment from './components/BookingFormWithAutoAssignment';
 * 
 * <BookingFormWithAutoAssignment 
 *   userId={currentUser.id}
 *   onSuccess={(result) => {
 *     console.log('Booking created:', result.bookingId);
 *     console.log('Helper assigned:', result.helper);
 *   }}
 * />
 */
