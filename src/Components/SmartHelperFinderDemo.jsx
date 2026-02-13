import React, { useState, useEffect } from 'react';
import smartHelperFinder from '../services/smartHelperFinder';
import '../styles/SmartHelperFinder.css';

/**
 * Smart Helper Finder Component
 * Demonstrates GPS-based nearest helper finding with auto-assignment
 */
const SmartHelperFinderDemo = () => {
  const [helpers, setHelpers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestHelper, setNearestHelper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [eta, setEta] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Mock helpers with GPS coordinates (demo data)
  const mockHelpers = [
    {
      id: 'helper1',
      name: 'John Smith',
      location: { lat: 40.7128, lng: -74.0060 },
      phone: '+1 (555) 123-4567',
      service: 'Plumbing',
      status: 'available',
      emoji: '🔧',
    },
    {
      id: 'helper2',
      name: 'Sarah Johnson',
      location: { lat: 40.7580, lng: -73.9855 },
      phone: '+1 (555) 234-5678',
      service: 'Electrical',
      status: 'available',
      emoji: '⚡',
    },
    {
      id: 'helper3',
      name: 'Mike Brown',
      location: { lat: 40.7489, lng: -73.9680 },
      phone: '+1 (555) 345-6789',
      service: 'Cleaning',
      status: 'available',
      emoji: '🧹',
    },
    {
      id: 'helper4',
      name: 'Emily Davis',
      location: { lat: 40.7505, lng: -73.9972 },
      phone: '+1 (555) 456-7890',
      service: 'Moving',
      status: 'available',
      emoji: '📦',
    },
  ];

  // Initialize helpers on component mount
  useEffect(() => {
    mockHelpers.forEach((helper) => {
      smartHelperFinder.helpers.addHelper(helper);
    });
    setHelpers(smartHelperFinder.helpers.getAllHelpers());
    setMessage('✅ Demo helpers loaded. Click "Find Nearest Helper"');
    
    return () => {
      if (watchId) {
        smartHelperFinder.stopTracking(watchId);
      }
    };
  }, []);

  // Find nearest helper based on user's GPS location
  const handleFindNearest = async () => {
    setLoading(true);
    setMessage('📍 Getting your location...');

    smartHelperFinder.findNearestHelperForUser(
      (result) => {
        setUserLocation(result.userLocation);
        setNearestHelper(result.helper);
        setEta(result.eta);

        if (result.status === 'FOUND') {
          setMessage(
            `✅ Found! ${result.helper.name} (${result.helper.distanceText}) - ETA: ${result.eta} min`
          );
        } else {
          setMessage(
            `⚠️ Nearest helper is far (${result.helper.distanceText}). Consider auto-assignment.`
          );
        }
        setLoading(false);
      },
      (error) => {
        setMessage(`❌ Error: ${error}`);
        setLoading(false);
      }
    );
  };

  // Find all helpers within 15km radius
  const handleFindAllAvailable = async () => {
    setLoading(true);
    setMessage('🔍 Searching for all available helpers...');

    smartHelperFinder.findAllAvailableHelpers(
      (result) => {
        setUserLocation(result.userLocation);
        setMessage(
          `✅ Found ${result.count} helper(s) within 15km radius!`
        );
        setLoading(false);
      },
      (error) => {
        setMessage(`❌ Error: ${error}`);
        setLoading(false);
      },
      15
    );
  };

  // Start real-time location tracking
  const handleStartTracking = () => {
    setLoading(true);
    setMessage('📍 Starting real-time location tracking...');

    const id = smartHelperFinder.trackUserLocationAndFindHelpers(
      (update) => {
        setUserLocation(update.userLocation);
        setNearestHelper(update.nearestHelper);
        setEta(update.nearestHelper ? Math.ceil((update.nearestHelper.distance / 60) * 60) : null);
        setMessage(
          `📍 Tracking live... Nearest: ${update.nearestHelper?.name || 'None'} (${update.availableHelpers.length} nearby)`
        );
        setLoading(false);
      },
      (error) => {
        setMessage(`❌ Tracking error: ${error}`);
        setLoading(false);
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  // Stop real-time tracking
  const handleStopTracking = () => {
    if (watchId) {
      smartHelperFinder.stopTracking(watchId);
      setWatchId(null);
      setIsTracking(false);
      setMessage('⏸️ Location tracking stopped');
    }
  };

  // Auto-assign helper (if none within 15 min, assigns new worker)
  const handleAutoAssign = async () => {
    setLoading(true);
    setMessage('🤖 Auto-assigning helper...');

    smartHelperFinder.autoAssignNearestHelper(
      (result) => {
        if (result.type === 'EXISTING_HELPER') {
          setMessage(
            `✅ Auto-assigned: ${result.helper.name} (${result.eta} min away)`
          );
          setNearestHelper(result.helper);
          setEta(result.eta);
        } else if (result.type === 'AUTO_ASSIGN_NEW_WORKER') {
          setMessage(
            `🆕 ${result.message} Nearest available: ${result.nearestHelper.name}`
          );
          setNearestHelper(result.nearestHelper);
        }
        setLoading(false);
      },
      (error) => {
        setMessage(`❌ Assignment failed: ${error}`);
        setLoading(false);
      }
    );
  };

  // Add mock helper location for demo
  const handleAddHelperLocation = () => {
    const newHelper = {
      id: `helper_${Date.now()}`,
      name: `Helper ${Math.floor(Math.random() * 1000)}`,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
      },
      phone: '+1 (555) 000-0000',
      service: 'General',
      status: 'available',
      emoji: '👤',
    };

    smartHelperFinder.helpers.addHelper(newHelper);
    setHelpers(smartHelperFinder.helpers.getAllHelpers());
    setMessage(`✅ New helper added at Lat: ${newHelper.location.lat.toFixed(4)}, Lng: ${newHelper.location.lng.toFixed(4)}`);
  };

  const helperStats = smartHelperFinder.getHelperStats();

  return (
    <div className="smart-helper-container">
      <div className="helper-card">
        <h1>🤖 Smart Helper Auto-Assignment</h1>
        <p className="subtitle">GPS-based nearest helper finder with automatic worker assignment</p>

        {/* Status Message */}
        {message && (
          <div className={`status-message ${message.includes('❌') ? 'error' : message.includes('✅') ? 'success' : 'info'}`}>
            {message}
          </div>
        )}

        {/* User Location Display */}
        {userLocation && (
          <div className="location-display">
            <h3>📍 Your Location</h3>
            <p>Latitude: {userLocation.lat.toFixed(4)}</p>
            <p>Longitude: {userLocation.lng.toFixed(4)}</p>
          </div>
        )}

        {/* Nearest Helper Display */}
        {nearestHelper && (
          <div className="nearest-helper-display">
            <h3>🎯 Nearest Helper Found</h3>
            <div className="helper-info">
              <div className="helper-emoji">{nearestHelper.emoji}</div>
              <div className="helper-details">
                <h4>{nearestHelper.name}</h4>
                <p>Service: {nearestHelper.service}</p>
                <p>Distance: {nearestHelper.distanceText}</p>
                <p>ETA: {eta} minutes</p>
                <p>Phone: {nearestHelper.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          <h3>Step 1: Add Helper Location</h3>
          <button
            className="btn btn-primary"
            onClick={handleAddHelperLocation}
            disabled={loading}
          >
            ➕ Add Helper Location
          </button>

          <h3>Step 2: Find Nearest Helper</h3>
          <div className="button-row">
            <button
              className="btn btn-primary"
              onClick={handleFindNearest}
              disabled={loading}
            >
              🔍 Find Nearest Helper
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleFindAllAvailable}
              disabled={loading}
            >
              👥 Find All Available
            </button>
          </div>

          <h3>Step 3: Real-time Tracking</h3>
          <div className="button-row">
            <button
              className={`btn ${isTracking ? 'btn-danger' : 'btn-success'}`}
              onClick={isTracking ? handleStopTracking : handleStartTracking}
              disabled={loading}
            >
              {isTracking ? '⏸️ Stop Tracking' : '▶️ Start Tracking'}
            </button>
          </div>

          <h3>Step 4: Auto-Assignment</h3>
          <button
            className="btn btn-warning"
            onClick={handleAutoAssign}
            disabled={loading}
          >
            🤖 Auto-Assign Helper
          </button>
        </div>

        {/* Helper Statistics */}
        <div className="stats-section">
          <h3>📊 Helper Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Helpers</span>
              <span className="stat-value">{helperStats.totalHelpers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available</span>
              <span className="stat-value">{helperStats.availableHelpers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Busy</span>
              <span className="stat-value">{helperStats.busyHelpers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Offline</span>
              <span className="stat-value">{helperStats.offlineHelpers}</span>
            </div>
          </div>
        </div>

        {/* Helpers List */}
        <div className="helpers-list-section">
          <h3>👥 All Helpers in System ({helpers.length})</h3>
          <div className="helpers-grid">
            {helpers.map((helper, index) => (
              <div key={helper.id} className="helper-item">
                <div className="helper-avatar">{helper.emoji}</div>
                <div className="helper-name">{helper.name}</div>
                <div className="helper-service">{helper.service}</div>
                <div className="helper-coords">
                  {helper.location.lat.toFixed(4)}, {helper.location.lng.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <h4>ℹ️ How This Works</h4>
          <ul>
            <li><strong>Step 1:</strong> Add helpers with GPS locations</li>
            <li><strong>Step 2:</strong> Get your GPS location and find nearest helper</li>
            <li><strong>Step 3:</strong> Track location in real-time</li>
            <li><strong>Step 4:</strong> Auto-assign if no helpers within 15 minutes</li>
            <li>Uses Haversine formula to calculate accurate distances</li>
            <li>ETA calculated assuming 60 km/h average speed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmartHelperFinderDemo;
