
import React, { useState } from "react";
import { autoAssignHelper } from "./SmartAutoAssign";

const UserLocationAssign = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [helper, setHelper] = useState(null);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(coords);
        console.log("User Location:", coords);

        // 🤖 AUTO ASSIGN HELPER
        const assigned = autoAssignHelper(coords, "plumbing");
        setHelper(assigned);
      },
      () => alert("Location permission needed")
    );
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>📍 Book Service</h2>

      <button onClick={getUserLocation}>
        Get My Location & Book Helper
      </button>

      {userLocation && (
        <div style={{ marginTop: 20 }}>
          <p>User Lat: {userLocation.lat}</p>
          <p>User Lng: {userLocation.lng}</p>
        </div>
      )}

      {helper && (
        <div style={{ marginTop: 30, background:"#eee", padding:20 }}>
          <h3>🎉 Helper Assigned!</h3>
          <p>Name: {helper.name}</p>
          <p>Rating: ⭐ {helper.rating}</p>
          <p>Distance: {helper.distance.toFixed(2)} km</p>
        </div>
      )}
    </div>
  );
};

export default UserLocationAssign;
