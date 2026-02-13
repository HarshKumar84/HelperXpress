import React from 'react';
import '../styles/AuthNavbar.css';

const AuthNavbar = ({ onLogoClick }) => {
  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-container">
        <div className="auth-logo" onClick={onLogoClick}>
          <span className="auth-logo-emoji">⚡</span>
          <h1 className="auth-logo-text">HelperXpress</h1>
        </div>
        <p className="auth-tagline">15-Minute Guaranteed Service</p>
      </div>
    </nav>
  );
};

export default AuthNavbar;
