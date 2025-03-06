import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/MyNavbar.css';
import { useAuth } from '../AuthContext';
import { getFromEndpoint, postToEndpoint } from './apiService';

const USER_TYPES = {
    APPLICANT: 'applicant',
    EMPLOYER: 'employer',
};

const MyNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const navbarRef = useRef(null); 
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCounts = async () => {
            try {
                const [alertResponse, matchResponse] = await Promise.all([
                    getFromEndpoint('/fetch_unread_count.php'),
                    getFromEndpoint('/fetch_unread_match_count.php', { applicant_id: user?.id }),
                ]);

                const alertCount = alertResponse.data.success ? alertResponse.data.unread_count : 0;
                const matchCount = matchResponse.data.success ? matchResponse.data.unread_count : 0;

                setUnreadCount(alertCount + matchCount);
            } catch (error) {
                console.error('Error fetching unread counts:', error);
            }
        };

        fetchUnreadCounts();
    }, [user?.id]);

    const handleJobAlertClick = () => {
        Promise.all([
            postToEndpoint('/mark_as_read.php'),
            postToEndpoint('/mark_as_read_match.php', { applicant_id: user?.id }),
        ])
            .then(([alertResponse, matchResponse]) => {
                if (alertResponse.data.success || matchResponse.data.success) {
                    setUnreadCount(0);
                }
            })
            .catch(error => console.error('Error marking alerts as read:', error));
    };

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleNavbar = () => {
        setIsNavbarOpen(prevState => !prevState);
    };

    useEffect(() => {
        if (isNavbarOpen) {
            document.body.classList.add('navbar-open');
        } else {
            document.body.classList.remove('navbar-open');
        }
    }, [isNavbarOpen]);

    const handleNavClick = () => {
        setIsNavbarOpen(false);
        if (navbarRef.current) {
            navbarRef.current.classList.remove('show');  
        }
    };

    useEffect(() => {
        setIsNavbarOpen(false);
        if (navbarRef.current) {
            navbarRef.current.classList.remove('show');  
        }
    }, [location.pathname]);

    const renderNavLinks = () => {
        const commonLinks = (
            <>
                <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active-link' : ''} onClick={handleNavClick}>
                    Home
                </Nav.Link>
                <Nav.Link as={Link} to="/findjob" className={location.pathname === '/findjob' ? 'active-link' : ''} onClick={handleNavClick}>
                    Find Job
                </Nav.Link>
                <Nav.Link as={Link} to="/findemployer" className={location.pathname === '/findemployer' ? 'active-link' : ''} onClick={handleNavClick}>
                    Employers
                </Nav.Link>
                <Nav.Link as={Link} to="/customersupport" className={location.pathname === '/customersupport' ? 'active-link' : ''} onClick={handleNavClick}>
                    Customer Support
                </Nav.Link>
            </>
        );

        if (!user) {
            return commonLinks;
        } else if (user.userType === USER_TYPES.APPLICANT) {
            return (
                <>
                    <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active-link' : ''} onClick={handleNavClick}>
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/findjob" className={location.pathname === '/findjob' ? 'active-link' : ''} onClick={handleNavClick}>
                        Find Job
                    </Nav.Link>
                    <Nav.Link as={Link} to="/findemployer" className={location.pathname === '/findemployer' ? 'active-link' : ''} onClick={handleNavClick}>
                        Employers
                    </Nav.Link>
                    <Nav.Link as={Link} to="/applicants/overview" className={location.pathname === '/applicants/overview' ? 'active-link' : ''} onClick={handleNavClick}>
                        Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/applicants/jobsalert" className={location.pathname === '/applicants/jobsalert' ? 'active-link' : ''} onClick={() => { handleJobAlertClick(); handleNavClick();}}>
                        Job Alerts {unreadCount > 0 && <span className="badge bg-primary" style={{borderRadius: '50px', fontSize: '10px', position: 'relative', top: '-5px', left: '-1px'}}>{unreadCount}</span>}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/customersupport" className={location.pathname === '/customersupport' ? 'active-link' : ''} onClick={handleNavClick}>
                    Customer Support
                    </Nav.Link>
                </>
            );
        } else if (user.userType === USER_TYPES.EMPLOYER) {
            return (
                <>
                    <Nav.Link as={Link} to="/home" className={location.pathname === '/home' ? 'active-link' : ''} onClick={handleNavClick}>
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/employer/findapplicant" className={location.pathname === '/employer/findapplicant' ? 'active-link' : ''} onClick={handleNavClick}>
                        Find Applicant
                    </Nav.Link>
                    <Nav.Link as={Link} to="/employer/overview" className={location.pathname === '/employer/overview' || location.pathname === '/employer/profile' ||
                    location.pathname === '/employer/postjob' || location.pathname === '/employer/savedapplicant' || location.pathname === '/employer/settings' ? 'active-link' : ''} onClick={handleNavClick}>
                        Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/employer/myjobs" className={location.pathname === '/employer/myjobs' ? 'active-link' : ''} onClick={handleNavClick}>
                        My Jobs
                    </Nav.Link>
                    <Nav.Link as={Link} to="/employer/applications" className={location.pathname === '/employer/applications' ? 'active-link' : ''} onClick={handleNavClick}>
                        Applications
                    </Nav.Link>
                    <Nav.Link as={Link} to="/employer/interview" className={location.pathname === '/employer/interview' ? 'active-link' : ''} onClick={handleNavClick}>
                        Interview
                    </Nav.Link>
                    <Nav.Link as={Link} to="/customersupport" className={location.pathname === '/customersupport' ? 'active-link' : ''} onClick={handleNavClick}>
                    Customer Support
                    </Nav.Link>
                </>
            );
        }
    };



    return (
        <>
         <div>
            <Navbar style={{ backgroundColor: '#eaeaea', fontWeight: '400' }} expand="lg" fixed="top">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar} />
                    <Navbar.Collapse ref={navbarRef} id="basic-navbar-nav" className={isNavbarOpen ? 'show' : ''}>
                    <Nav className="me-auto">
                            {renderNavLinks()}
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link href="#">me.jobsync@gmail.com</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="navbar-padding"></div>
        </div>
        <style>{`
        /* Default Navbar Styling */
        .custom-navbar {
            background-color: #eaeaea;
            font-weight: 400;
            z-index: 1050;
        }
        
        /* Mobile dropdown adjustments */
        @media (max-width: 991px) {
            .navbar-collapse {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: white;
                z-index: 1000;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                padding: 10px 0;
            }

            /* Ensure page content is pushed down when navbar is open */
            body.navbar-open .navbar-padding {
                height: 200px; /* Adjust based on your navbar's height */
            }
        }

        `}</style></>
    );
};

export default MyNavbar;
