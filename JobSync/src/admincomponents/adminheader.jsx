import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Header = ({ username }) => {
  return (
    <header
      className="header d-flex justify-content-between align-items-center bg-white text-dark"
      style={{
        position: "fixed",
        top: "0",
        left: "0", 
        right: "0",
        zIndex: 10000, 
        borderBottom: "2px solid #ddd",
        padding: '0 20px' ,
        height: '80px'
      }}
    >
      {/* Logo and title */}
      <div className="d-flex align-items-center mb-5 mt-5" style={{ marginLeft: '10px' }}>
        <img src="/src/assets/logo3.png" alt="Logo" style={{ width: "50px" }} />
        <h2 className="ml-2">JobSync</h2>
      </div>

      {/* User info section */}
      <div className="user-info d-flex align-items-center">
        <span style={{ marginRight: '12px' }}>Welcome, <strong>{username}</strong></span>
        <FontAwesomeIcon icon={faBell} size="lg" style={{ marginRight: '12px', width: '25px', height: '25px' }} />
        
        {/* Sample image for the user avatar */}
        <img 
          src="/src/assets/berns.jpg" 
          alt="User Avatar" 
          style={{ width: '45px', height: '40px', borderRadius: '50%' }} 
        />
      </div>
    </header>
  );
};

export default Header;
