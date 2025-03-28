import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import jobsycnLogo from '../assets/logo3.png';
import { useAuth } from '../AuthContext'; 
import defaultProfilePicture from '../assets/company_logo.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaRegBell } from 'react-icons/fa';
import { postToEndpoint } from '../components/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faBell, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import EmployerInterviewConfirmed from './EmployerInterviwConfirm';
import ModalInterview from './InterviewScheduleModal';
import RescheduleMessage from './RescheduleMessage';
import { Navbar, Container, Row, Col, Nav, Dropdown, Button, Image } from "react-bootstrap";

function EmployerHeader() {
    const { user, logout } = useAuth(); 
    const [logo, setLogo] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotification] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null); 
    const notificationRef = useRef(null);

    const toggleNotifications = async () => {
        setNotificationOpen((prev) => !prev); 
        if (!notificationOpen && unreadCount > 0) {
            try {
                await postToEndpoint('/updateNotificationEmployer.php', {
                    employer_id: user.id,
                });
                setUnreadCount(0); 
            } catch (error) {
                console.error("Error updating notifications:", error);
            }
        }
    };
    const closeNotifications = () => {
        setNotificationOpen(false); 
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                closeNotifications();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNotification = async () => {
            if (!user?.id) {
                console.error('User ID is not available.');
                return;
            }
            try {
                const response = await postToEndpoint('/getEmployerNotif.php', { employer_id: user.id });
                if (response.data.notification) {
                    const unreadNotifications = response.data.notification.filter(
                        (notif) => notif.countRead === 0 
                    );
                    setNotification(response.data.notification);
                    setUnreadCount(unreadNotifications.length);
                } else {
                    console.error('No notification found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching notification:', error);
            }
        };
        fetchNotification();
        const intervalId = setInterval(fetchNotification, 10000); 
        return () => clearInterval(intervalId);
    }, [user?.id]); 

    function getRelativeTime(timestamp) {
        const now = new Date(); 
        const past = new Date(timestamp);
    
        const userTimezoneOffset = now.getTimezoneOffset() * 60000;
        past.setTime(past.getTime() - userTimezoneOffset);
    
        const diff = Math.floor((now - past) / 1000);
    
        if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
        const years = Math.floor(days / 365);
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
    const handleNotificationClick = (notif) => {
        setSelectedNotification(notif);
        setNotificationOpen(false);  
    
        if (notif.type === 'scheduled') {
            navigate(`/applicantdetails/${notif.application_id}/${notif.job_id}/${notif.applicant_id}/${notif.firstname}/${notif.lastname}`);
        } else if (notif.type === 'Pending') {
            navigate(`/applicantdetails/${notif.application_id}/${notif.job_id}/${notif.applicant_id}/${notif.firstname}/${notif.lastname}`);
        } else {
            setModalVisible(true);
        }
    };
    
    
    const [loading, setLoading] = useState(false);
    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            logout();
            navigate('/');
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        const fetchCompanyInfo = async () => {
          if (user?.id) {
            try {
              const response = await postToEndpoint('/getCompanyInfo.php', {
                employer_id: user.id,
              });
              if (response.data) {
                const { logo } = response.data;
                setLogo(logo ? logo : null);
              }
            } catch (error) {
              console.error('Error fetching company info:', error);
            }
          }
        };
    
        fetchCompanyInfo();
      }, [user]);

    const logoUrl = logo instanceof File ? URL.createObjectURL(logo) : logo;

    const toggleDropdown = (event) => {
        event.stopPropagation(); 
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
    
        const handlePageClick = () => {
            setDropdownOpen(false); 
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('click', handlePageClick);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('click', handlePageClick);
        };
    }, []);

    const handleOptionClick = () => setDropdownOpen(false);

    return (
        <>
        {loading && (
            <div id="preloader">
            </div>
        )}
    <Navbar expand="lg" className="job-sync-header p-3 border-bottom bg-white">
      <Container>
        <Row className="w-100 align-items-center justify-content-between">
          {/* Logo */}
          <Col xs="auto">
            <Navbar.Brand as={Link} to="/">
              <Image src={jobsycnLogo} alt="JobSync Logo" width="58" height="50" />
              <span className="ms-2 fw-bold fs-4">JobSync</span>
            </Navbar.Brand>
          </Col>

          {/* User Actions */}
          <Col xs="auto" className="d-flex align-items-center">
            {user ? (
              <>
                {/* Notifications */}
                <div className="notification-container me-3">
                <FontAwesomeIcon
                    icon={faBell}
                    className="notification-icon"
                    onClick={toggleNotifications}
                />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}

                {notificationOpen && (
                    <div className="notification-dropdown" ref={notificationRef}>
                        <div className="notification-arrow"></div>
                        <div className="notification-box">
                            <h5 className="notification-title">Notifications</h5>
                            <ul className="notification-list">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <li key={index} className="notification-item" onClick={() => handleNotificationClick(notif)}>
                                        <img src={notif.profile_picture || "default-logo.png"} 
                                            alt="Profile" 
                                            className="notification-img me-2" />
                                        <div className="notification-text">
                                            <strong>{notif.firstname} {notif.lastname}</strong>
                                            <span className="notification-message">
                                                {notif.message || "Details not available"}
                                            </span>
                                            <div className="notification-time">
                                                {getRelativeTime(notif.created_at)}
                                            </div>
                                        </div>
                                    </li>
                                ))
                                ) : (
                                    <li className="notification-empty">No notifications available.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', flexWrap: 'wrap' }}>
                    {/* Post a Job Button (Hidden on Mobile) */}
                    <Link to="/employer/postjob" className="d-none d-md-block">
                        <button
                            className="btn btn-primary me-3 custom-btn"
                            style={{
                                background: '#0A65CC',
                                padding: '10px 15px',
                                fontSize: '14px',
                                minWidth: '120px',
                                whiteSpace: 'nowrap',
                            }}
                            type="button"
                        >
                            Post A Job
                        </button>
                    </Link>

                    <div className="profile-pic" style={{ position: 'relative' }}>
                        <img
                            src={logoUrl || defaultProfilePicture}
                            alt="Profile"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div
                                className="dropdown-menu show"
                                ref={dropdownRef}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: '0',
                                    zIndex: 9,
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#fff',
                                    borderRadius: '0.25rem',
                                    overflow: 'hidden',
                                    paddingTop: '5px',
                                    paddingBottom: '5px',
                                    minWidth: '180px',
                                }}
                            >
                                <Link
                                    to="/employer/settings"
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={handleOptionClick}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#cfe7ff';
                                        e.target.style.color = '#0955b7';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#212529';
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCog} className="me-2" style={{ color: '#818181' }} />
                                    Settings
                                </Link>
                                <div className="dropdown-divider" style={{ margin: '0', borderTop: 'none' }}></div>
                                <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={handleLogout}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#cfe7ff';
                                        e.target.style.color = '#0955b7';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#212529';
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ color: '#dc3545' }} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline-primary" as={Link} to="/candidate_login" className="me-2">
                  Sign In
                </Button>
                <Button variant="primary" as={Link} to="/employer_login">
                  Post A Job
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
                                      {/* Modals */}
                                      {selectedNotification?.type === 'confirm' && (
                                            <EmployerInterviewConfirmed
                                            show={modalVisible}
                                            handleClose={() => setModalVisible(false)}
                                            interviewDetails={selectedNotification}
                                        />
                                    )}
                                        {selectedNotification?.type === 'qualified' &&(
                                            <ModalInterview
                                            show={modalVisible}
                                            handleClose={() => setModalVisible(false)}
                                            application_id={selectedNotification?.application_id}
                                            job_id={selectedNotification?.job_id}
                                            />
                                        )}
                                        {selectedNotification?.type === 'Reschedule' &&(
                                            <RescheduleMessage
                                            show={modalVisible}
                                            handleClose={() => setModalVisible(false)}
                                            application_id={selectedNotification?.application_id}
                                            job_id={selectedNotification?.job_id}
                                            />
                                        )}                                        
                                        {selectedNotification?.type === 'scheduled' &&(
                                            <Link to={`/applicantdetails/${selectedNotification.application_id}/${selectedNotification.job_id}/${selectedNotification.applicant_id}/${selectedNotification.firstname}/${selectedNotification.lastname}`} />
                                        )}  
                                        {selectedNotification?.type === 'On hold' &&(
                                            <Link to={`/applicantdetails/${selectedNotification.application_id}/${selectedNotification.job_id}/${selectedNotification.applicant_id}/${selectedNotification.firstname}/${selectedNotification.lastname}`} />
                                        )}  
      {/* Responsive Styles */}
      <style>{`
        /* Notification Icon */
        .notification-icon {
          font-size: 18px;
          color: #0A65CC;
          cursor: pointer;
        }

        /* Notification Badge */
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #dc3545;
          color: white;
          font-size: 10px;
          border-radius: 50%;
          padding: 2px 5px;
          font-weight: bold;
          text-align: center;
          width: 20px;
        }
        .notification-container {
            position: relative; /* Ensures dropdown is positioned relative to the bell icon */
            display: inline-block;
          }
          
          .notification-dropdown {
            position: absolute;
            top: 45px; /* Just below the bell */
            left: 50%;
            transform: translateX(-50%); /* Centers under the bell */
            z-index: 10;
            background-color: #fff;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            padding: 15px;
            text-align: start;
          }
          
        /* Notification List */
        .notification-list {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
        }

        .notification-img {
            width: 60px;  
            height: 60px;  
            border-radius: 50%;  
            object-fit: cover;  
            flex-shrink: 0;  
          }

        .notification-message {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* Limit to 2 lines */
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            color: #555;
            line-height: 1.5;
            max-height: 3em; /* Ensure it fits within 2 lines */
            word-break: break-word;
          }
          
        .notification-time {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }

        .notification-empty {
          text-align: center;
          padding: 15px;
          color: #777;
        }

        .notification-view-all {
          font-size: 14px;
          text-decoration: none;
          color: #0A65CC;
          padding: 0;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
            .notification-dropdown {
              width: 100%;
              max-width: 360px;
              right: 0;
            }
          }

          @media (max-width: 768px) {
            .notification-dropdown {
              position: fixed; /* Keeps it in center */
              top: 125px; /* Adjust below the navbar */
              left: 50%;
              transform: translateX(-50%);
              width: 90%;
              max-width: 400px;
              z-index: 1000;
            }
          
            /* Center Arrow */
            .notification-arrow {
              left: 50%;
              transform: translateX(-50%);
            }
          }
          

        @media (max-width: 576px) {
          .notification-dropdown {
            width: 95%;
            right: 2.5%;
          }
        }

        // half
        @media (max-width: 768px) {
            .custom-btn {
                display: none !important; /* Hides the Post Job button */
            }
        
            .profile-pic img {
                width: 35px;
                height: 35px;
            }
        
            .dropdown-menu {
                right: auto;
                left: 50%;
                transform: translateX(-50%);
                min-width: 160px;
            }
        }
        
        @media (max-width: 480px) {
            .profile-pic img {
                width: 30px;
                height: 30px;
            }
        
            .dropdown-menu {
                min-width: 140px;
            }
        }
        
      `}</style>
    </Navbar>

        </>
    );
}

export default EmployerHeader;
