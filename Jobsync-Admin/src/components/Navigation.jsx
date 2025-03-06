import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import picture from '../assets/admin.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";
import '../loader.css';   
import { postToEndpoint } from "./apiService";

const Topbar = () => {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState([]);
  
  const [loading, setLoading] = useState(false); 
  const handleLogout = () => {
    setLoading(true);  
 
    setTimeout(() => {
      logout();  
      navigate('/');  
    }, 2000);
  };
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await postToEndpoint('/AdminInfo.php', { id: user.id });
        if (response && response.data && response.data.success) {
          setAdmin(response.data.admin);
        } else {
          console.error('Error: ', response.data.error || 'No response');
        }
      } catch (error) {
        console.error('Request failed: ', error);
      }
    };
      fetchAdmin();
  }, [user.id]);

  const alertsRef = useRef(null);
  const messagesRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        alertsRef.current && !alertsRef.current.contains(event.target) &&
        messagesRef.current && !messagesRef.current.contains(event.target) &&
        userRef.current && !userRef.current.contains(event.target)
      ) {
        setAlertsOpen(false);
        setMessagesOpen(false);
        setUserDropdownOpen(false);
      }
    };

    if (alertsOpen || messagesOpen || userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [alertsOpen, messagesOpen, userDropdownOpen]);

  return (
    <>
      {loading && (
        <div id="preloader">
        </div>
      )}
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <ul className="navbar-nav ml-auto">

          {/* Alerts Dropdown */}
          <li className="nav-item dropdown no-arrow mx-1" ref={alertsRef}>
            <button
              className="nav-link dropdown-toggle"
              onClick={() => setAlertsOpen(!alertsOpen)}
            >
              <i className="fas fa-bell fa-fw"></i>
              <span className="badge badge-danger badge-counter">3+</span>
            </button>
            <div
              className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${alertsOpen ? "show" : ""}`}
            >
              <h6 className="dropdown-header ms-0">Alerts Center</h6>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <div className="mr-3">
                  <div className="icon-circle bg-primary">
                    <i className="fas fa-file-alt text-white"></i>
                  </div>
                </div>
                <div>
                  <div className="small text-gray-500">December 12, 2019</div>
                  <span className="font-weight-bold">A new monthly report is ready to download!</span>
                </div>
              </a>
              <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
            </div>
          </li>

          {/* Messages Dropdown */}
          <li className="nav-item dropdown no-arrow mx-1" ref={messagesRef}>
            <button
              className="nav-link dropdown-toggle"
              onClick={() => setMessagesOpen(!messagesOpen)}
            >
              <i className="fas fa-envelope fa-fw"></i>
              <span className="badge badge-danger badge-counter">7</span>
            </button>
            <div
              className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${messagesOpen ? "show" : ""}`}
            >
              <h6 className="dropdown-header ms-0">Message Center</h6>
              <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
            </div>
          </li>

          <div className="topbar-divider d-none d-sm-block"></div>

          {/* User Information Dropdown */}
          <li className="nav-item dropdown no-arrow" ref={userRef}>
            <button
              className="nav-link dropdown-toggle"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">{admin.name || "User"}</span>
              <img className="img-profile rounded-circle" src={picture} alt="Profile" />
            </button>
            <div
              className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${userDropdownOpen ? "show" : ""}`}
            >
              <a className="dropdown-item" href="#">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i> Profile
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i> Settings
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i> Activity Log
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Topbar;
