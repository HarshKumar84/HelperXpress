import React, { useEffect, useState } from "react";
import "../styles/HelperLocation.css";

const HelperLocation = ({ helperId = "H001" }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(true);
  const [updates, setUpdates] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported by this browser");
      return;
    }

    if (!tracking) return;

    // watchPosition = LIVE tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toLocaleTimeString(),
        };

        setLocation(coords);
        setError(null);
        setUpdates((prev) => prev + 1);

        // 🔥 Send to backend (hackathon demo = console)
        console.log("🧑‍🔧 Worker Live Location:", {
          workerId: helperId,
          ...coords,
        });

        // Example API call for production:
        /*
        fetch("http://localhost:5000/api/helpers/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            helperId,
            lat: coords.lat,
            lng: coords.lng,
            accuracy: coords.accuracy,
            timestamp: coords.timestamp,
          }),
        }).catch(err => console.error("Location update failed:", err));
        */
      },
      (error) => {
        console.error("❌ GPS Error:", error.message);
        setError(`GPS Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking, helperId]);

  const toggleTracking = () => {
    setTracking(!tracking);
  };

  const getAccuracyLevel = (accuracy) => {
    if (!accuracy) return "Unknown";
    if (accuracy < 10) return "🟢 Excellent (±" + accuracy.toFixed(1) + "m)";
    if (accuracy < 50) return "🟡 Good (±" + accuracy.toFixed(1) + "m)";
    if (accuracy < 100) return "🟠 Fair (±" + accuracy.toFixed(1) + "m)";
    return "🔴 Poor (±" + accuracy.toFixed(1) + "m)";
  };

  return (
    <div className="helper-location-container">
      <div className="location-header">
        <h3>📍 Live Location Tracking</h3>
        <button
          className={`tracking-btn ${tracking ? "active" : "inactive"}`}
          onClick={toggleTracking}
        >
          {tracking ? "🟢 Tracking Active" : "⭕ Tracking Off"}
        </button>
      </div>

      {error ? (
        <div className="location-error">
          <p>{error}</p>
          <small>Please enable location permissions in browser settings</small>
        </div>
      ) : location ? (
        <div className="location-info">
          <div className="location-stat">
            <span className="stat-label">Latitude:</span>
            <span className="stat-value">{location.lat.toFixed(6)}°</span>
          </div>

          <div className="location-stat">
            <span className="stat-label">Longitude:</span>
            <span className="stat-value">{location.lng.toFixed(6)}°</span>
          </div>

          <div className="location-stat">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{getAccuracyLevel(location.accuracy)}</span>
          </div>

          <div className="location-stat">
            <span className="stat-label">Last Update:</span>
            <span className="stat-value">{location.timestamp}</span>
          </div>

          <div className="location-stat">
            <span className="stat-label">Position Updates:</span>
            <span className="stat-value">{updates}</span>
          </div>

          <div className="location-status">
            <p>✅ Live location is being sent to the matching system...</p>
            <small>Updates sent every 5-10 seconds based on movement</small>
          </div>

          {/* Map Coordinates Display */}
          <div className="coordinates-display">
            <div className="coord-card">
              <h4>GPS Coordinates</h4>
              <code>
                <span title="Latitude">{location.lat.toFixed(4)}</span>,{" "}
                <span title="Longitude">{location.lng.toFixed(4)}</span>
              </code>
            </div>

            <div className="map-link">
              <a
                href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                🗺️ Open in Google Maps
              </a>
            </div>
          </div>

          {/* Connection Status */}
          <div className="connection-status">
            <div className="status-indicator connected">
              <span className="pulse"></span>
              <span>Connected & Syncing</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="location-loading">
          <p>⏳ Requesting location access...</p>
          <p className="loading-hint">Please allow location permission to continue</p>
          <div className="spinner"></div>
        </div>
      )}

      {/* API Integration Note */}
      <div className="api-info">
        <summary>🔧 Backend Integration Ready</summary>
        <details className="api-details">
          <p>
            To enable backend syncing, implement the endpoint:
          </p>
          <code>POST /api/helpers/update-location</code>
          <p>
            Body:
            <pre>
{"{\n  helperId: '" + helperId + "',\n  lat: " +
              (location?.lat.toFixed(6) || "28.6139") +
              ",\n  lng: " +
              (location?.lng.toFixed(6) || "77.2090") +
              ",\n  accuracy: " +
              (location?.accuracy?.toFixed(1) || "25") +
              "\n}"}
            </pre>
          </p>
        </details>
      </div>
    </div>
  );
};

export default HelperLocation;
