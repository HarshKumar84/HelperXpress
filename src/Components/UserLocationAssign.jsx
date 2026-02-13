import React, { useState, useContext } from "react";
import { HelperContext } from "../context/HelperContext";
import { ensureHelperAvailable } from "../utils/matchingAlgorithm";

const SERVICE_TYPES = [
  { value: "plumbing", label: "🔧 Plumbing" },
  { value: "electrical", label: "⚡ Electrical" },
  { value: "cleaning", label: "🧹 Cleaning" },
  { value: "carpentry", label: "🪚 Carpentry" },
  { value: "painting", label: "🎨 Painting" },
  { value: "ac-repair", label: "❄️ AC Repair" },
  { value: "pest-control", label: "🐜 Pest Control" },
  { value: "gardening", label: "🌳 Gardening" },
];

const UserLocationAssign = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [helper, setHelper] = useState(null);
  const [serviceType, setServiceType] = useState("plumbing");
  const [loading, setLoading] = useState(false);
  const { helpers } = useContext(HelperContext);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        console.log("User Location:", coords);
        // Use real matching logic
        const assigned = await ensureHelperAvailable(
          coords,
          serviceType,
          "user-demo",
          helpers
        );
        setHelper(assigned);
        setLoading(false);
      },
      () => {
        alert("Location permission needed");
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: 30, maxWidth: 400 }}>
      <h2>📍 Book Service</h2>
      <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
        Select Service Type:
      </label>
      <select
        value={serviceType}
        onChange={e => setServiceType(e.target.value)}
        style={{ fontSize: 16, padding: 6, marginBottom: 16, width: "100%" }}
      >
        {SERVICE_TYPES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <br />
      <button onClick={getUserLocation} disabled={loading} style={{ fontSize: 16, padding: "10px 20px", marginTop: 8 }}>
        {loading ? "Finding Helper..." : "Get My Location & Book Helper"}
      </button>
      {userLocation && (
        <div style={{ marginTop: 20 }}>
          <p>User Lat: {userLocation.lat}</p>
          <p>User Lng: {userLocation.lng}</p>
        </div>
      )}
      {helper && (
        <div style={{ marginTop: 30, background: "#eee", padding: 20, borderRadius: 10 }}>
          <h3>🎉 Helper Assigned!</h3>
          <p>Name: {helper.name}</p>
          <p>Rating: ⭐ {helper.rating}</p>
          <p>Distance: {helper.distance ? helper.distance.toFixed(2) : "-"} km</p>
          <p>Experience: {helper.experience} years</p>
          <p>Skills: {helper.skills && helper.skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default UserLocationAssign;
