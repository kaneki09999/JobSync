import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import React, { useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import { postToEndpoint } from '../components/apiService';
import { useAuth } from '../AuthContext';
import { Container, Row, Col, Form, Button, Card, Image } from "react-bootstrap";

function SignInEmployer() {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [formType, setFormType] = useState('employer');
    const [isRemembered, setIsRemembered] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isEmailCorrect, setIsEmailCorrect] = useState(null);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingPage(false); 
        }, 500); 
    
        return () => clearTimeout(timer);
    }, []);
    
    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    });
    
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        if (formType === 'employer') {
            const savedEmail = localStorage.getItem('employer_email');
            const savedPassword = localStorage.getItem('employer_password');
            if (savedEmail && savedPassword) {
                setInputs({ email: savedEmail, password: savedPassword });
                setIsRemembered(true); 
            }
        } else {
            setInputs({ email: '', password: '' });
            setIsRemembered(false);
        }
    }, [formType]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
        
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
                    id: response.data.employer_id,
                    firstname: response.data.firstname,
                    userType: response.data.userType
                };
                login(userData); 
    
                if (isRemembered) {
                    localStorage.setItem('employer_email', inputs.email);
                    localStorage.setItem('employer_password', inputs.password);
                } else {
                    localStorage.removeItem('employer_email');
                    localStorage.removeItem('employer_password');
                }
    
                if (response.data.profileIncomplete) {
                    navigate('/employer/companyprofile');
                } else {
                    navigate('/employer/overview');
                }
            } else {
                const errorMessage = response.data.error || '';
    
                if (typeof errorMessage === 'string' && errorMessage.includes('email')) {
                    setEmailError("Incorrect email");
                    setIsEmailCorrect(false);
                } else if (typeof errorMessage === 'string' && errorMessage.includes('password')) {
                    setPasswordError("Incorrect password");
                    setIsPasswordCorrect(false);
                } else {
                    alert(response.data.error || "Login failed. Please try again.");
                }
            }
        })
        .catch(error => {
            setLoading(false); 
            console.error("There was an error submitting the form!", error);
            alert("An error occurred while submitting the form. Please try again.");
        });
    };
    
    const renderFormFields = () => (
        <>
            <div className="mb-3">
                <input
                    type="email"
                    name='email'
                    className={`form-control register ${emailError ? 'border border-danger' : isEmailCorrect ? 'border border-success' : ''}`}
                    placeholder="Email"
                    onChange={handleChange}
                    value={inputs.email}
                    required
                />
                {emailError && <small className="text-danger">{emailError}</small>}
            </div>
            <div className="mb-3">
                <div className="position-relative">
                    <input
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
                        style={{
                            right: '18px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#696969',
                            cursor: 'pointer',
                            zIndex: 2, 
                            pointerEvents: 'auto',
                        }}
                        onClick={() => setPasswordVisible(!passwordVisible)} 
                    >
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </div>
                </div>
                {passwordError && <small className="text-danger">{passwordError}</small>}
            </div>
            <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={isRemembered} 
                        onChange={() => setIsRemembered(!isRemembered)} 
                    />
                    <label className="form-check-label">Remember Me</label>
                </div>
                <Link to="/forgot-password" style={{ textDecoration: 'underline', color: '#0A65CC' }}>Forgot Password?</Link>
            </div>
            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success btn-custom" style={{ backgroundColor: '#0A65CC', width: '700px', marginTop: '20px' }}>
                    Sign In <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </>
    );

    return (
        <>
        {loadingPage && (
            <div id="preloader">
            </div>
        )}
        {loading && (
            <div id="preloader">
                <div className="loader"></div>
            </div>
        )}
        <Container className="mt-5 paddings">
            <Row className="align-items-center justify-content-center">
                {/* Sign-in Section */}
                <Col xs={12} lg={5}className="mt-5">
                    <h3 className="mb-3 text-start">Sign In as Employer</h3>
                    <h4 className="mb-4 text-start" style={{ fontSize: "15px" }}>
                        Don't have an account?{" "}
                        <Link to="/registration_employer" style={{ textDecoration: "none", color: "#0A65CC" }}>
                            Create Account
                        </Link>
                    </h4>

                   
                    {/* Sign-in Form */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                className={`register ${emailError ? "border border-danger" : ""}`}
                                placeholder="Service Email or Business Email"
                                onChange={handleChange}
                                value={inputs.email}
                                required
                            />
                            {emailError && <small className="text-danger">{emailError}</small>}
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                className={`register ${passwordError ? "border border-danger" : ""}`}
                                placeholder="Password"
                                onChange={handleChange}
                                value={inputs.password}
                                required
                            />
                            <div
                                className="position-absolute"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                style={{
                                    right: "18px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#696969",
                                    cursor: "pointer",
                                    zIndex: 2,
                                }}
                            >
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </div>
                        </Form.Group>
                        {passwordError && <small className="text-danger">{passwordError}</small>}

                        <div className="d-flex justify-content-between mb-3">
                            <Form.Check type="checkbox" label="Remember Me" checked={isRemembered} onChange={() => setIsRemembered(!isRemembered)} />
                            <Link to="/forgotpassword" style={{ textDecoration: "underline", color: "#0A65CC" }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="d-grid">
                            <Button type="submit" className="btn-custom w-100" style={{ backgroundColor: "#0A65CC", marginTop: "20px" }}>
                                Sign In <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </div>
                    </Form>
                </Col>

                {/* Right-Side Image */}
                <Col xs={12} lg={7} className="d-none d-md-flex align-items-center justify-content-center">
                    <div className="position-relative w-100">
                        {/* Background Image */}
                        <Image
                        src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7962.jpg?t=st=1742353583~exp=1742357183~hmac=7a7cc4e9d5072a4a24c6af69975f9511b4a4df84c3b8e9f8d23026c4ea4db440&w=740"
                        alt="Registration Visual"
                        fluid
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        />
                   {/* Overlay Text */}
                   <div className="position-absolute bottom-0 end-0 text-white text-center p-4">
                          <p>Image by <span style={{ color: '#1863b9' , fontWeight: 'bold' }}><a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></span></p>
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
            .paddings {

            }
            .btn5 {
                maxWidth: 270px;
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

            .image-container img {
                width: 100%;
                height: auto;
                object-fit: cover;
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
                    margin-top: 5rem !important;
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

export default SignInEmployer;
