import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import defaultProfilePicture from '../assets/user_default.png';
import { postToEndpoint } from '../components/apiService';
import JobDetailsModal from '../components/jobdetailsmodal';
import InterviewDetailsModal from './InterviewDetailsModal';
import InterviewConfirmed from './InterviewConfirmed';
import SearchBarSection from './SearchBarSection';
import { faUserCircle, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav, Container, Button, Dropdown, Image, Badge } from "react-bootstrap";

function SearchJobs() {
    const [selected] = useState();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    
    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            logout();
            navigate('/');
            setLoading(false);
        }, 2000);
    };

    const [profile, setProfile] = useState(null);

    const fetchCompanyInfo = async () => {
        if (user?.id) {
            try {
                const response = await postToEndpoint('/getApplicantinfo.php', {
                    applicant_id: user.id,
                });
                if (response.data) {
                    const { profile } = response.data;
                    setProfile(profile ? profile : null);
                }
            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCompanyInfo();  

            const intervalId = setInterval(() => {
                fetchCompanyInfo(); 
            }, 50000); 

            return () => clearInterval(intervalId); 
        }
    }, [user?.id]); 

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = () => setDropdownOpen(false);

    const profileUrl = profile instanceof File ? URL.createObjectURL(profile) : profile;
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
                await postToEndpoint('/updateNotificationStatus.php', {
                    applicant_id: user.id,
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
                const response = await postToEndpoint('/getNotification.php', { applicant_id: user.id });
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
        const intervalId = setInterval(fetchNotification, 50000); 
        return () => clearInterval(intervalId);
    }, [user?.id]);  
    

    const handleNotificationClick = (notif) => {
        setSelectedNotification(notif);
        setModalVisible(true);
    };
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
    

    return (
        <>
        {loading && (
            <div id="preloader">
            </div>
        )}
            <Navbar expand="lg" expanded={isNavbarOpen} className="job-sync-header1 border-bottom" onToggle={() => setIsNavbarOpen(!isNavbarOpen)}>
                <Container>
                    {/* Logo */}
                    <Navbar.Brand as={Link} to="/">
                        <Image src={logo} alt="JobSync Logo" width="58" height="50" />
                        <span className="ms-2 fw-bold fs-4">JobSync</span>
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="navbar-nav"/>
                    <Navbar.Collapse id="navbar-nav" className="justify-content-between">
                        {/* Search Bar */}
                        <SearchBarSection />
                        
                        {/* User Actions */}
                        <Nav className="align-items-center navbar-container">
                            {user ? (
                                <>
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
                                                        <img src={notif.logo || "default-logo.png"} 
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
                                            {/* <div className="text-center">
                                                <button className="btn btn-link notification-view-all">
                                                    View All
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>
                                )}
                                </div>
                                <div className="profile-pic" style={{ position: 'relative' }}>
                                <img
                                                    src={profileUrl || defaultProfilePicture}
                                                    alt="Profile"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer', 
                                                        objectFit: 'cover'
                                                    }}
                                                    onClick={toggleDropdown}
                                                />
                                                {dropdownOpen && (
                                                    <div className="dropdown-menu show"
                                                        ref={dropdownRef}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: '0',
                                                            zIndex: 9,
                                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                            backgroundColor: '#fff',
                                                            borderRadius: '0.25rem',
                                                            overflow: 'hidden',
                                                            paddingTop: '5px',
                                                            paddingBottom: '5px'
                                                        }}
                                                    >
                                                        <Link
                                                            to="/applicantprofile"
                                                            className="dropdown-item d-flex align-items-center"
                                                            onClick={() => {
                                                                handleOptionClick();
                                                                setIsNavbarOpen(false);
                                                              }}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                transition: 'all 0.3s ease',
                                                                fontWeight: '500',
                                                                fontSize: '14px',
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#cfe7ff';
                                                                e.target.style.color = '#0955b7';
                                                                e.target.style.fontWeight = '500';
                                                                e.target.style.fontSize = '14px';
                                                                e.target.style.borderRadius = '0.5rem';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                                e.target.style.color = '#212529';
                                                                e.target.style.borderRadius = '0';
                                                            }}
                                                            
                                                        >
                                                            <FontAwesomeIcon icon={faUserCircle} className="me-2" style={{ color: '#126fc1' }} />
                                                            View Profile
                                                        </Link>
                                                        <Link
                                                            to="/applicants/applicantsettings"
                                                            className="dropdown-item d-flex align-items-center"
                                                            onClick={() => {
                                                                handleOptionClick();
                                                                setIsNavbarOpen(false);
                                                              }}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                transition: 'all 0.3s ease',
                                                                fontWeight: '500',
                                                                fontSize: '14px',
                                                                marginBottom: '5px'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#cfe7ff';
                                                                e.target.style.color = '#0955b7';
                                                                e.target.style.fontWeight = '500';
                                                                e.target.style.fontSize = '14px';
                                                                e.target.style.borderRadius = '0.5rem';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                                e.target.style.color = '#212529';
                                                                e.target.style.borderRadius = '0';
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faCog} className="me-2" style={{ color: '#818181' }} />
                                                            Settings
                                                        </Link>
                                                        <div className="dropdown-divider" style={{ margin: '0', borderTop: 'none' }}></div>
                                                        <button
                                                            className="dropdown-item d-flex align-items-center"
                                                            onClick={() => {
                                                                handleLogout();
                                                                setIsNavbarOpen(false);
                                                              }}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease',
                                                                fontWeight: '500',
                                                                fontSize: '14px',
                                                                marginTop: '5px',
                                                                
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#cfe7ff';
                                                                e.target.style.color = '#0955b7';
                                                                e.target.style.fontWeight = '500';
                                                                e.target.style.fontSize = '14px';
                                                                e.target.style.borderRadius = '0.5rem';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                                e.target.style.color = '#212529';
                                                                e.target.style.borderRadius = '0';
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ color: '#dc3545' }} />
                                                            Logout
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                </>
                            ) : (
                                <div className="auth-buttons" style={{width: '185px'}}>
                                     <Link to="/candidate_login" className="btn btn-outline-custom me-2 custom-btn">
                                        Sign In
                                    </Link>
                                    <Link to="/employer_login">
                                    <button
                                        className="btn btn-primary custom-btn"
                                        style={{ background: '#0A65CC' }}
                                        type="button"
                                    >
                                        Post A Job
                                    </button>
                                </Link>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Modals */}
            {selectedNotification?.type === 'interview' ? (
                <InterviewDetailsModal
                    show={modalVisible}
                    handleClose={() => setModalVisible(false)}
                    interviewDetails={selectedNotification}
                />
            ) : selectedNotification?.type === 'confirm' ? (
                <InterviewConfirmed
                    show={modalVisible}
                    handleClose={() => setModalVisible(false)}
                    interviewDetails={selectedNotification}
                />
            ) : (
                <JobDetailsModal
                    show={modalVisible}
                    handleClose={() => setModalVisible(false)}
                    application_id={selectedNotification?.application_id}
                    job_id={selectedNotification?.job_id}
                />
            )}
        <style>{`
            .navbar-toggler-icon {
                width: 1rem;
                height: 1.5em;
            }
            .job-sync-header1 {
                position: fixed; /* Fixes the header at the top */
                top: 56px;
                left: 0;
                width: 100%; /* Ensures full width */
                z-index: 1000; /* Keeps header above other content */
                background-color: #ffffff; /* Ensures background color is set */
              }
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
                  left: -450%;
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
                  .navbar-container {
                        display: ruby;
                    }
                  .notification-dropdown {
                    position: fixed; /* Keeps it in center */
                    top: 175px; /* Adjust below the navbar */
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
        </>
    );
}

export default SearchJobs;

