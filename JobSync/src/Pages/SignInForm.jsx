import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import React, { useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { postToEndpoint } from '../components/apiService';
import { useAuth } from '../AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Container, Row, Col, Button, Form, Card, Image } from 'react-bootstrap';
// import our_service from '../assets/our-services.jpg';
import { FaBriefcase, FaLock, FaUserShield } from 'react-icons/fa';

function SignInForm() { 
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth(); 

    const referrer = location.state?.from || '/applicants/overview';

    const [inputs, setInputs] = useState({ email: '', password: '' });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isEmailCorrect, setIsEmailCorrect] = useState(false);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [formType, setFormType] = useState('candidate');
    const [isRemembered, setIsRemembered] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    const [genericError, setGenericError] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingPage(false); 
        }, 500); 
    
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user) {
            navigate(referrer); 
        }

        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            setInputs({ email: savedEmail, password: savedPassword });
            setIsRemembered(true); 
        }
    }, [user, navigate, referrer]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));

        if (name === 'email') {
            setEmailError('');
            setIsEmailCorrect(false);
        }
        if (name === 'password') {
            setPasswordError('');
            setIsPasswordCorrect(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const loginData = new URLSearchParams({
            email: inputs.email,
            password: inputs.password,
            formType 
        });
    
        postToEndpoint('/login.php', loginData, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
            .then(response => {
                setLoading(false); 
                if (response.data.success) {
                    const userData = {
                        id: response.data.applicant_id,
                        firstname: response.data.firstname,
                        profilePicture: response.data.profile_picture,
                        userType: response.data.userType
                    };
                    login(userData); 
    
                    if (isRemembered) {
                        localStorage.setItem('email', inputs.email);
                        localStorage.setItem('password', inputs.password);
                    } else {
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                    }
    
                    navigate(referrer); 
                } else {
                    const errorMessage = response.data.error || '';
                    if (errorMessage.includes('email')) {
                        setEmailError("Incorrect email");
                        setIsEmailCorrect(false);
                    } else if (errorMessage.includes('password')) {
                        setPasswordError("Incorrect password");
                        setIsPasswordCorrect(false);
                    } else {
                        setGenericError(response.data.error || "Login failed. Please try again.");
                    }
                }
            })
            .catch(error => {
                setLoading(false); 
                console.error("Error submitting the form:", error);
                setGenericError("An error occurred while submitting the form. Please try again.");
            });
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            if (credentialResponse?.access_token) {
                const accessToken = credentialResponse.access_token;
    
                setLoading(true); 
                setTimeout(async () => {
                    try {
                        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            }
                        });
    
                        if (response.ok) {
                            const userProfile = await response.json();
                            const { email, family_name, given_name, picture } = userProfile;
    
                            try {
                                const postResponse = await postToEndpoint('/googleLogin.php', {
                                    email,
                                    family_name: family_name || "",
                                    given_name,
                                    profile_picture: picture,
                                    formType
                                });
    
                                if (postResponse.data.success) {
                                    login({
                                        id: postResponse.data.applicant_id,
                                        firstname: postResponse.data.firstname,
                                        profile_picture: postResponse.data.profile_picture,
                                        userType: postResponse.data.userType,
                                    });
    
                                    navigate(referrer);
                                } else {
                                    console.error('Failed to save user');
                                }
                            } catch (error) {
                                console.error("Error saving user to database:", error);
                            }
                        } else {
                            console.error("Failed to fetch user profile:", response.status);
                        }
                    } catch (error) {
                        console.error("Error fetching user profile:", error);
                    } finally {
                        setLoading(false);
                    }
                }, 2000); 
            } else {
                console.error("Access token not available");
            }
        },
        onError: () => {
            console.log('Login Failed');
        }
    });
    
    return (
        <>
        {loadingPage && (
            <div id="preloader">
            </div>
        )}

        {loading && (
            <div id="preloader">
            </div>
        )}
        <Container className="mt-5 paddings">
            <Row>
                <Col xs={12} lg={5}>
                    <h3 className="mb-3 text-start">Sign In</h3>
                    <h4 className="mb-4 text-start" style={{ fontSize: '15px' }}>
                        Don't have an account? <Link to="/registration" style={{ textDecoration: 'none', color: '#0A65CC' }}>Create Account</Link>
                    </h4>
                    <div className="d-flex justify-content-center mb-4">
                        <Card className="p-4 text-center w-100" style={{ backgroundColor: "aliceblue", borderRadius: "10px", maxWidth: "580px", boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 10px', border: 'none' }}>
                            <h5 className="mb-3">Sign In as</h5>
                            <div className="d-flex flex-column flex-sm-row justify-content-center">
                                <Button 
                                    className={`mx-1 mb-2 mb-sm-0 ${formType === "candidate" ? "active" : ""} btn5`}
                                    style={{ 
                                        backgroundColor: formType === "candidate" ? "rgb(24 99 185 / 80%)" : "white", 
                                        color: formType === "candidate" ? "white" : "black", 
                                        flexGrow: 1, 
                                        border:'none',
                                        cursor: 'default' 
                                    }}
                                    onClick={() => setFormType("candidate")}
                                >
                                    <FontAwesomeIcon icon={faUser} /> Candidate
                                </Button>
                                {/* <Link to="/employer_login" className="text-decoration-none">
                                    <Button 
                                        className={`mx-1 ${formType === "employer" ? "active" : ""} resp btn5`}
                                        style={{ 
                                            backgroundColor: formType === "employer" ? "#042852" : "white", 
                                            color: formType === "employer" ? "white" : "black", 
                                            flexGrow: 1, 
                                            width: "225px", 
                                            borderColor: "black" 
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faBuilding} /> Employer
                                    </Button>
                                </Link> */}
                            </div>
                        </Card>
                    </div>

                    <Form onSubmit={handleSubmit} style={{padding: '30px', background: 'aliceblue', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 10px', borderRadius: '10px'}}>
                    {genericError && <small style={{ position: 'relative', color: '#dc3545', bottom: '10px' }}>{genericError}</small>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                name='email'
                                className={`form-control register ${emailError ? 'border border-danger' : isEmailCorrect ? 'border border-success' : ''}`}
                                placeholder="Email"
                                onChange={handleChange}
                                value={inputs.email}
                                required
                            />
                            {emailError && <small className="text-danger">{emailError}</small>}
                        </Form.Group>
                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                name='password'
                                className={`form-control register ${passwordError ? 'border border-danger' : isPasswordCorrect ? 'border border-success' : ''}`}
                                placeholder="Password"
                                onChange={handleChange}
                                value={inputs.password}
                                required
                            />
                            <div
                                className="position-absolute"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                style={{
                                    right: '18px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#696969',
                                    cursor: 'pointer',
                                    zIndex: 2, 
                                    pointerEvents: 'auto',
                                }}
                            >
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </div>
                        </Form.Group>
                        {passwordError && <small className="text-danger mt-2">{passwordError}</small>}
                        <div className="d-flex justify-content-between mb-3">
                            <Form.Check 
                                type="checkbox" 
                                label="Remember Me" 
                                checked={isRemembered} 
                                onChange={() => setIsRemembered(!isRemembered)} 
                            />
                            <Link to="/forgotPassword" style={{ textDecoration: 'underline', color: '#0A65CC' }}>Forgot Password?</Link>
                        </div>
                        <div className="d-grid">
                            <Button type="submit" variant="primary" className="btn-custom w-100" style={{ backgroundColor: '#0A65CC', width: '700px', marginTop: '20px' }}>
                                Sign In <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </div>
                        <div className='text-muted text-center mt-3'>or</div>
                        <div className="d-grid">
                            <Button type='button' onClick={loginGoogle} variant="light" className="btn-custom w-100 mt-3"  style={{ backgroundColor: '#ffffff', width: '588px', marginTop: '20px', color: 'black'}}>
                                <img src="/assets/google.png" alt="Google Logo" style={{ width: '20px', marginRight: '10px' }} />
                                Sign in with Google
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={12} lg={7} className="d-none d-md-flex align-items-center justify-content-center">
                    <div
                        className=" position-relative w-100 d-flex align-items-center justify-content-center"
                        style={{
                            borderRadius: "20px",
                            minHeight: "400px",
                            overflow: "hidden", 
                        }}
                    >
                        <img 
                            src="https://img.freepik.com/free-vector/job-vacancy-isometric-illustration-with-hr-manager-looking-laptop-screen-with-resume-applicants-vector-illustration_1284-81713.jpg?t=st=1742575431~exp=1742579031~hmac=d55abd70aa9ff666d7a7d09288d2c8b8daf46a11185b0594779e5567be11f63c&w=740"  // Replace with your actual image path
                            alt="Job Search Banner"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",   
                                borderRadius: "20px",
                            }} 
                        />
                      <div className="position-absolute bottom-0 end-0 text-white text-center p-4">
                          <p>Image by <span style={{ color: '#1863b9' , fontWeight: 'bold' }}><a href="https://img.freepik.com/free-vector/job-vacancy-isometric-illustration-with-hr-manager-looking-laptop-screen-with-resume-applicants-vector-illustration_1284-81713.jpg?t=st=1742575431~exp=1742579031~hmac=d55abd70aa9ff666d7a7d09288d2c8b8daf46a11185b0594779e5567be11f63c&w=740" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></span></p>
                          </div>
                    </div>
                    </Col>


            </Row>
        </Container>

        <style>{`
            #root {
                    width: 100%;
                }
            /* Card Responsiveness */
            .btn5 {
                maxWidth: 270px;
            }
            .modern-login-card:hover {
                transform: scale(1.02);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            }
            .card {
                width: 100%;
                max-width: 100%;
                border-radius: 10px;
                background-color: #F1F2F4;
                padding: 1rem;
            }

            /* Buttons */
            .button-custom {
                width: 100%;
                max-width: 100%;
                transition: all 0.3s ease-in-out;
            }

            /* Form Inputs */
            .form-control {
                width: 100%;
            }

            /* Image Section */
            .image-container {
                position: relative;
                width: 100%;
            }

            /* Responsive Design */
            @media (max-width: 1390px) {
                .resp {
                    width: 193px !important;
                }
            }

            @media (max-width: 1195px) {
                .resp {
                    width: 153px !important;
                }
            }

            @media (max-width: 992px) {
                .resp {
                    width: 255px !important;
                }
            }

            @media (max-width: 768px) {
                .resp {
                    width: 225px !important;
                }
                .container {
                    margin-top: 8rerm !important;
                }
                
                .row {
                    flex-direction: column;
                }

                .col-md-6 {
                    width: 100%;
                    text-align: center;
                }

                .card {
                    max-width: 100%;
                }

                .button-custom {
                    max-width: 100%;
                }

                .image-container {
                    display: none;
                }
            }

            @media (max-width: 576px) {
                .paddings{
                    padding: 0 25px !important;     
                    margin-top: 8rem !important;
                }
                .btn5 {
                    width: 100% !important;
                }
                .container {
                    margin-top: 1rem;
                    padding: 0.5rem;
                }
                
                h3, h4, h5 {
                    font-size: 1rem;
                }

                .button-custom {
                    font-size: 0.9rem;
                }
            }
        `}</style>
        </>
    );
}

export default SignInForm;
